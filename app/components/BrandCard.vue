<script setup lang="ts">
defineProps<{
  brand: BrandamBrand & {
    members: number;
    assets: number;
  };
}>();
</script>

<template>
  <NuxtLink :to="`/${brand.slug}`" class="bg-muted rounded-lg border border-accented shadow-sm overflow-hidden hover:shadow-md hover:border-secondary cursor-pointer h-full flex flex-col hover:scale-[1.02] transition-transform duration-200">
    <div class="h-40 bg-cover bg-center" :style="`background-image: url('https://images.pexels.com/photos/2312369/pexels-photo-2312369.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');`">
      <div class="w-full h-full flex items-end p-4 bg-gradient-to-t from-slate-900/70 to-transparent">
        <h3 class="text-xl font-semibold text-white">{{ brand.name }}</h3>
      </div>
    </div>
    <div class="px-6 py-4 flex-1 flex flex-col">
      <p class="text-sm line-clamp-2 mb-4">{{ brand.description }}</p>
      <div class="mt-auto flex items-center justify-between">
        <div class="flex gap-2">
          <div class="flex items-center text-sm">
            <Icon name="lucide:users" size="1.2em" class="text-primary mr-1" />
            <span>{{ brand.members }} {{ brand.members === 1 ? 'member' : 'members' }}</span>
          </div>
          <div class="flex items-center text-sm">
            <Icon name="lucide:box" size="1.2em" class="text-primary mr-1" />
            <span>{{ brand.members }} {{ brand.members === 1 ? 'asset' : 'assets' }}</span>
          </div>
        </div>
        <div class="text-xs">Updated {{ useTimeAgo(brand.updatedAt) }}</div>
      </div>
    </div>
  </NuxtLink>
</template>
