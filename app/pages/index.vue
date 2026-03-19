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
  </main>
</template>
