<script setup lang="ts">
definePageMeta({ layout: false, middleware: "authenticated" });

const toast = useToast();

const isLoading = ref(false);
const isResent = ref(false);

const { query, meta } = useRoute("login");
const needsConfirm = ref(query.error === "verify_needed" ? true : false);

const route = useRoute("login");

const form = useFormState({
  email: (query.email || meta.email) as string || "",
  password: "",
  remember: false
});

const signIn = () => {
  isLoading.value = true;
  $fetch("/api/login", {
    method: "POST",
    body: form.value
  }).then(() => {
    const redirect = route.query.redirect?.toString();
    const isInternalPath = redirect && redirect.startsWith("/"); // Make sure redirect is an internal path
    navigateTo(isInternalPath ? redirect : "/app", { external: true, replace: true });
  }).catch((response) => {
    needsConfirm.value = response.data.statusCode === ErrorCode.FORBIDDEN;
  }).finally(() => {
    isLoading.value = false;
  });
};

const resendVerification = async () => {
  isLoading.value = true;
  $fetch("/api/verify/resend", {
    method: "POST",
    body: { email: form.value.email }
  }).then(() => {
    isResent.value = true;
    toast.add({
      description: "Email verification resent, please check your inbox",
      color: "success"
    });
  }).catch(() => {
    isResent.value = false;
  }).finally(() => {
    isLoading.value = false;
  });
};
</script>

<template>
  <main class="flex items-center justify-center h-dvh bg-primary px-4">
    <div class="bg-default p-8 rounded-lg shadow-md w-full max-w-xl">
      <h1 class="text-3xl font-bold text-center mb-6">{{ SITE.name }}</h1>
      <form class="mb-3 space-y-3" @submit.prevent="signIn">
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
          autocomplete="current-password"
          required
        />
        <UCheckbox v-model="form.remember" label="Remember me" color="secondary" />
        <p>
          <ULink to="/recovery" class="text-primary hover:text-primary hover:underline font-bold">Forgot password?</ULink>
        </p>
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
      <UAlert
        v-if="needsConfirm && !isResent"
        color="neutral"
        variant="subtle"
        class="my-2"
        description="Your email needs to be verified to continue, check your inbox for a verification email."
        :actions="[{
          label: 'Resend verification email',
          onClick: () => resendVerification(),
          loading: isLoading,
        }]"
      />
      <p>No account? <ULink to="/signup" class="text-primary hover:text-primary hover:underline font-bold">Sign up</ULink></p>
      <ULink to="/" class="text-primary hover:text-primary hover:underline font-bold">Go back home</ULink>
    </div>
  </main>
</template>
