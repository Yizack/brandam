<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem, NavigationMenuProps } from "@nuxt/ui";

const { loggedIn, user, clear } = useUserSession();

const colorMode = useColorMode();
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const route = useRoute();
const fixedPaths = ["/"];
const isFixedPath = computed(() => fixedPaths.includes(route.path));
const isAppPath = computed(() => route.path.startsWith("/app"));

const scrolled = ref(false);
const maxScroll = 50;

const getScrolled = () => (document.body.scrollTop > maxScroll || document.documentElement.scrollTop > maxScroll);

onMounted(() => {
  scrolled.value = getScrolled();
  onscroll = () => {
    scrolled.value = getScrolled();
  };
});

const isTransparent = computed(() => isFixedPath.value && !scrolled.value);

const pages = computed<NavigationMenuItem[]>(() => {
  const initial: NavigationMenuItem[] = [
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
  ];

  const app: NavigationMenuItem[] = [
    {
      label: "Dashboard",
      icon: "lucide:layout-dashboard",
      to: "/app"
    }
  ];
  return loggedIn && user.value ? app : initial;
});

const navigationUI = computed<NavigationMenuProps["ui"]>(() => {
  const linkAdjust = isTransparent.value ? "text-inverted hover:text-inverted not-data-active:hover:before:bg-slate-50/30" : "data-active:before:bg-primary/10 text-default dark:not-data-active:hover:before:bg-slate-50/10 light:not-data-active:hover:before:bg-slate-950/10";
  const iconAdjust = isTransparent.value ? "not-data-active:text-inverted group-hover:text-inverted" : "group-not-data-active:text-primary text-default group-not-data-active:group-hover:text-primary";
  return {
    list: "gap-4",
    link: `data-active:text-primary data-active:before:shadow-md before:rounded-lg ${linkAdjust}`,
    linkLeadingIcon: `group-data-active:text-primary ${iconAdjust}`
  };
});

const logout = () => {
  clear();
  if (isAppPath.value) navigateTo("/", { replace: true });
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

useHead({
  bodyAttrs: {
    class: "light:bg-primary/15"
  }
});
</script>

<template>
  <header class="w-full top-0 py-1" :class="[isFixedPath ? 'fixed' : 'sticky', { 'bg-elevated shadow-md': scrolled || !isFixedPath }]">
    <div class="flex items-center gap-1 mx-auto px-4 sm:px-6 lg:px-8" :class="{ 'max-w-(--ui-container)': !isAppPath }">
      <div class="w-full md:hidden">
        <USlideover side="left" :title="SITE.name" :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }">
          <UButton icon="lucide:menu" color="neutral" variant="subtle" class="text-primary rounded-lg shadow-md my-2" />
          <template #body>
            <UNavigationMenu :items="pages" color="primary" orientation="vertical" class="w-full" />
            <USeparator class="my-4" />
          </template>
        </USlideover>
      </div>
      <ULink raw :to="isAppPath ? '/app' : '/'" class="text-xl font-bold hover:underline me-4 md:inline hidden" :class="{ 'text-inverted': isTransparent }">{{ SITE.name }}</ULink>
      <UNavigationMenu :items="pages" color="neutral" class="w-full md:inline hidden" :ui="navigationUI" />
      <div class="flex gap-2 py-2">
        <ClientOnly>
          <UButton :icon="colorMode.preference === 'dark' ? 'lucide:sun' : 'lucide:moon'" class="bg-transparent hover:bg-slate-50/10" :class="isTransparent ? 'text-inverted' : 'text-default'" @click="toggleColorMode" />
          <template #fallback>
            <UButton icon="lucide:circle-dashed" class="bg-transparent hover:bg-slate-50/10" :class="isFixedPath && !scrolled ? 'text-inverted' : 'text-default'" />
          </template>
        </ClientOnly>
        <template v-if="!loggedIn || !user">
          <UButton trailing to="/login" label="Sign in" color="secondary" class="rounded-lg shadow-md" />
          <UButton icon="lucide:arrow-right" trailing to="/signup" label="Sign up" color="neutral" variant="soft" class="rounded-lg shadow-md" :class="{ 'text-inverted bg-inverted hover:bg-inverted/75': !isFixedPath || scrolled }" />
        </template>
        <UDropdownMenu v-else :items="userMenu" :content="{ align: 'end', side: 'bottom', sideOffset: 8 }">
          <UButton icon="lucide:user" trailing-icon="lucide:chevron-down" :label="user.email" :variant="isTransparent ? 'solid' : 'soft'" color="primary" class="rounded-lg" />
        </UDropdownMenu>
      </div>
    </div>
  </header>
</template>
