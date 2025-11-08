<script setup lang="ts">
const brandStore = useBrandStore();
const { domains } = storeToRefs(brandStore);

const { status } = await brandStore.fetchDomains();

const domainForm = useFormState({
  hostname: ""
});

const loadingDomains = ref(false);

const addDomain = async () => {
  if (!domainForm.value.hostname) return;
  loadingDomains.value = true;
  brandStore.addDomain(domainForm.value.hostname).then(() => {
    domainForm.reset();
  }).catch(() => {}).finally(() => {
    loadingDomains.value = false;
  });
};

const deleteDomain = async (hostname: string) => {
  loadingDomains.value = true;
  brandStore.deleteDomain(hostname).then(() => {
  }).catch(() => {}).finally(() => {
    loadingDomains.value = false;
  });
};

const isPending = computed(() => status.value === "pending");
</script>

<template>
  <form @submit.prevent="addDomain">
    <h3 class="text-highlighted text-sm font-semibold mb-1">Custom Domains</h3>
    <p v-if="domains && !domains.length" class="text-sm text-muted">No custom domains linked yet.</p>
    <p v-else class="text-sm text-muted">List of custom domains</p>
    <div class="space-y-2 my-3">
      <USkeleton v-if="isPending" class="flex items-center justify-between p-2 border border-transparent rounded-lg">
        <span class="h-6" />
      </USkeleton>
      <template v-else>
        <div v-for="domain in domains" :key="domain.id" class="flex items-center p-2 border border-accented bg-muted rounded-lg">
          <span class="text-sm text-muted flex-1">{{ domain.name }}</span>
          <!-- active indicator -->
          <UBadge :color="domain.active ? 'success' : 'error'" variant="soft" class="me-1 flex items-center">
            <span class="inline-block w-2 h-2 rounded-full bg-success me-1" />
            Active
          </UBadge>
          <UButton icon="lucide:x" color="error" variant="ghost" size="xs" @click="deleteDomain(domain.name)" />
        </div>
      </template>
    </div>

    <UFieldGroup class="w-full">
      <UInput id="hostname" v-model.trim="domainForm.hostname" type="text" placeholder="example.com" :ui="{ root: 'w-full', base: 'h-full' }" />
      <UButton type="submit" icon="lucide:plus" variant="subtle" size="xl" :disabled="isPending || loadingDomains || !domainForm.hostname">
        Add
      </UButton>
    </UFieldGroup>
  </form>
</template>
