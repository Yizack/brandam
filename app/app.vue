<script setup lang="ts">
const toast = useToast();

onBeforeMount(() => {
  // eslint-disable-next-line no-global-assign
  $fetch = $fetch.create({
    onResponseError: ({ response }) => {
      const description = response.status === 500 ? "error_any" : response._data.message;
      toast.add({ title: "BAMFolio", description, color: "error" });
    }
  });
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator :throttle="0" />
    <UApp>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
