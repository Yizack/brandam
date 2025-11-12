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
      {
        label: "Donate",
        to: SITE.donate,
        target: "_blank"
      },
      {
        label: "GitHub repository",
        to: SITE.github.repo,
        target: "_blank"
      },
      {
        label: "Report a bug",
        to: SITE.github.repo + `/issues/new?assignees=${SITE.github.author}&labels=bug&projects=&template=1-bug_report.yml`,
        target: "_blank"
      },
      {
        label: "Request a feature",
        to: SITE.github.repo + `/issues/new?assignees=${SITE.github.author}&labels=enhancement&projects=&template=2-feature_request.yml`,
        target: "_blank"
      }
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
        :to="SITE.github.repo"
        target="_blank"
        icon="simple-icons:github"
        aria-label="BrandAM on GitHub"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
