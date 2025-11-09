<script setup lang="ts">
import mime from "mime";
import type { DropdownMenuItem } from "@nuxt/ui";

defineProps<{
  asset: BrandamAsset;
}>();

const brandStore = useBrandStore();
const shareOpen = ref(false);

const getItems = (asset: BrandamAsset): DropdownMenuItem[][] => {
  const dropdownItems: DropdownMenuItem[][] = [[
    {
      label: "Share",
      icon: "lucide:arrow-big-right-dash",
      onSelect: () => { shareOpen.value = true; }
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

  if (brandStore.isAdmin) {
    dropdownItems.push([
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
</script>

<template>
  <BrandsAssetModal :asset="asset">
    <div class="bg-muted rounded-lg border-2 border-accented overflow-hidden cursor-pointer h-full flex flex-col transition-transform duration-200" @mouseenter="hoveredAsset = asset.uuid" @mouseleave="hoveredAsset = undefined">
      <div class="h-35 border-b border-muted relative bg-accented">
        <div class="size-full relative">
          <img
            v-if="['image', 'vector'].includes(asset.data.type)"
            :src="getAssetImage(asset.uuid)"
            :alt="asset.name"
            class="mx-auto center h-full"
          >
          <PDFPreview
            v-else-if="asset.data.type === 'document'"
            :url="getAssetImage(asset.uuid)"
          />
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
            class="absolute end-0 top-0 text-white! border border-transparent hover:border-white m-2 py-1"
            :class="{ 'border-white': isActive(asset.uuid) }"
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
            class="uppercase"
            variant="subtle"
          >
            {{ mime.getExtension(asset.data.metadata?.mimetype) }}
          </UBadge>
        </div>
        <p class="text-sm text-muted-foreground truncate">{{ asset.data.content }}</p>
      </div>
    </div>
    <BrandsShare
      v-model:open="shareOpen"
      :path="`/${brandStore.brand.slug}?asset=${asset.uuid}`"
      :description="`Share asset.`"
    />
  </BrandsAssetModal>
</template>
