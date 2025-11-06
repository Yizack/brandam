<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const route = useRoute("brand");

const { data } = await useFetch(`/api/brands/${route.params.brand}`, {
  key: `brands:${route.params.brand}`
});

if (!data.value) {
  throw createError({
    statusCode: 404,
    message: "The requested brand does not exist."
  });
}

const brandStore = useBrandStore();
brandStore.setup(data.value);

const brand = computed(() => brandStore.brand);
const assets = computed(() => brandStore.assets);

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

const brandAssets = computed(() => {
  let assetsList = assets.value;

  if (filters.value.section !== "all") {
    assetsList = assetsList.filter(asset => asset.data.type === filters.value.section);
  }

  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase();
    assetsList = assetsList.filter(asset => asset.name.toLowerCase().includes(searchLower));
  }

  return assetsList;
});

const assetsData = computed(() =>
  assetTypes.map(type => ({
    type: type.name.plural,
    values: brandAssets.value.filter(asset => asset.data.type === type.value)
  }))
);
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
            <p>{{ assets.length }} Assets</p>
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
        <InputFloating id="search" v-model.trim="filters.search" type="search" icon="lucide:search" placeholder="Search for assets" />
      </UContainer>
    </div>
    <div class="py-10 px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
      <template v-for="(assetsByType, i) of assetsData" :key="i">
        <div v-if="assetsByType.values.length">
          <div class="flex flex-wrap gap-3 items-center mb-4">
            <h2 class="text-2xl font-bold">{{ assetsByType.type }}</h2>
            <USeparator orientation="vertical" class="h-6" />
            <p class="text-muted-foreground text-sm">{{ assetsByType.values.length }} Assets</p>
          </div>
          <AssetsCard :assets="assetsByType.values" />
        </div>
        <hr v-if="assetsByType.values.length && i < assetsData.length - 1" class="border-muted">
      </template>
    </div>
    <AdminToolbar v-if="brandStore.isAdmin" />
  </main>
</template>
