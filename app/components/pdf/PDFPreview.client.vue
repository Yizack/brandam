<script setup lang="ts">
import { VuePDF, usePDF } from "@tato30/vue-pdf";

const props = defineProps<{
  url: string;
}>();

const { pdf } = usePDF({ url: props.url, verbosity: 0 });
</script>

<template>
  <div class="flex justify-center h-full">
    <VuePDF
      class="h-full [&_canvas]:w-auto! [&_canvas]:h-full! [&_canvas]:object-contain text-center"
      :pdf="pdf"
      :page="1"
    >
      <span>loading</span>
    </VuePDF>
  </div>
</template>
