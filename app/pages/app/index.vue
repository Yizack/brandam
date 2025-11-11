<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });

const { data } = await useFetch("/api/brands", {
  key: "brands"
});

const isLoading = ref(false);
const form = useFormState({
  name: "",
  description: "",
  slug: ""
});

watch(() => form.value.name, (newName) => {
  form.value.slug = toSlug(newName);
});

const brandsStore = useBrandsStore();
brandsStore.setup(data.value || []);

const brands = computed(() => brandsStore.brands);

const isOpen = ref(false);
const createBrand = async () => {
  isLoading.value = true;
  brandsStore.createBrand(form.value).then(() => {
    form.reset();
    isOpen.value = false;
  }).catch(() => {}).finally(() => {
    isLoading.value = false;
  });
};

useHead({
  bodyAttrs: {
    class: "light:bg-primary/15"
  }
});
</script>

<template>
  <main class="p-6 md:p-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <BrandCard v-for="brand in brands" :key="brand.id" :brand="brand" />
      <UModal v-model:open="isOpen" title="Create Brand" description="Get started managing your brand assets." :close="{ variant: 'outline', class: 'rounded-full' }" :dismissible="false">
        <div class="light:bg-default dark:bg-muted rounded-lg border-2 border-dashed border-accented p-6 flex flex-col items-center justify-center text-center h-full hover:border-secondary transition-colors group">
          <div class="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-[1.1] transition-transform">
            <Icon name="lucide:plus" size="1.5em" />
          </div>
          <h3 class="font-medium mb-1">Create new Brand</h3>
          <p class="text-sm">Add a new brand to your workspace</p>
        </div>
        <template #body>
          <form class="space-y-3" @submit.prevent="createBrand">
            <InputFloating v-model.trim="form.name" type="text" placeholder="Brand name" required />
            <InputFloating v-model.trim="form.description" type="text" placeholder="Description" />
            <UFieldGroup class="form-input-group">
              <UBadge color="neutral" variant="soft" size="lg">{{ SITE.domain }}/</UBadge>
              <InputFloating id="slug" v-model.slug="form.slug" type="text" placeholder="Slug" required />
            </UFieldGroup>
            <UButton type="submit" variant="subtle" size="xl" class="rounded-lg font-bold" :disabled="isLoading" block>Create</UButton>
          </form>
        </template>
      </UModal>
    </div>
  </main>
</template>
