<script setup lang="ts">
defineProps<{
  value: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
}>();

const { copy, copied } = useClipboard();

const emits = defineEmits<{
  copy: [];
}>();

watch(copied, (bool) => {
  if (!bool) return;
  emits("copy");
});
</script>

<template>
  <UTooltip text="Copy to clipboard" :content="{ side: tooltipSide || 'top' }">
    <UButton
      :color="copied ? 'success' : 'neutral'"
      variant="link"
      :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
      aria-label="Copy to clipboard"
      @click="copy(value)"
    />
  </UTooltip>
</template>
