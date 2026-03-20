<script setup lang="ts">
const renderBg = ref(false);

onMounted(() => {
  renderBg.value = true;
});
</script>

<template>
  <main>
    <UPageHero
      headline="Brand Assets Manager"
      :title="SITE.name"
      description="Simplified way to manage, organize, and share your brand assets."
      class="bg-primary/5"
      :ui="{
        container: 'md:pt-18 lg:pt-20',
        title: 'max-w-3xl mx-auto',
      }"
    >
      <template #top>
        <Transition name="fade">
          <div v-if="renderBg">
            <BackgroundHero gradient />
            <BackgroundStars />
          </div>
        </Transition>
      </template>
    </UPageHero>
    <UPageSection
      title="Organize Your Brand Assets"
      description="Easily manage and categorize your brand assets in one centralized location, ensuring quick access and efficient organization."
      orientation="horizontal"
    >
      <img
        src="/images/presentation-1.jpg"
        alt="Organize Your Brand Assets"
        class="mx-auto w-100 rounded-lg border border-default drop-shadow-xl drop-shadow-primary"
        loading="lazy"
      >
    </UPageSection>
    <UPageSection
      title="Upload Your Assets by Type"
      description="Upload and manage your brand assets by type, such as image, vector, document, font, and color, to maintain consistency across all your branding materials."
      orientation="horizontal"
      class="bg-elevated"
      reverse
    >
      <img
        src="/images/presentation-2.jpg"
        alt="Upload Your Assets by Type"
        class="mx-auto w-100 rounded-lg border border-default drop-shadow-xl drop-shadow-primary"
        loading="lazy"
      >
    </UPageSection>
  </main>
</template>
