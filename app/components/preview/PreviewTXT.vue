<script setup lang="ts">
const props = defineProps<{
  uuid: string;
  preview?: boolean;
}>();

const { data: text } = await useFetch(getAssetURL(props.uuid), {
  responseType: "text",
  key: `txt:${props.uuid}`,
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
});
</script>

<template>
  <div class="size-full p-3">
    <pre :class="preview ? 'line-clamp-5' : 'h-98 overflow-auto'">{{ text }}</pre>
  </div>
</template>
