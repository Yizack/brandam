<script setup lang="ts">
const loading = ref(false);

const brandStore = useBrandStore();
const { brand } = storeToRefs(brandStore);

const brandForm = useFormState({
  name: brand.value.name,
  description: brand.value.description || "",
  slug: brand.value.slug
});

const brandHasChanges = computed(() => {
  return brandForm.value.name !== brand.value.name
    || brandForm.value.description !== (brand.value.description || "")
    || brandForm.value.slug !== brand.value.slug;
});

const isBrandOpen = ref(false);

const onCloseBrand = () => {
  if (!brandHasChanges.value) return;
  brandForm.reset();
};

const editBrand = async () => {
  loading.value = true;
  brandStore.updateBrand(brandForm.value).then(() => {
    brandForm.update(brandForm.value);
    isBrandOpen.value = false;
  }).catch(() => {}).finally(() => {
    loading.value = false;
  });
};
</script>

<template>
  <UModal v-model:open="isBrandOpen" title="Edit Brand" description="Manage your brand settings." :close="{ variant: 'outline', class: 'rounded-full' }" :dismissible="false" @close:prevent="onCloseBrand">
    <UButton icon="lucide:cog" color="neutral" variant="soft" label="Brand Settings" class="rounded-lg" />
    <template #body>
      <form @submit.prevent="editBrand">
        <h3 class="text-highlighted text-sm font-semibold mb-1">Brand Information</h3>
        <div class="space-y-3 mt-3">
          <InputFloating v-model.trim="brandForm.name" type="text" placeholder="Brand name" required />
          <InputFloating v-model.trim="brandForm.description" type="text" placeholder="Description" />
          <UFieldGroup class="form-input-group mb-3">
            <UBadge color="neutral" variant="outline" size="lg">{{ SITE.domain }}/</UBadge>
            <InputFloating v-model.slug="brandForm.slug" type="text" placeholder="Slug" required />
          </UFieldGroup>
          <div class="grid">
            <UButton type="submit" variant="subtle" size="xl" class="justify-center rounded-lg font-bold" :disabled="loading">
              Edit
            </UButton>
          </div>
        </div>
      </form>
      <USeparator class="my-6" />
      <BrandsSettingsDomains />
    </template>
  </UModal>
</template>
