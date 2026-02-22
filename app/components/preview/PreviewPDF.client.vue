<script setup lang="ts">
import { VuePDF, usePDF } from "@tato30/vue-pdf";

const props = defineProps<{
  uuid: string;
  preview?: boolean;
}>();

const pdfState = useState(`pdf:${props.uuid}`, () => {
  const { pdf, pages } = usePDF(getAssetURL(props.uuid));
  return { pdf, pages };
});

const { pdf, pages } = toRefs(pdfState.value);

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
  <div v-if="preview" class="flex justify-center h-full">
    <VuePDF
      class="h-full **:w-auto! **:h-full! **:object-contain text-center"
      :pdf="pdf"
      :page="1"
    >
      <span>loading</span>
    </VuePDF>
  </div>
  <div v-else>
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
    <div class="flex justify-center">
      <VuePDF
        class="h-98 [&_canvas]:shadow [&_canvas]:w-auto! [&_div]:w-full! **:max-h-98! text-center"
        :pdf="pdf"
        :page="page"
        @loaded="isLoaded = true"
      >
        <div class="size-full bg-default flex items-center justify-center">
          <Icon name="lucide:loader-circle" class="animate-spin" size="2rem" />
        </div>
      </VuePDF>
    </div>
  </div>
</template>
