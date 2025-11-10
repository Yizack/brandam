<script setup lang="ts">
const props = defineProps<{
  asset: BrandamAsset;
}>();

const model = defineModel<boolean>("open");

const brandStore = useBrandStore();

const form = useFormState({
  name: props.asset.name,
  description: props.asset.description ?? ""
});

const isLoading = ref(false);

const editAsset = () => {
  isLoading.value = true;
  brandStore.editAsset(props.asset.uuid, form.value).then(() => {
    model.value = false;
  }).catch(() => {}).finally(() => {
    isLoading.value = false;
  });
};
</script>

<template>
  <UModal v-model:open="model" title="Edit asset" :close="{ variant: 'outline', class: 'rounded-full' }">
    <template #body>
      <form class="space-y-2" @submit.prevent="editAsset">
        <p class="text-sm mb-4">Edit the asset details below.</p>
        <InputFloating id="name" v-model.trim="form.name" type="text" class="w-full" placeholder="Name" required />
        <InputFloating id="description" v-model.trim="form.description" type="text" class="w-full" placeholder="Description" />
        <USeparator class="my-4" />
        <div class="grid gap-2 grid-cols-2">
          <UButton label="Cancel" color="error" size="xl" variant="subtle" class="justify-center rounded-lg" block @click="model = false" />
          <UButton type="submit" size="xl" variant="subtle" class="justify-center rounded-lg" :loading="isLoading" block>
            <div v-if="!isLoading">Edit</div>
          </UButton>
        </div>
      </form>
    </template>
  </UModal>
</template>
