<script setup lang="ts">
const { user } = useUserSession();

const toast = useToast();

const isLoading = ref(false);

const form = useFormState({
  name: user.value?.name || "",
  email: user.value?.email || ""
});

const updateProfile = async () => {
  isLoading.value = true;
  $fetch("/api/user", {
    method: "PATCH",
    body: {
      name: form.value.name
    }
  }).then(() => {
    user.value && (user.value.name = form.value.name);
    toast.add({
      description: "Profile updated successfully.",
      color: "success"
    });
  }).catch(() => {}).finally(() => {
    isLoading.value = false;
  });
};
</script>

<template>
  <section v-if="user" class="space-y-2">
    <div>
      <h2 class="text-xl font-semibold">Profile</h2>
      <p class="text-muted">Manage your account information.</p>
    </div>
    <form class="space-y-2" @submit.prevent="updateProfile">
      <InputFloating v-model="form.name" placeholder="Name" />
      <InputFloating v-model="form.email" placeholder="Email" readonly />
      <UButton
        label="Update profile"
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
