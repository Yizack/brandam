<script setup lang="ts">
const route = useRoute("brand");
const { data: brand } = useFetch(`/api/brands/${route.params.brand}`);
</script>

<template>
  <main>
    {{ brand }}
  </main>
</template>
