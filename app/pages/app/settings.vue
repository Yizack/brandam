<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "authenticated" });
</script>

<template>
  <UContainer class="py-6 md:py-8">
    <div class="space-y-4">
      <div>
        <h1 class="text-2xl font-bold">Settings</h1>
        <p class="text-muted mb-6">Manage your account settings.</p>
      </div>
      <SettingsProfile />
      <SettingsBrandInvites />
      <SettingsPassword />
    </div>
  </UContainer>
</template>
