<script setup lang="ts">
const props = defineProps<{
  step: number;
  type: Exclude<BrandamAssetTypes, "color">;
}>();

const model = defineModel<{
  name: string;
  description: string;
  file?: File;
  height?: number;
  width?: number;
  previewFile?: File;
}[]>({ required: true });

const uploadConstraints: Record<Exclude<BrandamAssetTypes, "color">, {
  accept: string;
  description: string;
  regex: RegExp;
  mimeMap?: Record<string, string>;
}> = {
  image: {
    regex: /\.(png|jfif|pjpeg|pjp|jpe?g|webp|gif)$/i,
    description: "PNG, JPG, WEBP or GIF",
    accept: "image/png, image/jpeg, image/webp, image/gif"
  },
  vector: {
    regex: /\.(svg|ai|eps)$/i,
    description: "SVG, AI, EPS",
    accept: "image/svg+xml, application/postscript"
  },
  document: {
    regex: /\.(pdf|docx|txt)$/i,
    description: "PDF, DOCX, TXT",
    accept: "application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain"
  },
  font: {
    regex: /\.(ttf|otf|woff|woff2)$/i,
    description: "TTF, OTF, WOFF",
    accept: ".ttf,.otf,.woff,.woff2",
    mimeMap: {
      ttf: "font/ttf",
      otf: "font/otf",
      woff: "font/woff",
      woff2: "font/woff2"
    }
  }
};

const setDimensions = (file: File, index: number) => {
  if (!file) return;
  getImageDimensions(file).then((dimensions) => {
    if (!model.value[index]) return;
    model.value[index].width = dimensions.width;
    model.value[index].height = dimensions.height;
  }).catch(() => {
    // Ignore errors
  });
};

const isValidFile = (file: File) => {
  const constraints = uploadConstraints[props.type];
  return constraints.regex.test(file.name);
};

const setFontMimeType = (file: File, index: number) => {
  if (!file || !model.value[index] || !uploadConstraints.font.mimeMap) return;

  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const mappedMime = uploadConstraints.font.mimeMap[extension];

  if (!mappedMime) return;

  model.value[index].file = new File([file], file.name, { type: mappedMime });
};

const processFile = (file: File | undefined, index: number) => {
  if (!file) return;

  if (!isValidFile(file)) {
    if (!model.value[index]) return;

    model.value[index].file = undefined;

    useToast().add({
      description: `Please upload a valid ${uploadConstraints[props.type].description} file`,
      color: "error"
    });

    return;
  }

  if (props.type === "font" && model.value[index]) {
    setFontMimeType(file, index);
  }

  setDimensions(file, index);
};
</script>

<template>
  <div v-if="step === AssetStep.DETAILS">
    <p class="text-sm mb-4">Add your brand {{ type }}.</p>
    <div class="flex flex-col gap-2">
      <TransitionGroup name="expand-200">
        <div v-for="(item, i) of model" :key="i" class="space-y-2">
          <UFileUpload
            v-model="item.file"
            label="Drop your file here"
            :description="uploadConstraints[type].description"
            class="w-full rounded-lg border-2 border-dashed h-full hover:border-secondary transition-colors"
            :class="item.file ? 'border-secondary' : 'border-accented'"
            position="inside"
            layout="list"
            :accept="uploadConstraints[type].accept"
            @change="processFile(item.file, i)"
          />
          <InputFloating
            id="name"
            v-model.trim="item.name"
            type="text"
            placeholder="Name"
            autocomplete="off"
            required
          />
          <InputFloating
            id="description"
            v-model.trim="item.description"
            type="text"
            placeholder="Description"
            autocomplete="off"
          />
          <template v-if="type === 'vector'">
            <h3 class="text-highlighted text-sm font-semibold mb-1">Preview Image</h3>
            <p class="text-sm text-muted">Recommended for non-SVG files. SVG previews are optional as web browsers can render them directly.</p>
            <UFileUpload
              v-model="item.previewFile"
              label="Drop your PREVIEW image here"
              :description="uploadConstraints.image.description"
              class="w-full rounded-lg border-2 border-dashed h-full hover:border-secondary transition-colors"
              :class="item.file ? 'border-secondary' : 'border-accented'"
              position="inside"
              layout="list"
              :accept="uploadConstraints.image.accept"
            />
          </template>
          <USeparator v-if="i < model.length - 1" class="my-2" />
        </div>
      </TransitionGroup>
    </div>
  </div>
  <div v-else-if="step === AssetStep.REVIEW">
    <p class="text-sm mb-4">Review your brand {{ type }} before submitting.</p>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
      <div v-for="(item, i) of model" :key="i" class="h-full">
        <div class="p-4 bg-muted border border-muted rounded-lg h-full">
          <div v-if="item.file" class="flex items-center gap-2">
            <div>
              <h1 class="font-medium">{{ item.file.name }}</h1>
              <h4 v-if="item.name" class="font-medium text-sm">{{ item.name }}</h4>
            </div>
          </div>
          <p v-if="item.description" class="text-sm mt-2">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
