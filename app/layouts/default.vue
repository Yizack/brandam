<template>
  <div id="layout">
    <SiteNavbar />
    <slot />
    <LazySiteFooter hydrate-on-visible />
  </div>
</template>
