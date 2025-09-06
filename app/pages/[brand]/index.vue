<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const route = useRoute("brand");
const { data: brand } = await useFetch(`/api/brands/${route.params.brand}`, {
  key: `brands:${route.params.brand}`
});

if (!brand.value) {
  throw createError({
    statusCode: 404,
    message: "The requested brand does not exist.",
    fatal: true
  });
}

const items: TabsItem[] = [
  { label: "All", value: "all", icon: "lucide:grid-2x2" },
  ...assetTypes.map(type => ({ label: type.name.plural, value: type.value, icon: type.icon }))
];

const sectionName = computed(() => {
  const item = items.find(item => item.value === filters.value.section);
  return item?.label;
});

const filters = ref({
  section: "all",
  search: ""
});

const isAdmin = computed(() => {
  return brand.value?.roleId === MemberRole.ADMIN || brand.value?.roleId === MemberRole.OWNER;
});

const assetsCount = computed(() => {
  return {
    images: brand.value?.assets.filter(asset => asset.data.type === "image").length || 0,
    vectors: brand.value?.assets.filter(asset => asset.data.type === "vector").length || 0,
    documents: brand.value?.assets.filter(asset => asset.data.type === "document").length || 0,
    fonts: brand.value?.assets.filter(asset => asset.data.type === "font").length || 0,
    colors: brand.value?.assets.filter(asset => asset.data.type === "color").length || 0
  };
});
</script>

<template>
  <main v-if="brand">
    <div class="bg-primary">
      <UContainer class="flex flex-col gap-3 py-8 px-4 sm:px-6 lg:px-8">
        <div class="text-inverted flex flex-wrap gap-3 items-center justify-between">
          <div class="sm:max-w-2/3 lg:max-w-3/4">
            <h1 class="text-4xl font-bold">{{ brand.name }}</h1>
            <p v-if="brand.description" class="mt-3">{{ brand.description }}</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <p>{{ brand.assets.length }} Assets</p>
            <USeparator color="neutral" orientation="vertical" class="h-6" />
            <ULink class="flex items-center gap-1 text-inverted hover:text-inverted/80 hover:underline">
              <Icon name="lucide:share" />
              <span>Share brand</span>
            </ULink>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-inverted text-center md:hidden mb-2 font-medium">{{ sectionName }}</p>
          <UTabs v-model="filters.section" :items="items" color="neutral" size="xl" :ui="{ label: 'hidden md:inline' }" />
        </div>
        <InputFloating v-model.trim="filters.search" icon="lucide:search" placeholder="Search for assets" />
      </UContainer>
    </div>
    <div class="py-10 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-wrap gap-3 items-center mb-4">
        <h2 class="text-2xl font-bold">Colors</h2>
        <USeparator orientation="vertical" class="h-6" />
        <p class="text-muted-foreground text-sm">{{ assetsCount.colors }} Assets</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        <CardColor v-for="asset of brand.assets" :key="asset.uuid" :asset="asset" />
      </div>
    </div>
    <AdminToolbar v-if="isAdmin" v-model="brand" />
  </main>
</template>
