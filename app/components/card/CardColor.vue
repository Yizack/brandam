<script setup lang="ts">
defineProps<{
  asset: BrandamAsset;
}>();
</script>

<template>
  <UModal :title="asset.data.content" :description="asset.name">
    <div class="bg-muted rounded-lg border-2 border-accented overflow-hidden hover:shadow-md cursor-pointer h-full flex flex-col hover:scale-[1.02] transition-transform duration-200 group">
      <div class="h-35 border-b border-muted relative">
        <div class="w-full h-full absolute top-0 left-0 group-hover:brightness-25 duration-300" :style="{ backgroundColor: asset.data.content }" />
        <div class="hidden group-hover:flex items-center justify-center h-full text-white duration-300">
          <p class="z-10">View</p>
        </div>
      </div>
      <div class="py-3 px-4">
        <h3 class="text-lg font-semibold">{{ asset.name }}</h3>
        <p class="text-sm text-muted-foreground">{{ asset.data.content }}</p>
      </div>
    </div>
    <template #body>
      {{ asset }}
    </template>
  </UModal>
</template>
