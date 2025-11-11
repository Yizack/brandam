<script setup lang="ts">
import type { DropdownMenuItem, SelectItem } from "@nuxt/ui";

const { user } = useUserSession();

const brandStore = useBrandStore();
const { members, grants } = storeToRefs(brandStore);

const { status } = await brandStore.fetchMembers();

const actions: DropdownMenuItem[] = [
  {
    label: "Remove member",
    color: "error" as const,
    onSelect: () => console.info("Not implemented yet")
  }
];

const roles = [
  { label: "Owner", value: MemberRole.OWNER },
  { label: "Admin", value: MemberRole.ADMIN },
  { label: "Editor", value: MemberRole.EDITOR }
] satisfies SelectItem[];
</script>

<template>
  <ul v-if="status === 'pending'" role="list" class="divide-y divide-default">
    <li v-for="i in 3" :key="i" class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6">
      <div class="flex items-center gap-3 min-w-0">
        <USkeleton class="rounded-full w-10 h-10" />
        <div class="text-sm min-w-0">
          <USkeleton class="h-4 w-24 mb-1" />
          <USkeleton class="h-3 w-32" />
        </div>
      </div>
      <div class="flex items-center gap-3">
        <USkeleton class="h-8 w-24 rounded" />
        <USkeleton class="h-8 w-8 rounded" />
      </div>
    </li>
  </ul>
  <ul v-else role="list" class="divide-y divide-default">
    <li v-for="member in members" :key="member.user.id" class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6">
      <div class="flex items-center gap-3 min-w-0">
        <UAvatar
          :alt="member.user.name"
          size="md"
        />
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
          :items="roles.filter(role => role.value !== MemberRole.OWNER || member.roleId === MemberRole.OWNER)"
          color="neutral"
          :ui="{ value: 'capitalize', item: 'capitalize' }"
          :disabled="!grants.admin || member.user.id === user?.id || member.roleId === MemberRole.OWNER"
        />
        <UDropdownMenu
          :items="actions"
          :content="{ align: 'end' }"
          :disabled="!grants.admin || member.user.id === user?.id || member.roleId === MemberRole.OWNER"
        >
          <UButton
            icon="lucide:ellipsis-vertical"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </div>
    </li>
  </ul>
</template>
