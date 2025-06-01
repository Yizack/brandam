<script setup lang="ts">
const model = defineModel<BrandamBrand & {
  assets: BrandamAsset[];
  roleId?: BrandamMember["roleId"];
}>({ required: true });
</script>

<template>
  <div class="fixed w-full bottom-0 py-2 z-50 bg-inverted/80 text-inverted backdrop-blur-md">
    <div class="flex items-center justify-between gap-1 mx-auto max-w-(--ui-container) px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2">
        <Icon name="lucide:shield-check" />
        <span class="font-medium">Admin Mode</span>
      </div>
      <div class="flex items-center gap-3">
        <ToolbarBrand v-model="model" />
        <ToolbarAssets v-model="model" />
      </div>
    </div>
  </div>
</template>
