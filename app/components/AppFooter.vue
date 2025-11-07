<script setup lang="ts">
import type { FooterColumn } from "@nuxt/ui";

const columns: FooterColumn[] = [
  {
    label: "About us",
    children: [
      { label: "Home" },
      { label: "About us" }
    ]
  },
  {
    label: "Help",
    children: [
      { label: "Contact" },
      { label: "Support" },
      { label: "Account data" }
    ]
  },
  {
    label: "Legal",
    children: [
      { label: "Terms of use" },
      { label: "Privacy policy" },
      { label: "Cookie policy" }
    ]
  },
  {
    label: "Contribute",
    children: [
      { label: "Donate" },
      { label: "GitHub repository" },
      { label: "Report a bug" },
      { label: "Request a feature" }
    ]
  }
];
</script>

<template>
  <USeparator
    class="h-px"
  />

  <UFooter :ui="{ top: 'border-b border-default', center: 'hidden', left: 'hidden' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #left>
            <p class="text-xl font-bold">BrandAM</p>
            <p class="text-muted text-sm">
              © {{ new Date().getFullYear() }}, Yizack Rangel
            </p>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #right>
      <UButton
        to="https://github.com/Yizack/brandam"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="BrandAM on GitHub"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
