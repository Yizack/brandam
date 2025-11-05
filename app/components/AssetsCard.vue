<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps<{
  assets: BrandamAsset[];
  brand: string;
}>();

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
        if (!confirm("Are you sure you want to delete this asset? This action cannot be undone.")) {
          return;
        }

        $fetch(`/api/brands/${props.brand}/assets/${uuid}`, {
          method: "DELETE"
        }).then(() => {
          const toast = useToast();
          toast.add({ title: "Asset Deleted", description: "The asset has been successfully deleted.", color: "success" });
        }).catch(() => {});
      }
    }
  ]
];

const isHovered = ref(false);
const isDropdownOpen = ref(false);
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
    <div v-for="asset of assets" :key="asset.uuid">
      <UModal :title="asset.name" :description="asset.data.content">
        <div class="bg-muted rounded-lg border-2 border-accented overflow-hidden cursor-pointer h-full flex flex-col transition-transform duration-200" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
          <div class="h-35 border-b border-muted relative">
            <img
              v-if="asset.data.type === 'image'"
              :src="getAssetImage(asset.uuid)"
              :alt="asset.name"
              class="w-full h-full object-cover duration-300"
              :class="{ 'brightness-25': isHovered || isDropdownOpen }"
            >
            <div
              class="w-full h-full absolute top-0 left-0 duration-300"
              :class="{ 'brightness-25': isHovered || isDropdownOpen }"
              :style="{ backgroundColor: asset.data.content }"
            />
            <div v-if="isHovered || isDropdownOpen" class="flex w-full h-full items-center justify-center text-white duration-300 absolute top-0 left-0">
              <p>View</p>
            </div>
            <UDropdownMenu v-if="isHovered || isDropdownOpen" v-model:open="isDropdownOpen" :items="getItems(asset.uuid)" :ui="{ content: 'w-48' }">
              <UButton
                class="absolute end-0 top-0 text-white! border border-transparent hover:border-white m-2 py-1"
                :class="{ 'border-white': isDropdownOpen }"
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
