<template>
  <Teleport to="#teleports">
    <div class="h-14">
      <div class="fixed w-full bottom-0 z-50 light:bg-slate-900/80 dark:bg-slate-950/80 text-white backdrop-blur-sm">
        <UContainer class="flex items-center justify-between gap-1 py-3 px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-2">
            <Icon name="lucide:shield-check" size="1.3rem" />
            <span class="font-bold text-lg">Admin Mode</span>
          </div>
          <div class="flex items-center gap-3">
            <BrandsSettingsButton />
            <BrandsAssetButton />
          </div>
        </UContainer>
      </div>
    </div>
  </Teleport>
</template>
