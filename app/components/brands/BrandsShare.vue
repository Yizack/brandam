<script setup lang="ts">
const props = defineProps<{
  description?: string;
  path: string;
}>();

const model = defineModel<boolean>("open");

const url = useOrigin(props.path).url;
</script>

<template>
  <UModal v-model:open="model" title="BrandAM Share" :description="description" :close="{ variant: 'outline', class: 'rounded-full' }" :dismissible="false">
    <slot />
    <template #body>
      <div class="space-y-2">
        <h3 class="font-bold uppercase">Share URL</h3>
        <div class="flex items-center gap-2">
          <UInput :value="url" class="w-full font-mono" :ui="{ trailing: 'pr-0.5' }" readonly>
            <template #trailing>
              <CopyButton :value="url" />
            </template>
          </UInput>
        </div>
      </div>
    </template>
  </UModal>
</template>
