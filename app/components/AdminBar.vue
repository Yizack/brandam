<script setup lang="ts">
const model = defineModel<BrandamBrand & {
  assets: BrandamAsset[];
  roleId?: BrandamMember["roleId"];
}>({ required: true });

const toast = useToast();

const form = useFormState({
  name: model.value.name,
  description: model.value.description || "",
  slug: model.value.slug
});

const hasChanges = computed(() => {
  return form.value.name !== model.value.name
    || form.value.description !== (model.value.description || "")
    || form.value.slug !== model.value.slug;
});

const loading = ref(false);
const closeEdit = ref(false);

const onCloseEdit = () => {
  if (!hasChanges.value) return;
  form.reset();
};

const editBrand = async () => {
  loading.value = true;
  $fetch(`/api/brands/${form.value.slug}`, {
    method: "PATCH",
    body: form.value
  }).then(() => {
    model.value = { ...model.value, ...form.value };
    form.update(form.value);
    closeEdit.value = false;
    toast.add({ title: SITE.name, description: "Brand settings updated", color: "success" });
  }).catch(() => {}).finally(() => {
    loading.value = false;
  });
};
</script>

<template>
  <div class="fixed w-full bottom-0 py-2 z-50 bg-inverted/80 text-inverted backdrop-blur-md">
    <div class="flex items-center justify-between gap-1 mx-auto max-w-(--ui-container) px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2">
        <Icon name="lucide:shield-check" />
        <span class="font-medium">Admin Mode</span>
      </div>
      <div class="flex items-center gap-3">
        <!-- Brand Settings -->
        <UModal v-model:open="closeEdit" title="Edit Brand" description="Manage your brand settings." :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }" :dismissible="false" @close:prevent="onCloseEdit">
          <UButton icon="lucide:cog" color="neutral" variant="soft" label="Brand Settings" class="rounded-lg" />
          <template #body>
            <form @submit.prevent="editBrand">
              <InputFloating v-model.trim="form.name" type="text" class="mb-3" placeholder="Brand name" required />
              <InputFloating v-model.trim="form.description" type="text" class="mb-3" placeholder="Description" />
              <div class="form-input-group">
                <p class="text-sm">{{ SITE.domain }}/</p>
                <InputFloating v-model.slug="form.slug" type="text" placeholder="Slug" required />
              </div>
              <div class="grid mt-3">
                <UButton type="submit" variant="subtle" size="xl" class="justify-center rounded-lg font-bold" :disabled="loading">Edit</UButton>
              </div>
            </form>
          </template>
        </UModal>
        <!-- Add Asset -->
        <UButton icon="lucide:plus" color="neutral" variant="soft" label="Add asset" class="rounded-lg" />
      </div>
    </div>
  </div>
</template>
