<script setup lang="ts">
import { VuePDF, usePDF } from "@tato30/vue-pdf";

const props = defineProps<{
  url: string;
}>();

const { pdf, pages } = usePDF({ url: props.url, verbosity: 0 });

const page = ref(1);
const isLoaded = ref(false);

const previousPage = () => {
  page.value = page.value <= 1 ? pages.value : page.value - 1;
};

const nextPage = () => {
  page.value = page.value >= pages.value ? 1 : page.value + 1;
};
</script>

<template>
  <div>
    <div class="flex items-center justify-center mb-2">
      <UFieldGroup>
        <UButton
          icon="lucide:arrow-left"
          variant="solid"
          class="px-4 shadow"
          @click="previousPage"
        />
        <div class="bg-default px-10 flex items-center">
          <span>Page {{ page }} of {{ pages }}</span>
        </div>
        <UButton
          trailing-icon="lucide:arrow-right"
          variant="solid"
          class="px-4 shadow"
          @click="nextPage"
        />
      </UFieldGroup>
    </div>
    <VuePDF
      class="justify-items-center h-98 [&_canvas]:w-auto! [&_div]:w-full! **:max-h-98! text-center"
      :pdf="pdf"
      :page="page"
      @loaded="isLoaded = true"
    >
      <span>loading</span>
    </VuePDF>
  </div>
</template>
