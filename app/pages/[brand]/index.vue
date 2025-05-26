<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const route = useRoute("brand");
const { data: brand } = await useFetch(`/api/brands/${route.params.brand}`, {
  key: `brands:${route.params.brand}`,
  lazy: import.meta.dev // TODO: remove in nuxt >3.17.4
});

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
</script>

<template>
  <main>
    <div v-if="brand" class="bg-primary">
      <div class="flex flex-col gap-3 max-w-(--ui-container) mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
      </div>
      <AdminBar v-if="isAdmin" v-model="brand" />
    </div>
  </main>
</template>
