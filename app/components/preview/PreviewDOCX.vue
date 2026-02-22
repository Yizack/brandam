<script setup lang="ts">
import { renderAsync } from "docx-preview";
import { toJpeg } from "html-to-image";

const props = defineProps<{
  uuid: string;
  preview?: boolean;
}>();

const docxContainer = useTemplateRef<HTMLDivElement>("docx-container");
const docxThumbnail = useTemplateRef<HTMLDivElement>("docx-thumbnail");

const page = ref(1);
const pages = useState<number>(`docx:${props.uuid}:pages`, () => 0);
const isLoading = ref(false);

const generateThumbnail = async (page: number) => {
  if (!docxContainer.value || !docxThumbnail.value) return;

  const stateImg = useState<string | null>(`docx:${props.uuid}:${page}`);
  if (stateImg.value) {
    docxThumbnail.value.innerHTML = "";
    const img = document.createElement("img");
    img.src = stateImg.value;
    img.alt = `Page ${page} Thumbnail`;
    docxThumbnail.value.appendChild(img);
    return;
  }

  isLoading.value = true;

  const blob = await $fetch<Blob>(getAssetURL(props.uuid));

  await renderAsync(blob, docxContainer.value);

  const docxWrapper = docxContainer.value.querySelector(".docx-wrapper");
  if (!docxWrapper) return;

  const sections = docxWrapper.querySelectorAll("section.docx");
  pages.value = sections.length;

  const section = sections[page - 1];
  if (!section) return;

  const dataUrl = await toJpeg(section as HTMLElement, {
    quality: 0.8,
    onImageErrorHandler: (error) => {
      console.warn("Error generating DOCX thumbnail", error);
    }
  });
  stateImg.value = dataUrl;

  isLoading.value = false;

  nextTick(() => {
    docxContainer.value!.innerHTML = "";

    const img = document.createElement("img");
    img.src = dataUrl;

    docxThumbnail.value!.innerHTML = "";
    docxThumbnail.value!.appendChild(img);
  });
};

const previousPage = async () => {
  page.value = page.value <= 1 ? pages.value : page.value - 1;
};

const nextPage = async () => {
  page.value = page.value >= pages.value ? 1 : page.value + 1;
};

onMounted(() => {
  generateThumbnail(page.value);
});

watch(page, async (newPage) => {
  await generateThumbnail(newPage);
});
</script>

<template>
  <div :class="{ 'h-full': preview }">
    <div v-if="!preview" class="flex items-center justify-center mb-2">
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
    <div ref="docx-container" class="absolute pointer-events-none opacity-0" />
    <div v-if="isLoading" class="flex items-center justify-center" :class="preview ? 'h-full' : 'h-98'">
      <Icon name="lucide:loader-circle" class="animate-spin" size="2rem" />
    </div>
    <div v-else ref="docx-thumbnail" class="flex justify-center" :class="preview ? 'h-full' : 'h-98'" />
  </div>
</template>
