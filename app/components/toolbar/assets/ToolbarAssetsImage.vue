<script setup lang="ts">
defineProps<{
  step: number;
}>();

const model = defineModel<{
  name: string;
  description: string;
  type: string;
  file?: File;
}[]>({ required: true });
</script>

<template>
  <div v-if="step === AssetStep.DETAILS">
    <p class="text-sm mb-4">Add your brand image.</p>
    <div class="flex flex-col gap-2">
      <TransitionGroup name="expand-200">
        <div v-for="(item, i) of model" :key="i" class="flex flex-col items-center gap-2">
          <UFileUpload
            v-model="item.file"
            label="Drop your image here"
            description="SVG, PNG, JPG or GIF (max. 2MB)"
            class="w-full rounded-lg border-2 border-dashed h-full hover:border-secondary transition-colors"
            :class="item.file ? 'border-secondary' : 'border-accented'"
            position="inside"
            layout="list"
          />
          <InputFloating id="name" v-model.trim="item.name" type="text" class="w-full" placeholder="Name" autocomplete="off" required />
          <InputFloating id="description" v-model.trim="item.description" type="text" class="w-full" placeholder="Description" autocomplete="off" />
          <USeparator v-if="i < model.length - 1" class="my-2" />
        </div>
      </TransitionGroup>
    </div>
  </div>
  <div v-else-if="step === AssetStep.REVIEW">
    <p class="text-sm mb-4">Review your brand images before submitting.</p>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
      <div v-for="(item, i) of model" :key="i" class="h-full">
        <div class="p-4 bg-muted border border-muted rounded-lg h-full">
          <div v-if="item.file" class="flex items-center gap-2">
            <div>
              <h1 class="font-medium">{{ item.file.name }}</h1>
              <h4 v-if="item.name" class="font-medium text-sm">{{ item.name }}</h4>
            </div>
          </div>
          <p v-if="item.description" class="text-sm mt-2">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
