<script setup lang="ts">

</script>

<template>
  <div>
    <NuxtLoadingIndicator :throttle="0" />
    <NuxtLayout>
      <UApp>
        <NuxtPage />
      </UApp>
    </NuxtLayout>
  </div>
</template>
