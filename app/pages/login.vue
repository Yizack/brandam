<script setup lang="ts">
definePageMeta({ layout: false });

const loading = ref(false);

const form = useFormState({
  email: "",
  password: "",
  remember: false
});

const login = () => {
  loading.value = true;
  $fetch("/api/login", {
    method: "POST",
    body: form.value
  }).then(() => {
    alert("Login successful");
  }).catch(() => {}).finally(() => {
    loading.value = false;
  });
};
</script>

<template>
  <main class="flex items-center justify-center min-h-screen bg-primary px-4">
    <div class="bg-default p-8 rounded-lg shadow-md w-full max-w-xl">
      <h1 class="text-3xl font-bold text-center mb-6">BAMFolio</h1>
      <form class="mb-3" @submit.prevent="login">
        <InputFloating v-model.trim="form.email" type="email" class="w-full mb-3" placeholder="Email address" autocomplete="email" required />
        <InputFloating v-model="form.password" type="password" class="w-full mb-3" placeholder="Password" autocomplete="current-password" required />
        <UCheckbox v-model="form.remember" label="Remember me" color="secondary" class="mb-3" />
        <ULink to="/recovery" class="text-primary hover:text-primary hover:underline font-bold">Forgot password?</ULink>
        <div class="grid my-3">
          <UButton type="submit" variant="subtle" size="xl" class="text-center justify-center rounded-lg font-bold mb-2" :disabled="loading">Sign in</UButton>
          <UButton icon="logos:google-icon" variant="subtle" color="neutral" type="submit" size="xl" class="text-center justify-center rounded-lg font-bold" :disabled="loading">Sign in with Google</UButton>
        </div>
      </form>
      <p>No account? <ULink to="/signup" class="text-primary hover:text-primary hover:underline font-bold">Sign up</ULink></p>
      <ULink to="/" class="text-primary hover:text-primary hover:underline font-bold">Go back home</ULink>
    </div>
  </main>
</template>
