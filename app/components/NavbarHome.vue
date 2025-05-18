<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";

const { loggedIn, user, clear } = useUserSession();

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

const pages = ref<NavigationMenuItem[]>([
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

const logout = () => {
  clear();
  navigateTo("/", { replace: true });
};

const userMenu = ref<DropdownMenuItem[][]>([
  [
    {
      label: "Settings",
      icon: "i-lucide-cog",
      to: "/app/settings"
    }
  ],
  [
    {
      label: "Logout",
      icon: "lucide:log-out",
      onSelect: logout
    }
  ]
]);
</script>

<template>
  <header class="w-full top-0" :class="[isFixedPath ? 'fixed' : 'sticky', { 'bg-primary shadow-md': scrolled || !isFixedPath }]">
    <div class="flex gap-1 max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8">
      <div class="w-full md:hidden">
        <USlideover side="left" :title="SITE.name" :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }">
          <UButton icon="lucide:menu" color="neutral" variant="subtle" class="text-primary rounded-lg shadow-md my-2" />
          <template #body>
            <UNavigationMenu :items="pages" color="primary" orientation="vertical" class="w-full" />
            <USeparator class="my-4" />
          </template>
        </USlideover>
      </div>
      <UNavigationMenu :items="pages" color="neutral" class="w-full md:inline hidden" :ui="navigationUI" />
      <div class="flex gap-2 py-2">
        <ClientOnly>
          <UButton :icon="colorMode.preference === 'dark' ? 'lucide:sun' : 'lucide:moon'" class="bg-transparent hover:bg-slate-50/10" @click="toggleColorMode" />
          <template #fallback>
            <UButton icon="lucide:circle-dashed" />
          </template>
        </ClientOnly>
        <UButton icon="simple-icons:github" :to="SITE.repository" target="_blank" class="bg-transparent hover:bg-slate-50/10" />
        <template v-if="!loggedIn || !user">
          <UButton trailing to="/login" label="Sign in" color="secondary" class="rounded-lg shadow-md" />
          <UButton icon="lucide:arrow-right" trailing to="/signup" label="Sign up" color="neutral" variant="soft" class="rounded-lg shadow-md" />
        </template>
        <UDropdownMenu v-else :items="userMenu" :content="{ align: 'end', side: 'bottom', sideOffset: 8 }">
          <UButton icon="lucide:user" trailing-icon="lucide:chevron-down" :label="user.email" color="secondary" class="rounded-lg shadow-md" />
        </UDropdownMenu>
      </div>
    </div>
  </header>
</template>
