<script setup lang="ts">
const props = defineProps<{
  password: string;
}>();

const model = defineModel<boolean>({ required: true });

const strength = computed(() => getPasswordStrength(props.password));
const score = computed(() => strength.value.score);

const color = computed(() => {
  if (score.value === 0) return "neutral";
  if (score.value <= 2) return "error";
  if (score.value < strength.value.results.length) return "warning";
  return "success";
});

const text = computed(() => {
  if (score.value === 0) return "Enter a password";
  if (score.value <= 2) return "Weak password";
  if (score.value < strength.value.results.length) return "Medium password";
  return "Strong password";
});

watch(() => props.password, () => {
  model.value = strength.value.isValid;
});
</script>

<template>
  <div class="absolute z-3 shadow border border-default rounded-lg p-4 text-sm space-y-2 bg-default">
    <UProgress
      :color="color"
      :indicator="text"
      :model-value="score"
      :max="strength.results.length"
      size="sm"
    />

    <p id="password-strength" class="font-medium">
      {{ text }}. Must contain:
    </p>

    <ul class="space-y-1" aria-label="Password requirements">
      <li
        v-for="(req, index) in strength.results"
        :key="index"
        class="flex items-center gap-0.5"
        :class="req.met ? 'text-success' : 'text-muted'"
      >
        <UIcon v-if="req.met" :name="'lucide:check'" class="size-4 shrink-0" />
        <UIcon v-else :name="'lucide:x'" class="size-4 shrink-0" />

        <span class="font-light">
          {{ req.text }}
          <span class="sr-only">
            {{ req.met ? ' - Requirement met' : ' - Requirement not met' }}
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>
