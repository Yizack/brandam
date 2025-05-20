<script setup lang="ts">
defineProps<{
  brand: BrandamBrand & {
    members: number;
    assets: number;
  };
}>();
</script>

<template>
  <NuxtLink :to="`/${brand.slug}`" class="bg-muted rounded-lg border-2 border-accented overflow-hidden hover:shadow-md hover:border-secondary cursor-pointer h-full flex flex-col hover:scale-[1.02] transition-transform duration-200" :title="brand.description">
    <div class="h-25 bg-primary">
      <div class="w-full h-full flex items-end p-4 bg-gradient-to-t from-slate-900/70 to-transparent">
        <h3 class="text-3xl font-semibold text-white">{{ brand.name }}</h3>
      </div>
    </div>
    <div class="p-4 flex-1 flex flex-col">
      <div class="mt-auto flex flex-wrap gap-1 md:items-center justify-between">
        <div class="flex gap-2">
          <div class="flex items-center text-sm">
            <Icon name="lucide:users" size="1.2em" class="text-secondary mr-1" />
            <span class="whitespace-nowrap">{{ brand.members }} {{ brand.members === 1 ? 'member' : 'members' }}</span>
          </div>
          <div class="flex items-center text-sm">
            <Icon name="lucide:box" size="1.2em" class="text-secondary mr-1" />
            <span class="whitespace-nowrap">{{ brand.assets }} {{ brand.assets === 1 ? 'asset' : 'assets' }}</span>
          </div>
        </div>
        <div class="text-xs">Updated {{ useTimeAgo(brand.updatedAt) }}</div>
      </div>
    </div>
  </NuxtLink>
</template>
