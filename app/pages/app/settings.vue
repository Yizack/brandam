<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "authenticated" });
</script>

<template>
  <main class="p-6 md:p-8">
    <h1 class="text-2xl font-bold mb-6">Settings</h1>
    <div class="space-y-4">
      <SettingsProfile />
      <SettingsBrandInvites />
    </div>
  </main>
</template>
