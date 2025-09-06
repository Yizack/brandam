<script setup lang="ts">
const { data: brands } = await useFetch("/api/brands");

const toast = useToast();

const loading = ref(false);
const form = useFormState({
  name: "",
  description: "",
  slug: ""
});

watch(() => form.value.name, (newName) => {
  form.value.slug = toSlug(newName);
});

const closeCreate = ref(false);
const createBrand = async () => {
  loading.value = true;
  $fetch("/api/brands", {
    method: "POST",
    body: form.value
  }).then(() => {
    form.reset();
    closeCreate.value = false;
    toast.add({ title: SITE.name, description: "Your brand has been created", color: "success" });
  }).catch(() => {}).finally(() => {
    loading.value = false;
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
      <UModal v-model:open="closeCreate" title="Create Brand" description="Get started managing your brand assets." :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }" :dismissible="false">
        <div class="light:bg-default dark:bg-muted rounded-lg border-2 border-dashed border-accented p-6 flex flex-col items-center justify-center text-center h-full hover:border-secondary transition-colors group">
          <div class="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-[1.1] transition-transform">
            <Icon name="lucide:plus" size="1.5em" />
          </div>
          <h3 class="font-medium mb-1">Create new Brand</h3>
          <p class="text-sm">Add a new brand to your workspace</p>
        </div>
        <template #body>
          <form @submit.prevent="createBrand">
            <InputFloating v-model.trim="form.name" type="text" class="mb-3" placeholder="Brand name" required />
            <InputFloating v-model.trim="form.description" type="text" class="mb-3" placeholder="Description" />
            <UFieldGroup class="form-input-group">
              <UBadge color="neutral" variant="outline" size="lg">{{ SITE.domain }}/</UBadge>
              <InputFloating id="slug" v-model.slug="form.slug" type="text" placeholder="Slug" required />
            </UFieldGroup>
            <div class="grid mt-3">
              <UButton type="submit" variant="subtle" size="xl" class="justify-center rounded-lg font-bold" :disabled="loading">Create</UButton>
            </div>
          </form>
        </template>
      </UModal>
    </div>
  </main>
</template>
