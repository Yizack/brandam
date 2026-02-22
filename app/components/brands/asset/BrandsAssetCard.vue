<script setup lang="ts">
import mime from "mime";
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps<{
  asset: BrandamAsset;
}>();

const brandStore = useBrandStore();
const { grants } = storeToRefs(brandStore);

const isShareOpen = ref(false);
const isEditOpen = ref(false);

const getItems = (asset: BrandamAsset): DropdownMenuItem[][] => {
  const dropdownItems: DropdownMenuItem[][] = [[
    {
      label: "Share",
      icon: "lucide:arrow-big-right-dash",
      onSelect: () => { isShareOpen.value = true; }
    }
  ]];

  const mainItems = dropdownItems[0]!;

  if (asset.data.type !== "color") {
    mainItems.unshift({
      label: "Download",
      icon: "lucide:download",
      color: "primary",
      onSelect: () => brandStore.downloadAsset(asset)
    });
  }

  if (grants.value.edit) {
    dropdownItems.push([
      {
        label: "Edit",
        icon: "lucide:pencil",
        onSelect: () => { isEditOpen.value = true; }
      },
      {
        label: "Delete",
        color: "error",
        icon: "lucide:trash",
        onSelect: () => brandStore.deleteAsset(asset).catch(() => {})
      }
    ]);
  }

  return dropdownItems;
};

const hoveredAsset = ref<string>();
const dropdownAsset = ref<string>();
const isActive = (uuid: string) => hoveredAsset.value === uuid || dropdownAsset.value === uuid;

if (props.asset.data.type === "font") {
  const assetFont = setAssetFont(props.asset);

  watch(() => props.asset.name, () => {
    assetFont.update();
  });
}
</script>

<template>
  <BrandsAssetModal :asset="asset">
    <div
      class="bg-muted rounded-lg shadow border border-accented overflow-hidden cursor-pointer h-full flex flex-col duration-200 transition-all"
      :class="{ 'border-secondary scale-[1.01]': isActive(asset.uuid) }"
      @mouseenter="hoveredAsset = asset.uuid"
      @mouseleave="hoveredAsset = undefined"
    >
      <div class="h-35 border-b border-muted relative bg-accented">
        <div class="size-full relative">
          <img
            v-if="asset.data.type === 'image' || asset.data.type === 'vector'"
            :src="asset.data.hasPreview ? getPreviewURL(asset.uuid) : getAssetURL(asset.uuid)"
            :alt="asset.name"
            class="mx-auto h-full object-contain"
            :style="{ backgroundColor: asset.data.bgColor }"
          >
          <template v-else-if="asset.data.type === 'document' && asset.data.metadata">
            <PreviewPDF
              v-if="mime.getExtension(asset.data.metadata.mimetype) === 'pdf'"
              :uuid="asset.uuid"
              preview
            />
            <PreviewTXT
              v-else-if="mime.getExtension(asset.data.metadata?.mimetype) === 'txt'"
              :uuid="asset.uuid"
              preview
            />
            <PreviewDOCX
              v-else-if="mime.getExtension(asset.data.metadata.mimetype) === 'docx'"
              :uuid="asset.uuid"
              preview
            />
          </template>
          <div
            v-else-if="asset.data.type === 'font'"
            class="size-full flex items-center justify-center text-6xl"
            :style="{ fontFamily: `'${asset.name}'` }"
          >
            <span>Aa Zz</span>
          </div>
          <div
            v-else
            :style="{ backgroundColor: asset.data.content }"
            class="size-full"
          />
          <div
            class="absolute inset-0 bg-black duration-300"
            :class="isActive(asset.uuid) ? 'opacity-75' : 'opacity-0'"
          />
        </div>
        <span v-if="isActive(asset.uuid)" class="absolute inset-0 flex items-center justify-center text-white font-medium">
          View
        </span>
        <UDropdownMenu
          v-if="isActive(asset.uuid)"
          :items="getItems(asset)"
          :ui="{ content: `w-48` }"
          @update:open="dropdownAsset = $event ? asset.uuid : undefined"
        >
          <UButton
            class="absolute end-0 top-0 text-white! border border-transparent hover:border-white m-2 py-1 rounded-lg"
            :class="{ 'border-white': dropdownAsset === asset.uuid }"
            variant="link"
            icon="lucide:ellipsis"
            @click.stop
          />
        </UDropdownMenu>
      </div>
      <div class="py-3 px-4">
        <div class="flex justify-between gap-2">
          <p class="text-lg font-semibold truncate">{{ asset.name }}</p>
          <UBadge
            v-if="asset.data.type !== 'color' && asset.data.metadata?.mimetype"
            color="neutral"
            class="uppercase rounded-lg"
            variant="subtle"
          >
            {{ mime.getExtension(asset.data.metadata?.mimetype) }}
          </UBadge>
        </div>
        <p class="text-sm text-muted-foreground truncate">{{ asset.data.content }}</p>
      </div>
    </div>
    <BrandsShare
      v-model:open="isShareOpen"
      :path="`/${brandStore.brand.slug}?asset=${asset.uuid}`"
      :description="`Share asset.`"
    />
    <BrandsAssetEdit
      v-model:open="isEditOpen"
      :asset="asset"
    />
  </BrandsAssetModal>
</template>
