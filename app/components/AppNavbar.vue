<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";

const { loggedIn, user, clear } = useUserSession();

const route = useRoute();
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

const logout = () => {
  clear();
  if (isAppPath.value) navigateTo("/", { replace: true });
};

const userMenu: DropdownMenuItem[][] = [
  [
    {
      label: "Settings",
      icon: "lucide:cog",
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
];
</script>

<template>
  <UHeader
    mode="modal"
    class="w-full top-0 py-1 z-50 border-0 backdrop-blur-sm"
  >
    <template #left>
      <ULink raw :to="isAppPath ? '/app' : '/'" class="text-xl font-bold hover:underline me-4">
        {{ SITE.name }}
      </ULink>
    </template>

    <UNavigationMenu
      :items="pages"
      color="neutral"
      class="w-full"
    />

    <template #right>
      <UColorModeButton />

      <template v-if="!loggedIn || !user">
        <UButton
          label="Sign in"
          color="neutral"
          variant="outline"
          to="/login"
          class="hidden lg:inline-flex"
        />

        <UButton
          label="Sign up"
          color="neutral"
          trailing-icon="i-lucide-arrow-right"
          class="hidden lg:inline-flex"
          to="/signup"
        />
      </template>
      <UDropdownMenu v-else :items="userMenu" :content="{ align: 'end', side: 'bottom', sideOffset: 8 }">
        <UButton icon="lucide:user" trailing-icon="lucide:chevron-down" :label="user.email" variant="soft" color="primary" class="rounded-lg" />
      </UDropdownMenu>
    </template>

    <template #body>
      <UNavigationMenu
        :items="pages"
        orientation="vertical"
        class="-mx-2.5"
      />
      <template v-if="!loggedIn || !user">
        <USeparator class="my-4" />
        <UButton
          label="Sign in"
          color="neutral"
          variant="outline"
          to="/login"
          class="inline-flex mb-2"
          block
        />

        <UButton
          label="Sign up"
          color="neutral"
          class="inline-flex"
          to="/signup"
          block
        />
      </template>
    </template>
  </UHeader>
</template>
