<script setup lang="ts">
defineProps<{
  step: number;
}>();

const model = defineModel<{
  name: string;
  description: string;
  type: string;
  content?: string;
}[]>({ required: true });

const addColor = () => {
  model.value.push({ name: "", description: "", type: "color", content: "#FFFFFF" });
};

const removeColor = (index: number) => {
  model.value.splice(index, 1);
};
</script>

<template>
  <div v-if="step === AssetStep.DETAILS" ref="colors">
    <p class="text-sm mb-4">Add your brand colors.</p>
    <div class="flex flex-col gap-2">
      <TransitionGroup name="expand-200">
        <div v-for="(item, i) of model" :key="i" class="flex flex-col items-center gap-2">
          <InputFloating v-model="item.name" type="text" class="w-full" placeholder="Name" />
          <UFieldGroup class="form-input-group w-full">
            <InputFloating v-model="item.content" type="text" class="w-full" placeholder="Color" required />
            <UPopover>
              <UButton color="neutral" variant="outline">
                <template #leading>
                  <span :style="{ backgroundColor: item.content }" class="w-11 h-full rounded border border-muted" />
                </template>
              </UButton>
              <template #content>
                <UColorPicker v-model="item.content" class="p-2" />
              </template>
            </UPopover>
            <UButton icon="lucide:trash-2" variant="outline" color="error" class="px-3" :ui="{ base: 'rounded-lg' }" @click="removeColor(i)" />
          </UFieldGroup>
          <InputFloating v-model="item.description" type="text" class="w-full" placeholder="Description" />
          <USeparator v-if="i < model.length - 1" class="my-2" />
        </div>
      </TransitionGroup>
    </div>
    <UButton icon="lucide:plus" size="lg" variant="subtle" class="w-full justify-center rounded-lg mt-3" @click="addColor" />
  </div>
  <div v-else-if="step === AssetStep.REVIEW">
    <p class="text-sm mb-4">Review your brand colors before submitting.</p>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
      <div v-for="(item, i) of model" :key="i" class="h-full">
        <div class="p-4 bg-muted border border-muted rounded-lg h-full">
          <div class="flex items-center gap-2">
            <span :style="{ backgroundColor: item.content }" class="size-18 shrink-0 rounded-lg border border-muted" />
            <div>
              <h1 class="font-medium">{{ item.content }}</h1>
              <h4 v-if="item.name" class="font-medium text-sm">{{ item.name }}</h4>
            </div>
          </div>
          <p v-if="item.description" class="text-sm mt-2">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
