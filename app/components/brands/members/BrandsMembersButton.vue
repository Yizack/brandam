<template>
  <UModal title="Manage Members" description="Manage your brand members." :close="{ variant: 'outline', class: 'rounded-full' }" :dismissible="false">
    <UButton icon="lucide:users" color="neutral" variant="subtle" label="Members" class="rounded-lg" />
    <template #body>
      <BrandsMembersList />
    </template>
  </UModal>
</template>
