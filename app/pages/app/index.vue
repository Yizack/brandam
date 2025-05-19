<script setup lang="ts">
const brands = [
  {
    id: 1,
    name: "Acme Corporation",
    description: "Global leader in innovative solutions",
    slug: "acme-corp",
    members: 2,
    assets: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30, // 1 month ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 30 // 1 month ago
  },
  {
    id: 2,
    name: "TechVision",
    description: "Reimagining technology for tomorrow",
    slug: "tech-vision",
    members: 1,
    assets: 3,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 7 // 1 week ago
  },
  {
    id: 3,
    name: "EcoSolutions",
    description: "Sustainable practices for a better planet",
    slug: "eco-solutions",
    members: 1,
    assets: 2,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 50,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 15
  }
];

const loading = ref(false);
const form = useFormState({
  name: "",
  description: "",
  slug: ""
});

watch(() => form.value.name, (newName) => {
  form.value.slug = toSlug(newName);
});

const createBrand = async () => {
  loading.value = true;
  $fetch("/api/brands", {
    method: "POST",
    body: form.value
  }).then(() => {
    form.reset();
  }).catch(() => {}).finally(() => {
    loading.value = false;
  });
};
</script>

<template>
  <main class="p-6 md:p-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BrandCard v-for="brand in brands" :key="brand.id" :brand="brand" />
      <UModal title="Create Brand" description="Get started managing your brand assets." :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }" :dismissible="false">
        <div class="bg-muted rounded-lg border-2 border-dashed border-accented p-6 flex flex-col items-center justify-center text-center h-full min-h-[240px] cursor-pointer hover:border-secondary transition-colors">
          <div class="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <Icon name="lucide:plus" size="1.5em" />
          </div>
          <h3 class="font-medium mb-1">Create new Brand</h3>
          <p class="text-sm">Add a new brand to your workspace</p>
        </div>
        <template #body>
          <form @submit.prevent="createBrand">
            <InputFloating v-model.trim="form.name" type="text" class="mb-3" placeholder="Brand name" required />
            <InputFloating v-model.trim="form.description" type="text" class="mb-3" placeholder="Description" />
            <div class="form-input-group">
              <p class="text-sm">{{ SITE.domain }}/</p>
              <InputFloating v-model.slug="form.slug" type="text" placeholder="Slug" required />
            </div>
            <div class="grid mt-3">
              <UButton type="submit" variant="subtle" size="xl" class="justify-center rounded-lg font-bold" :disabled="loading">Create</UButton>
            </div>
          </form>
        </template>
      </UModal>
    </div>
  </main>
</template>
