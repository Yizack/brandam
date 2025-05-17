<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();
</script>

<template>
  <div class="flex items-center justify-center h-screen dark:bg-gray-900 dark:text-white bg-white text-slate-900">
    <div class="rounded-md dark:bg-slate-800 bg-slate-200 p-10 shadow-lg">
      <h1 class="text-3xl font-bold">Error {{ error.statusCode }}</h1>
      <h5 class="dark:text-slate-300 text-slate-700">Sorry, an error has occured. {{ error.message || error.statusMessage || "error" }}</h5>
      <span>Go back: <NuxtLink to="/" class="underline">site</NuxtLink></span>
    </div>
  </div>
</template>
