<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: "Home",
      icon: "i-lucide-home",
      to: "/"
    }
  ],
  [
    {
      label: "Sign in",
      icon: "i-lucide-log-in",
      to: "/signin",
      ui: {
        link: "light:bg-primary light:hover:bg-primary-400 light:text-neutral-800 rounded-md",
        linkLeadingIcon: "light:text-neutral-800"
      }
    }
  ]
]);
</script>

<template>
  <header class="border-b-1 border-gray-200">
    <UNavigationMenu :items="items" class="w-full justify-between max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8" />
  </header>
</template>
