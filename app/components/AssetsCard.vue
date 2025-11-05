<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

defineProps<{
  assets: BrandamAsset[];
}>();

const brandStore = useBrandStore();

const getItems = (uuid: string): DropdownMenuItem[][] => [
  [
    { label: "Download", icon: "lucide:download" },
    { label: "Share", icon: "lucide:share-2" }
  ],
  [
    {
      label: "Delete",
      color: "error",
      icon: "i-lucide-trash",
      onClick: () => {
        if (!confirm("Are you sure you want to delete this asset? This action cannot be undone.")) return;
        brandStore.deleteAsset(uuid).catch(() => {});
      }
    }
  ]
];

const hoveredAsset = ref<string>();
const dropdownAsset = ref<string>();
const isActive = (uuid: string) => hoveredAsset.value === uuid || dropdownAsset.value === uuid;
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
    <div v-for="asset of assets" :key="asset.uuid">
      <UModal :title="asset.name" :description="asset.data.content">
        <div class="bg-muted rounded-lg border-2 border-accented overflow-hidden cursor-pointer h-full flex flex-col transition-transform duration-200" @mouseenter="hoveredAsset = asset.uuid" @mouseleave="hoveredAsset = undefined">
          <div class="h-35 border-b border-muted relative">
            <img
              v-if="asset.data.type === 'image'"
              :src="getAssetImage(asset.uuid)"
              :alt="asset.name"
              class="w-full h-full object-cover duration-300"
              :class="{ 'brightness-25': isActive(asset.uuid) }"
            >
            <div
              class="w-full h-full absolute top-0 left-0 duration-300"
              :class="{ 'brightness-25': isActive(asset.uuid) }"
              :style="{ backgroundColor: asset.data.content }"
            />
            <div v-if="isActive(asset.uuid)" class="flex w-full h-full items-center justify-center text-white duration-300 absolute top-0 left-0">
              <p>View</p>
            </div>
            <UDropdownMenu
              v-if="isActive(asset.uuid)"
              :items="getItems(asset.uuid)"
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
            <h3 class="text-lg font-semibold">{{ asset.name }}</h3>
            <p class="text-sm text-muted-foreground truncate">{{ asset.data.content }}</p>
          </div>
        </div>
        <template #body>
          {{ asset }}
        </template>
      </UModal>
    </div>
  </div>
</template>
