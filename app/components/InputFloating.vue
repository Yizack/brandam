<script setup lang="ts" generic="T extends string | number | null">
// TODO: fix import once https://github.com/nuxt/ui/issues/3973 is resolved
import type { InputProps } from "@nuxt/ui/runtime/components/Input.vue.d.ts";

const props = defineProps<Omit<InputProps, "size">>();

const model = defineModel<T>();
</script>

<template>
  <div class="form-input-floating" :class="{ 'form-input-icon': icon }">
    <Icon v-if="icon" :icon="icon" class="input-icon h-5 w-5" />
    <input
      v-model="model"
      v-bind="props"
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
