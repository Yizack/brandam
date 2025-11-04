<script setup lang="ts">
defineProps<{
  asset: BrandamAsset;
}>();
</script>

<template>
  <UModal :title="asset.name" :description="asset.data.content">
    <div class="bg-muted rounded-lg border-2 border-accented overflow-hidden hover:shadow-md cursor-pointer h-full flex flex-col hover:scale-[1.02] transition-transform duration-200 group">
      <div class="h-35 border-b border-muted relative">
        <img :src="getAssetImage(asset.uuid)" :alt="asset.name" class="w-full h-full object-cover group-hover:brightness-75 duration-300">
        <div class="hidden group-hover:flex w-full h-full items-center justify-center text-white duration-300 absolute top-0 left-0">
          <p class="">View</p>
        </div>
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
</template>
