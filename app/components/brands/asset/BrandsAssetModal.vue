<script setup lang="ts">
import mime from "mime";

const props = defineProps<{
  asset: BrandamAsset;
}>();

const brandStore = useBrandStore();

const assetCardPath = `/${brandStore.brand.slug}?asset=${props.asset.uuid}`;
const assetCardUrl = useOrigin(assetCardPath).url;

const route = useRoute("brand");
const open = ref(route.query.asset === props.asset.uuid);

watch(open, (value) => {
  if (value) return;
  const router = useRouter();
  router.replace({ query: undefined });
});
</script>

<template>
  <UModal
    v-model:open="open"
    :title="asset.name"
    scrollable
    :ui="{ content: asset.data.type !== 'color' ? 'max-w-7xl' : '' }"
    :close="{ variant: 'outline', class: 'rounded-full' }"
  >
    <slot />
    <template v-if="asset.data.type !== 'color'" #actions>
      <div class="ms-auto me-8 flex gap-2">
        <BrandsShare :path="assetCardPath" :description="`Share asset.`">
          <UButton label="Share" icon="lucide:arrow-big-right-dash" variant="subtle" color="neutral" class="rounded-lg" />
        </BrandsShare>
        <UButton label="Download" icon="lucide:download" variant="subtle" class="rounded-lg" @click="brandStore.downloadAsset(asset)" />
      </div>
    </template>
    <template #body>
      <div class="space-y-6">
        <div
          v-if="['image', 'vector'].includes(asset.data.type)"
          class="flex justify-center bg-accented rounded-lg p-4 shadow"
        >
          <img
            :src="getAssetImage(asset.uuid)"
            :alt="asset.name"
            class="max-h-98 object-contain"
            :class="{ 'h-98': asset.data.type === 'vector' }"
          >
        </div>
        <div v-else-if="asset.data.type === 'document'">
          <PDFNavigator :url="getAssetImage(asset.uuid)" class="bg-accented rounded-lg p-4" />
          <UButton
            class="p-0 pt-2"
            label="Open document in new tab"
            icon="lucide:external-link"
            :to="getAssetImage(asset.uuid)"
            target="_blank"
            variant="link"
          />
        </div>
        <div v-else class="h-48 rounded-lg" :style="{ backgroundColor: asset.data.content }" />
        <div class="text-sm space-y-4">
          <div v-if="asset.description" class="space-y-1">
            <h3 class="font-bold uppercase">Description</h3>
            <p>{{ asset.description }}</p>
          </div>
          <div v-if="asset.data.type === 'color' && asset.data.content" class="space-y-1">
            <h3 class="font-bold uppercase">Color Values</h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2 bg-muted rounded border border-accented overflow-hidden">
                <div class="flex items-center gap-2">
                  <span class="text-center uppercase font-medium p-2 bg-accented w-18 border-e border-e-accented">HEX</span>
                  <span class="font-mono">{{ asset.data.content }}</span>
                </div>
                <CopyButton :value="asset.data.content!" />
              </div>
              <div class="flex items-center justify-between gap-2 bg-muted rounded border border-accented">
                <div class="flex items-center gap-2">
                  <span class="text-center uppercase font-medium p-2 bg-accented w-18 border-e border-e-accented">RGB</span>
                  <span class="font-mono">{{ hexToRgb(asset.data.content) }}</span>
                </div>
                <CopyButton :value="hexToRgb(asset.data.content)" />
              </div>
              <div class="flex items-center justify-between gap-2 bg-muted rounded border border-accented">
                <div class="flex items-center gap-2">
                  <span class="text-center uppercase font-medium p-2 bg-accented w-18 border-e border-e-accented">CMYK</span>
                  <span class="font-mono">{{ hexToCmyk(asset.data.content) }}</span>
                </div>
                <CopyButton :value="hexToCmyk(asset.data.content)" />
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-1 gap-4" :class="{ 'sm:grid-cols-2 md:grid-cols-3': asset.data.type !== 'color' }">
              <template v-if="asset.data.type !== 'color' && asset.data.metadata">
                <div v-if="asset.data.metadata.size" class="space-y-1">
                  <p class="font-bold uppercase">Size</p>
                  <p>{{ formatFileSize(asset.data.metadata.size) }}</p>
                </div>
                <div v-if="asset.data.metadata.mimetype" class="space-y-1">
                  <p class="font-bold uppercase">Format</p>
                  <p class="uppercase">{{ mime.getExtension(asset.data.metadata.mimetype) }}</p>
                </div>
                <div v-if="asset.data.metadata.width && asset.data.metadata.height" class="space-y-1">
                  <p class="font-bold uppercase">Dimensions</p>
                  <p>{{ asset.data.metadata.width }} x {{ asset.data.metadata.height }} px</p>
                </div>
              </template>
              <div class="space-y-1">
                <p class="font-bold uppercase">Created</p>
                <NuxtTime
                  :datetime="asset.createdAt"
                  year="numeric"
                  month="long"
                  day="numeric"
                  hour="2-digit"
                  minute="2-digit"
                  title
                />
              </div>
            </div>
            <div class="space-y-1">
              <h3 class="font-bold uppercase">Asset Key</h3>
              <div class="flex items-center gap-2">
                <span class="font-mono">{{ asset.uuid }}</span>
                <CopyButton :value="asset.uuid" class="p-0" />
              </div>
            </div>
            <div class="space-y-1">
              <h3 class="font-bold uppercase">Link to asset card</h3>
              <UInput id="asset-url" :value="assetCardUrl" class="w-full font-mono" :ui="{ trailing: 'pr-0.5' }" readonly>
                <template #trailing>
                  <CopyButton :value="assetCardUrl" />
                </template>
              </UInput>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
