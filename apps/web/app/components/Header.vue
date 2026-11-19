<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

import UserMenu from "./UserMenu.vue";

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
  { active: route.path === "/", label: "Home", to: "/" },
  {
    active: route.path.startsWith("/dashboard"),
    label: "Dashboard",
    to: "/dashboard",
  },
]);
</script>

<template>
  <UHeader>
    <template #left>
      <UNavigationMenu :items="items" />
    </template>

    <template #right>
      <UColorModeButton />
      <ClientOnly>
        <UserMenu />
        <template #fallback>
          <USkeleton class="h-9 w-24" />
        </template>
      </ClientOnly>
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
</template>
