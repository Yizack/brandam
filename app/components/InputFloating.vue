<script setup lang="ts">
import type { InputHTMLAttributes } from "vue";

defineProps<{
  id?: string;
  name?: string;
  type?: InputHTMLAttributes["type"];
  icon?: string;
  placeholder: string;
  autocomplete?: string;
  required?: boolean;
  modelModifiers?: {
    number?: boolean;
    slug?: boolean;
    trim?: boolean;
  };
}>();

const [model, modifiers] = defineModel<string | number>();

const applyModifiers = (event: Event) => {
  const input = event.target as HTMLInputElement;
  // TODO: remove trim modifier when https://github.com/vuejs/core/pull/12654 is released
  if (modifiers.trim && typeof model.value === "string") {
    input.value = model.value.trim();
  }
  if (modifiers.slug && typeof model.value === "string") {
    model.value = toSlug(model.value);
    input.value = model.value;
  }
};
</script>

<template>
  <div class="form-input-floating" :class="{ 'form-input-icon': icon }">
    <Icon v-if="icon" :name="icon" class="input-icon h-5 w-5 text-primary" />
    <input
      :id="id"
      v-model="model"
      class="from-input peer"
      :name="name"
      :type="type || 'text'"
      placeholder=""
      :autocomplete="autocomplete"
      :required="required"
      @change="applyModifiers"
    >
    <label :for="id" :class="{ 'pl-8': icon }">
      {{ placeholder }}
    </label>
  </div>
</template>
