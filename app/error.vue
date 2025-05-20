<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();
</script>

<template>
  <div class="flex items-center justify-center h-screen bg-primary">
    <div class="rounded-md bg-default p-10 shadow-lg">
      <h1 class="text-3xl font-bold">Error {{ error.statusCode }}</h1>
      <h5>Sorry, an error has occured. {{ error.message || error.statusMessage || "error" }}</h5>
      <span>Go home: <ULink to="/" class="underline">{{ SITE.domain }}</ULink></span>
    </div>
  </div>
</template>
