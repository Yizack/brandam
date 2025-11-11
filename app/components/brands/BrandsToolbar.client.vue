<script setup lang="ts">
const brandStore = useBrandStore();
const { role } = storeToRefs(brandStore);
</script>

<template>
  <Teleport defer to="#teleports">
    <div class="h-14">
      <div class="fixed w-full bottom-0 bg-default/75 backdrop-blur-sm border-t border-default">
        <UContainer class="flex items-center justify-between gap-1 py-3 px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-2">
            <span class="font-bold text-lg">Brand Manager</span>
            <UBadge
              v-if="role.id"
              :label="role.name"
              color="neutral"
              variant="outline"
            />
          </div>
          <div class="flex items-center gap-3">
            <BrandsMembersButton />
            <BrandsSettingsButton />
            <BrandsAssetButton />
          </div>
        </UContainer>
      </div>
    </div>
  </Teleport>
</template>
