<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";

const model = defineModel<BrandamBrand & {
  assets: BrandamAsset[];
  roleId?: BrandamMember["roleId"];
}>({ required: true });

const toast = useToast();
const loading = ref(false);

/* Brand Settings */
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
  $fetch(`/api/brands/${brandForm.value.slug}`, {
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

/* Add Asset */
const isAssetOpen = ref(false);
const assetStep = ref(0);
const stepper = useTemplateRef("stepper");
const assetType = ref<typeof assetTypes[number]["value"]>();
const assetStepper: StepperItem[] = [
  { title: "Type" },
  { title: "Details" },
  { title: "Review" }
];

const assetForm = useFormState({
  brandId: model.value.id,
  items: [] as { name: string, description: string, color?: string, file?: File, font?: string }[]
});

const selectAssetType = (type: typeof assetTypes[number]["value"]) => {
  stepper.value?.next();
  assetType.value = type;
  if (assetForm.value.items.length !== 0) return;
  switch (type) {
    case "colors":
      assetForm.value.items.push({ name: "", description: "", color: "#FFFFFF" });
      break;
  }
};

const assetPrev = () => {
  if (assetStep.value === 0) {
    isAssetOpen.value = false;
    return;
  }

  if (assetStep.value === 1 && assetForm.value.items.length > 0) {
    if (!confirm("Are you sure you want to go back? This will reset your changes.")) return;
    assetForm.value.items = [];
  }
  stepper.value?.prev();
};

const assetNext = () => stepper.value?.next();
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
        <!-- Add Asset -->
        <UModal v-model:open="isAssetOpen" title="Add Asset" description="Add your brand asset." :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }" :dismissible="false">
          <UButton icon="lucide:plus" color="neutral" variant="soft" label="Add asset" class="rounded-lg" />
          <template #body>
            <UStepper ref="stepper" v-model="assetStep" :items="assetStepper" size="sm" class="w-full" disabled />
            <USeparator class="my-6" />
            <template v-if="assetStep === 0">
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
            <template v-else-if="assetStep === 1">
              <template v-if="assetType === 'colors'">
                <p class="text-sm mb-4">Add your brand colors.</p>
                <div class="flex flex-col gap-2">
                  <TransitionGroup name="expand-200">
                    <div v-for="(item, i) of assetForm.items" :key="i" class="flex flex-col items-center gap-2">
                      <InputFloating v-model="item.name" type="text" class="w-full" placeholder="Name" />
                      <UButtonGroup class="form-input-group w-full">
                        <InputFloating v-model="item.color" type="text" class="w-full" placeholder="Color" />
                        <UPopover>
                          <UButton color="neutral" variant="outline">
                            <template #leading>
                              <span :style="{ backgroundColor: item.color }" class="w-11 h-full rounded border border-muted" />
                            </template>
                          </UButton>
                          <template #content>
                            <UColorPicker v-model="item.color" class="p-2" />
                          </template>
                        </UPopover>
                        <UButton icon="lucide:trash-2" variant="outline" color="error" class="px-3" :ui="{ base: 'rounded-lg' }" @click="assetForm.items.splice(i, 1)" />
                      </UButtonGroup>
                      <InputFloating v-model="item.description" type="text" class="w-full" placeholder="Description" />
                      <USeparator v-if="i < assetForm.items.length - 1" class="my-2" />
                    </div>
                  </TransitionGroup>
                </div>
                <UButton icon="lucide:plus" size="lg" variant="subtle" class="w-full justify-center rounded-lg mt-3" @click="assetForm.items.push({ name: '', description: '', color: '#FFFFFF' })" />
              </template>
            </template>
            <template v-else-if="assetStep === 2">
              <template v-if="assetType === 'colors'">
                <p class="text-sm mb-4">Review your brand colors before submitting.</p>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
                  <div v-for="(item, i) of assetForm.items" :key="i" class="h-full">
                    <div class="p-4 bg-muted border border-muted rounded-lg h-full">
                      <div class="flex items-center gap-2">
                        <span :style="{ backgroundColor: item.color }" class="size-18 shrink-0 rounded-lg border border-muted" />
                        <div>
                          <h1 class="font-medium">{{ item.color }}</h1>
                          <h4 v-if="item.name" class="font-medium text-sm">{{ item.name }}</h4>
                        </div>
                      </div>
                      <p v-if="item.description" class="text-sm mt-2">{{ item.description }}</p>
                    </div>
                  </div>
                </div>
              </template>
            </template>
            <USeparator class="my-4" />
            <div class="grid gap-2" :class="{ 'grid-cols-2': assetStep > 0 }">
              <UButton color="error" size="xl" variant="subtle" class="justify-center rounded-lg" @click="assetPrev">{{ assetStep < 2 ? 'Cancel' : 'Back' }}</UButton>
              <UButton v-if="assetStep > 0 && assetStep < assetStepper.length - 1" color="secondary" size="xl" variant="subtle" class="justify-center rounded-lg" @click="assetNext">Continue</UButton>
              <UButton v-if="assetStep === assetStepper.length - 1" size="xl" variant="subtle" class="justify-center rounded-lg">Submit</UButton>
            </div>
          </template>
        </UModal>
      </div>
    </div>
  </div>
</template>
