<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const colorMode = useColorMode();
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const items = ref<NavigationMenuItem[]>([
  {
    label: "Home",
    icon: "lucide:house",
    to: "/"
  },
  {
    label: "About",
    icon: "lucide:info",
    to: "/about"
  }
]);

const navigationUI = ref<NavigationMenuItem["ui"]>({
  link: "data-active:text-primary text-inverted hover:text-inverted data-active:after:bg-elevated data-active:before:shadow-md not-data-active:hover:before:bg-slate-50/10 before:rounded-lg",
  linkLeadingIcon: "group-data-active:text-primary not-data-active:text-inverted group-hover:text-inverted"
});
</script>

<template>
  <header class="fixed w-full top-0">
    <div class="flex gap-1 content-center max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8">
      <UNavigationMenu :items="items" color="neutral" class="w-full" :ui="navigationUI" />
      <div class="flex gap-2 py-2">
        <ClientOnly>
          <UButton :icon="colorMode.preference === 'dark' ? 'lucide:sun' : 'lucide:moon'" class="bg-transparent hover:bg-slate-50/10" @click="toggleColorMode" />
        </ClientOnly>
        <UButton icon="simple-icons:github" class="bg-transparent hover:bg-slate-50/10" @click="toggleColorMode" />
        <UButton trailing to="/login" label="Sign in" color="secondary" class="rounded-lg shadow-md" />
        <UButton icon="lucide:arrow-right" trailing to="/signup" label="Sign up" color="neutral" class="rounded-lg shadow-md" />
      </div>
    </div>
  </header>
</template>
