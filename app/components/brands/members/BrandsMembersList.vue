<script setup lang="ts">
import type { DropdownMenuItem, SelectItem } from "@nuxt/ui";

const brandStore = useBrandStore();
const { data: members } = await brandStore.getMembers();

const actions: DropdownMenuItem[] = [
  {
    label: "Remove member",
    color: "error" as const,
    onSelect: () => console.info("Remove member")
  }
];

const roles: SelectItem[] = [
  { label: "Owner", id: MemberRole.OWNER },
  { label: "Admin", id: MemberRole.ADMIN },
  { label: "Editor", id: MemberRole.EDITOR }
];
</script>

<template>
  <ul role="list" class="divide-y divide-default">
    <li
      v-for="(member, index) in members"
      :key="index"
      class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6"
    >
      <div class="flex items-center gap-3 min-w-0">
        <div class="text-sm min-w-0">
          <p class="text-highlighted font-medium truncate">
            {{ member.user.name }}
          </p>
          <p class="text-muted truncate">
            {{ member.user.email }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <USelect
          v-model="member.roleId"
          value-key="id"
          :items="roles"
          color="neutral"
          :ui="{ value: 'capitalize', item: 'capitalize' }"
        />

        <UDropdownMenu :items="actions" :content="{ align: 'end' }">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </div>
    </li>
  </ul>
</template>
