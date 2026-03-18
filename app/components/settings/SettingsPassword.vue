<script setup lang="ts">
const { user } = useUserSession();

const isLoading = ref(false);
const isValidPassword = ref(false);
const isFocusedPassword = ref(false);

const form = useFormState({
  passwordCurrent: "",
  password: "",
  passwordCheck: ""
});
</script>

<template>
  <section class="space-y-2">
    <div>
      <h2 class="text-xl font-semibold">Change Password</h2>
      <p class="text-muted">Update your password to keep your account secure.</p>
    </div>
    <form class="space-y-2">
      <input type="text" autocomplete="email" hidden :value="user?.email">
      <InputFloating
        v-if="!user?.passwordless"
        id="current-password"
        v-model="form.passwordCurrent"
        type="password"
        placeholder="Current password"
        autocomplete="current-password"
        required
      />
      <InputFloating
        id="password"
        v-model="form.password"
        type="password"
        placeholder="New password"
        autocomplete="new-password"
        required
        @focus="isFocusedPassword = true"
        @blur="isFocusedPassword = false"
      />
      <PasswordStrength v-if="isFocusedPassword" v-model="isValidPassword" :password="form.password" />
      <InputFloating
        id="password-check"
        v-model="form.passwordCheck"
        type="password"
        placeholder="Confirm password"
        autocomplete="new-password"
        required
      />
      <UButton
        label="Change password"
        type="submit"
        variant="subtle"
        size="xl"
        class="rounded-lg font-bold"
        :loading="isLoading"
        block
      />
    </form>
  </section>
</template>
