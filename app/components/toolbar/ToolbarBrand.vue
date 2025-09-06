<script setup lang="ts">
/* Brand Settings */
const toast = useToast();
const loading = ref(false);

const model = defineModel<BrandamBrand>({ required: true });

const brandForm = useFormState({
  name: model.value.name,
  description: model.value.description || "",
  slug: model.value.slug
});

const brandHasChanges = computed(() => {
  return brandForm.value.name !== model.value.name
    || brandForm.value.description !== (model.value.description || "")
    || brandForm.value.slug !== model.value.slug;
});

const isBrandOpen = ref(false);

const onCloseBrand = () => {
  if (!brandHasChanges.value) return;
  brandForm.reset();
};

const editBrand = async () => {
  loading.value = true;
  $fetch(`/api/brands/${model.value.slug}`, {
    method: "PATCH",
    body: brandForm.value
  }).then(() => {
    model.value = { ...model.value, ...brandForm.value };
    brandForm.update(brandForm.value);
    isBrandOpen.value = false;
    toast.add({ title: SITE.name, description: "Brand settings updated", color: "success" });
  }).catch(() => {}).finally(() => {
    loading.value = false;
  });
};
</script>

<template>
  <UModal v-model:open="isBrandOpen" title="Edit Brand" description="Manage your brand settings." :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }" :dismissible="false" @close:prevent="onCloseBrand">
    <UButton icon="lucide:cog" color="neutral" variant="soft" label="Brand Settings" class="rounded-lg" />
    <template #body>
      <form @submit.prevent="editBrand">
        <InputFloating v-model.trim="brandForm.name" type="text" class="mb-3" placeholder="Brand name" required />
        <InputFloating v-model.trim="brandForm.description" type="text" class="mb-3" placeholder="Description" />
        <div class="form-input-group">
          <p class="text-sm">{{ SITE.domain }}/</p>
          <InputFloating v-model.slug="brandForm.slug" type="text" placeholder="Slug" required />
        </div>
        <div class="grid mt-3">
          <UButton type="submit" variant="subtle" size="xl" class="justify-center rounded-lg font-bold" :disabled="loading">Edit</UButton>
        </div>
      </form>
    </template>
  </UModal>
</template>
