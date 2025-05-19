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
</script>

<template>
  <main class="p-6 md:p-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BrandCard v-for="brand in brands" :key="brand.id" :brand="brand" />
      <UModal :dismissible="false" title="Create Brand" description="Get started managing your brand assets." :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }">
        <div class="rounded-lg border-2 border-dashed border-accented p-6 flex flex-col items-center justify-center text-center h-full min-h-[240px] cursor-pointer hover:border-primary transition-colors">
          <div class="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <Icon name="lucide:plus" size="1.5em" />
          </div>
          <h3 class="font-medium mb-1">Create new Brand</h3>
          <p class="text-sm">Add a new brand to your workspace</p>
        </div>
        <template #body>
          <form>
            <InputFloating v-model="form.name" type="text" class="mb-3" placeholder="Brand name" required />
            <InputFloating v-model="form.description" type="text" class="mb-3" placeholder="Description" required />
            <div class="form-input-group">
              <p class="text-sm">{{ SITE.domain }}/</p>
              <InputFloating v-model="form.slug" type="text" placeholder="Slug" required />
            </div>
            <div class="grid mt-3">
              <UButton type="submit" variant="subtle" size="xl" class="text-center justify-center rounded-lg font-bold mb-2" :disabled="loading">Create</UButton>
            </div>
          </form>
        </template>
      </UModal>
    </div>
  </main>
</template>

<style>
.form-input-group {
  display: flex;
  width: 100%;
  align-items: stretch;
}

.form-input-group > :first-child:not(.form-input-floating) {
  padding: 0.5rem 1rem;
  background-color: var(--ui-bg-elevated);
  display: flex;
  align-items: center;
  border-radius: calc(var(--ui-radius) * 2) 0 0 calc(var(--ui-radius) * 2);
  border-width: 1px;
  border-style: solid none solid solid;
  border-color: var(--ui-border-accented);
}

.form-input-group > .form-input-floating {
  flex: 1;
  width: 100%;
}

.form-input-group > .form-input-floating:last-child > .from-input {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
