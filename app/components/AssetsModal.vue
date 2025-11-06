<script setup lang="ts">
defineProps<{
  asset: BrandamAsset;
}>();

const brandStore = useBrandStore();

const { copy, copied } = useClipboard();
</script>

<template>
  <UModal :title="asset.name" scrollable :ui="{ content: 'max-w-7xl' }" :close="{ variant: 'outline', class: 'rounded-full' }">
    <slot />
    <template v-if="asset.data.type !== 'color'" #actions>
      <div class="ms-auto me-8 flex gap-2">
        <UButton icon="lucide:arrow-big-right-dash" variant="soft" color="neutral">
          Share
        </UButton>
        <UButton icon="lucide:download" variant="soft" @click="brandStore.downloadAsset(asset)">
          Download
        </UButton>
      </div>
    </template>
    <template #body>
      <div class="space-y-6">
        <div v-if="['image', 'vector'].includes(asset.data.type)" class="flex justify-center bg-accented rounded-lg p-4">
          <img
            :src="getAssetImage(asset.uuid)"
            :alt="asset.name"
            class="max-h-96 object-contain"
          >
        </div>
        <div v-else class="h-48 rounded-lg" :style="{ backgroundColor: asset.data.content }" />
        <div class="text-sm space-y-4">
          <div v-if="asset.description" class="space-y-2">
            <h3 class="font-semibold uppercase">Description</h3>
            <p>{{ asset.description }}</p>
          </div>
          <div class="space-y-2">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <template v-if="asset.data.type !== 'color' && asset.data.metadata">
                <div v-if="asset.data.metadata.size">
                  <p class="font-medium uppercase">Size</p>
                  <p>{{ formatFileSize(asset.data.metadata.size) }}</p>
                </div>
                <div v-if="asset.data.metadata.mimetype">
                  <p class="font-medium uppercase">Format</p>
                  <p class="uppercase">{{ getFileExtension(asset.data.metadata.mimetype) }}</p>
                </div>
                <div v-if="asset.data.metadata.width && asset.data.metadata.height">
                  <p class="font-medium uppercase">Dimensions</p>
                  <p>{{ asset.data.metadata.width }} × {{ asset.data.metadata.height }} px</p>
                </div>
              </template>
              <div v-if="asset.data.type === 'color'">
                <p class="font-medium uppercase">Color</p>
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded border border-border" :style="{ backgroundColor: asset.data.content }" />
                  <p class="uppercase">{{ asset.data.content }}</p>
                </div>
              </div>
              <div>
                <p class="font-medium uppercase">Created</p>
                <NuxtTime :datetime="asset.createdAt" title />
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <h3 class="font-semibold uppercase">Asset Key</h3>
            <div class="flex items-center gap-2">
              <UInput :value="asset.uuid" class="w-full font-mono" :ui="{ trailing: 'pr-0.5' }" readonly>
                <template #trailing>
                  <UTooltip text="Copy to clipboard" :content="{ side: 'top' }">
                    <UButton
                      :color="copied ? 'success' : 'neutral'"
                      variant="link"
                      :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                      aria-label="Copy to clipboard"
                      @click="copy(asset.uuid)"
                    />
                  </UTooltip>
                </template>
              </UInput>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
