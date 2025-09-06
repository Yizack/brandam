<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";

const toast = useToast();

const model = defineModel<BrandamBrand & {
  assets: BrandamAsset[];
  roleId?: BrandamMember["roleId"];
}>({ required: true });

const isAssetOpen = ref(false);
const assetStep = ref(0);
const stepper = useTemplateRef("stepper");
const assetType = ref<BrandamAsset["data"]["type"]>();
const isLoading = ref(false);

const assetStepper: StepperItem[] = [
  { title: "Type" },
  { title: "Details" },
  { title: "Review" }
];

const form = useFormState({
  brandId: model.value.id,
  items: [] as {
    name: string;
    description: string;
    type: BrandamAsset["data"]["type"];
    content?: string;
    file?: File;
  }[]
});

const selectAssetType = (type: BrandamAsset["data"]["type"]) => {
  stepper.value?.next();
  assetType.value = type;
  if (form.value.items.length !== 0) return;
  switch (type) {
    case "color":
      form.value.items.push({ name: "", description: "", type: "color", content: "#FFFFFF" });
      break;
    case "font":
    case "image":
      form.value.items.push({ name: "", description: "", type: "image", file: undefined });
      break;
    case "vector":
    case "document":
      form.value.items.push({ name: "", description: "", type, file: undefined });
      break;
  }
};

const assetPrev = () => {
  if (assetStep.value === 0) {
    isAssetOpen.value = false;
    return;
  }

  if (assetStep.value === AssetStep.DETAILS && form.value.items.length > 0) {
    if (!confirm("Are you sure you want to go back? This will reset your changes.")) return;
    form.value.items = [];
  }
  stepper.value?.prev();
};

const assetForm = useTemplateRef("assetForm");
const assetNext = () => {
  if (assetForm.value && !assetForm.value.checkValidity()) {
    assetForm.value.reportValidity();
    return;
  }
  stepper.value?.next();
};

const addAsset = async () => {
  const payload = new FormData();
  const items = form.value.items.map(({ file, ...item }) => ({ ...item }));
  payload.append("payload", JSON.stringify({ brandId: model.value.id, items }));
  for (const item of form.value.items) {
    if (!(item.file instanceof File)) continue;
    payload.append("files", item.file);
  }
  isLoading.value = true;
  $fetch(`/api/brands/${model.value.name}/assets`, {
    method: "POST",
    body: payload
  }).then(() => {
    toast.add({ title: SITE.name, description: "Asset added successfully.", color: "success" });
  }).catch(() => {}).finally(() => {
    isLoading.value = false;
    isAssetOpen.value = false;
    assetStep.value = 0;
    form.value.items = [];
  });
};
</script>

<template>
  <UModal v-model:open="isAssetOpen" title="Add Asset" description="Add your brand asset." :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }" :dismissible="false">
    <UButton icon="lucide:plus" color="neutral" variant="soft" label="Add asset" class="rounded-lg" />
    <template #body>
      <UStepper ref="stepper" v-model="assetStep" :items="assetStepper" size="sm" class="w-full" disabled />
      <USeparator class="my-6" />
      <form ref="assetForm" @submit.prevent="addAsset">
        <template v-if="assetStep === AssetStep.TYPE">
          <p class="text-sm mb-4">Select the type of asset to continue.</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2">
            <div v-for="type of assetTypes" :key="type.value" class="light:bg-default dark:bg-muted rounded-lg border-2 border-dashed border-accented p-6 flex flex-col items-center justify-center text-center h-full cursor-pointer hover:border-secondary transition-colors group" @click="selectAssetType(type.value)">
              <div class="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-[1.1] transition-transform">
                <Icon :name="type.icon" size="1.5em" />
              </div>
              <h4 class="font-medium">{{ type.name.singular }}</h4>
            </div>
          </div>
        </template>
        <ToolbarAssetsImage v-if="assetType === 'image'" v-model="form.items" :step="assetStep" />
        <ToolbarAssetsColor v-if="assetType === 'color'" v-model="form.items" :step="assetStep" />
        <USeparator class="my-4" />
        <div class="grid gap-2" :class="{ 'grid-cols-2': assetStep > 0 }">
          <UButton :label="assetStep < AssetStep.REVIEW ? 'Cancel' : 'Back'" color="error" size="xl" variant="subtle" class="justify-center rounded-lg" @click="assetPrev" />
          <UButton v-if="assetStep > AssetStep.TYPE && assetStep < assetStepper.length - 1" label="Continue" color="secondary" size="xl" variant="subtle" class="justify-center rounded-lg" @click="assetNext" />
          <UButton v-if="assetStep === assetStepper.length - 1" size="xl" variant="subtle" type="submit" class="justify-center rounded-lg" :loading="isLoading">
            <span v-if="!isLoading">Submit</span>
          </UButton>
        </div>
      </form>
    </template>
  </UModal>
</template>
