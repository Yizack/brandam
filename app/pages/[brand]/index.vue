<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const route = useRoute("brand");
const { data: brand } = await useFetch(`/api/brands/${route.params.brand}`, {
  key: `brands:${route.params.brand}`
});

const items = ref([
  {
    label: "All",
    icon: "lucide:grid-2x2",
    value: "all"
  },
  {
    label: "Images",
    icon: "lucide:images",
    value: "images"
  },
  {
    label: "Vectors",
    icon: "lucide:pen-tool",
    value: "vectors"
  },
  {
    label: "Documents",
    icon: "lucide:file-text",
    value: "documents"
  },
  {
    label: "Fonts",
    icon: "lucide:type",
    value: "fonts"
  },
  {
    label: "Colors",
    icon: "lucide:palette",
    value: "colors"
  }
] satisfies TabsItem[]);

const sectionName = computed(() => {
  const item = items.value.find(item => item.value === filters.value.section);
  return item?.label;
});

const filters = ref({
  section: "all",
  search: ""
});
</script>

<template>
  <main>
    <div v-if="brand" class="bg-primary">
      <div class="flex flex-col gap-3 max-w-(--ui-container) mx-auto p-4 sm:px-6 lg:px-8">
        <div class="text-inverted">
          <h1 class="text-2xl font-bold">{{ brand.name }}</h1>
          <p v-if="brand.description" class="text-sm mt-1">
            {{ brand.description }}
          </p>
        </div>
        <div>
          <p class="text-inverted text-center md:hidden mb-2">{{ sectionName }}</p>
          <UTabs v-model="filters.section" :items="items" color="neutral" size="xl" :ui="{ label: 'hidden md:inline' }" />
        </div>
        <InputFloating v-model.trim="filters.search" icon="lucide:search" placeholder="Search for assets" />
      </div>
    </div>
  </main>
</template>
