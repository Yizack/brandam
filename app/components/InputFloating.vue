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
}>();

const model = defineModel<string | number>();
</script>

<template>
  <div class="form-input-floating" :class="{ 'form-input-icon': icon }">
    <Icon v-if="icon" :name="icon" class="input-icon h-5 w-5" />
    <input
      :id="id"
      v-model="model"
      :name="name"
      :type="type || 'text'"
      class="from-input peer"
      placeholder=""
      :autocomplete="autocomplete"
      :required="required"
    >
    <label :for="id" :class="{ 'pl-8': icon }">
      {{ placeholder }}
    </label>
  </div>
</template>
