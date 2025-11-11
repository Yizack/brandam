<script setup lang="ts">
const isLoading = ref(false);

const brandStore = useBrandStore();
const { brand, grants } = storeToRefs(brandStore);

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
  isLoading.value = true;
  brandStore.updateBrand(brandForm.value).then(() => {
    brandForm.update(brandForm.value);
    isBrandOpen.value = false;
  }).catch(() => {}).finally(() => {
    isLoading.value = false;
  });
};
</script>

<template>
  <UModal v-model:open="isBrandOpen" title="Edit Brand" description="Manage your brand settings." :close="{ variant: 'outline', class: 'rounded-full' }" :dismissible="false" @close:prevent="onCloseBrand">
    <UButton icon="lucide:cog" color="neutral" variant="subtle" label="Brand Settings" class="rounded-lg" />
    <template #body>
      <form class="space-y-3" @submit.prevent="editBrand">
        <h3 class="text-highlighted text-sm font-semibold">Brand Information</h3>
        <div class="space-y-3">
          <InputFloating v-model.trim="brandForm.name" type="text" placeholder="Brand name" :readonly="!grants.admin" required />
          <InputFloating v-model.trim="brandForm.description" type="text" placeholder="Description" :readonly="!grants.admin" />
          <UFieldGroup class="form-input-group">
            <UBadge color="neutral" variant="soft" size="lg">{{ SITE.domain }}/</UBadge>
            <InputFloating v-model.slug="brandForm.slug" type="text" placeholder="Slug" :readonly="!grants.owner" required />
          </UFieldGroup>
          <div class="grid">
            <UButton
              :label="grants.admin ? 'Edit' : 'View Only'"
              type="submit"
              variant="subtle"
              size="xl"
              class="justify-center rounded-lg font-bold"
              :disabled="isLoading || !grants.admin"
            />
          </div>
        </div>
      </form>
      <USeparator class="my-6" />
      <BrandsSettingsDomains />
    </template>
  </UModal>
</template>
