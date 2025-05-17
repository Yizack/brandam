<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const colorMode = useColorMode();
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const route = useRoute();
const isFixedPath = computed(() => ["/"].includes(route.path));

const scrolled = ref(false);
const maxScroll = 50;

const getScrolled = () => (document.body.scrollTop > maxScroll || document.documentElement.scrollTop > maxScroll);

onMounted(() => {
  scrolled.value = getScrolled();
  onscroll = () => {
    scrolled.value = getScrolled();
  };
});

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
  <header class="w-full top-0" :class="[isFixedPath ? 'fixed' : 'sticky', { 'bg-primary shadow-md': scrolled || !isFixedPath }]">
    <div class="flex gap-1 max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8">
      <div class="w-full md:hidden">
        <USlideover side="left" title="BAMFolio" :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }">
          <UButton icon="lucide:menu" color="neutral" variant="subtle" class="text-primary rounded-lg shadow-md my-2" />
          <template #body>
            <UNavigationMenu :items="items" color="primary" orientation="vertical" class="w-full" />
            <USeparator class="my-4" />
          </template>
        </USlideover>
      </div>
      <UNavigationMenu :items="items" color="neutral" class="w-full md:inline hidden" :ui="navigationUI" />
      <div class="flex gap-2 py-2">
        <ClientOnly>
          <UButton :icon="colorMode.preference === 'dark' ? 'lucide:sun' : 'lucide:moon'" class="bg-transparent hover:bg-slate-50/10" @click="toggleColorMode" />
          <template #fallback>
            <UButton icon="lucide:circle-dashed" />
          </template>
        </ClientOnly>
        <UButton icon="simple-icons:github" to="https://github.com/Yizack/bamfolio" target="_blank" class="bg-transparent hover:bg-slate-50/10" />
        <UButton trailing to="/login" label="Sign in" color="secondary" class="rounded-lg shadow-md" />
        <UButton icon="lucide:arrow-right" trailing to="/signup" label="Sign up" color="neutral" variant="soft" class="rounded-lg shadow-md" />
      </div>
    </div>
  </header>
</template>
