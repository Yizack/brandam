<script setup lang="ts">
definePageMeta({ layout: false });

onBeforeRouteLeave((to, from, next) => {
  if (to.name === "login") to.meta.email = from.meta.email;
  next();
});

const loaded = ref(false);
const verified = ref(false);

const { params, meta } = useRoute("verify-emailCode-token");
const emailCode = ref(params.emailCode);
const token = ref(params.token);
const email = ref("");

try {
  email.value = fromBase64URL(emailCode.value);
}
catch (e) {
  console.warn(e);
  throw createError({
    statusCode: ErrorCode.BAD_REQUEST,
    message: "Invalid email code"
  });
}

const verifyEmail = async () => {
  if (!email.value) return;
  $fetch("/api/verify", {
    method: "POST",
    body: { email: email.value, token: token.value }
  }).then(() => {
    verified.value = true;
    meta.email = email;
  }).catch(() => {}).finally(() => {
    loaded.value = true;
  });
};

onMounted(async () => {
  if (!(emailCode.value && token.value)) return;
  await verifyEmail();
});
</script>

<template>
  <main class="flex items-center justify-center h-dvh bg-primary px-4">
    <div class="bg-default p-8 rounded-lg shadow-md w-full max-w-xl text-center">
      <Transition name="fade" mode="out-in">
        <div v-if="!loaded" class="space-y-2">
          <Icon
            name="lucide:loader-circle"
            class="text-primary animate-spin mx-auto"
            size="5rem"
          />
          <h3 class="text-xl font-semibold">Verifying email...</h3>
        </div>

        <div v-else-if="verified" class="space-y-2">
          <Icon
            name="lucide:check"
            class="text-inverted mx-auto bg-success rounded-full p-4"
            size="5rem"
          />
          <h1 class="text-2xl font-bold">Welcome!</h1>
          <p class="text-muted">Your email has been verified successfully</p>
          <UButton
            label="Sign in"
            to="/login"
            variant="subtle"
            color="primary"
            size="xl"
            class="rounded-lg font-bold"
            block
          />
        </div>

        <div v-else class="space-y-2">
          <Icon
            name="lucide:x"
            class="text-inverted mx-auto bg-error rounded-full p-4"
            size="5rem"
          />
          <h1 class="text-2xl font-bold">Error!</h1>
          <p class="text-muted">Something went wrong verifying your email</p>
          <UButton
            label="Go home"
            to="/"
            variant="subtle"
            color="neutral"
            size="xl"
            class="rounded-lg font-bold"
            block
          />
        </div>
      </Transition>
    </div>
  </main>
</template>
