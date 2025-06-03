<script setup lang="ts">
const model = defineModel<BrandamBrand & {
  assets: BrandamAsset[];
  roleId?: BrandamMember["roleId"];
}>({ required: true });
</script>

<template>
  <div :style="{ height: '48px' }">
    <div class="fixed w-full bottom-0 z-50 light:bg-slate-900/80 dark:bg-slate-950/80 text-white backdrop-blur-sm">
      <UContainer class="flex items-center justify-between gap-1 py-2 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-2">
          <Icon name="lucide:shield-check" />
          <span class="font-medium">Admin Mode</span>
        </div>
        <div class="flex items-center gap-3">
          <ToolbarBrand v-model="model" />
          <ToolbarAssets v-model="model" />
        </div>
      </UContainer>
    </div>
  </div>
</template>
