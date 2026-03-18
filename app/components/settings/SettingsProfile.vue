<script setup lang="ts">
const { user } = useUserSession();

const isLoading = ref(false);
</script>

<template>
  <section v-if="user" class="space-y-2">
    <div>
      <h2 class="text-xl font-semibold">Profile</h2>
      <p class="text-muted">Manage your account information.</p>
    </div>
    <form class="space-y-2">
      <InputFloating v-model="user.name" placeholder="Name" />
      <InputFloating v-model="user.email" placeholder="Email" readonly />
      <UButton
        label="Update profile"
        type="submit"
        variant="subtle"
        size="xl"
        class="rounded-lg font-bold"
        :disabled="isLoading"
        block
      />
    </form>
  </section>
</template>
