<script setup lang="ts">
import { VuePDF, usePDF } from "@tato30/vue-pdf";

const props = defineProps<{
  url: string;
}>();

const { pdf } = usePDF({ url: props.url, verbosity: 0 });
</script>

<template>
  <VuePDF
    class="h-full justify-items-center [&_canvas]:w-auto! [&_canvas]:h-full! [&_canvas]:object-contain text-center"
    :pdf="pdf"
    :page="1"
  >
    <span>loading</span>
  </VuePDF>
</template>
