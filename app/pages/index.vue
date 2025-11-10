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
        <BackgroundHero gradient />
        <BackgroundStars />
      </template>
    </UPageHero>
  </main>
</template>
