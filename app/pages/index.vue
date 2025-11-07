<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";

const links: ButtonProps[] = [
  {
    label: "Get started",
    to: "/docs/getting-started",
    icon: "i-lucide-square-play"
  },
  {
    label: "Learn more",
    to: "/docs/getting-started/theme/design-system",
    color: "neutral",
    variant: "subtle",
    trailingIcon: "i-lucide-arrow-right"
  }
];
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
      :links="links"
    >
      <template #top>
        <HeroBackground />
      </template>
    </UPageHero>
  </main>
</template>
