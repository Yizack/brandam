<script setup lang="ts">
definePageMeta({ layout: false, middleware: "authenticated" });

const isLoading = ref(false);
const isValidPassword = ref(false);
const isFocusedPassword = ref(false);

const form = useFormState({
  name: "",
  email: "",
  password: "",
  passwordCheck: "",
  turnstile: ""
});

const theme = useColorMode().preference as "light" | "dark";
const turnstile = useTemplateRef("turnstile");

const signUp = () => {
  isLoading.value = true;
  $fetch("/api/signup", {
    method: "POST",
    body: form.value
  }).then(() => {
    form.reset();
    const toast = useToast();
    toast.add({
      description: "Successfully signed up! You can now log in.",
      color: "success"
    });
  }).catch(() => {}).finally(() => {
    isLoading.value = false;
    turnstile.value?.reset();
  });
};
</script>

<template>
  <main class="flex items-center justify-center h-dvh bg-primary px-4">
    <div class="bg-default p-8 rounded-lg shadow-md w-full max-w-xl">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold">{{ SITE.name }}</h1>
        <p>Create your account</p>
      </div>
      <form class="mb-3 space-y-3" @submit.prevent="signUp">
        <InputFloating
          id="name"
          v-model.trim="form.name"
          type="text"
          placeholder="Name"
          autocomplete="name"
          required
        />
        <InputFloating
          id="email"
          v-model.trim="form.email"
          type="email"
          placeholder="Email address"
          autocomplete="email"
          required
        />
        <InputFloating
          id="password"
          v-model="form.password"
          type="password"
          placeholder="Password"
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
        <UCheckbox color="secondary" required>
          <template #label>I have read and understood {{ SITE.name }} Terms of use & Privacy policy</template>
        </UCheckbox>
        <div class="text-center">
          <NuxtTurnstile ref="turnstile" v-model="form.turnstile" :options="{ theme, size: 'flexible' }" />
        </div>
        <div class="space-y-2">
          <UButton
            label="Sign in"
            type="submit"
            variant="subtle"
            size="xl"
            class="rounded-lg font-bold"
            :disabled="isLoading"
            block
          />
          <p class="text-center font-bold">or</p>
          <UButton
            label="Sign in with Google"
            icon="logos:google-icon"
            variant="subtle"
            color="neutral"
            type="button"
            size="xl"
            class="rounded-lg font-bold"
            :disabled="isLoading"
            block
          />
        </div>
      </form>
      <p>Already have an account? <ULink to="/login" class="text-primary hover:text-primary hover:underline font-bold">Sign in</ULink></p>
      <ULink to="/" class="text-primary hover:text-primary hover:underline font-bold">Go back home</ULink>
    </div>
  </main>
</template>
