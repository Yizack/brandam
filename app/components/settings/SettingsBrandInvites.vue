<script setup lang="ts">
import type { Row, TableMeta } from "@tanstack/vue-table";

const { data: invites } = await useFetch("/api/user/invites", {
  key: "invites",
  lazy: true,
  deep: true
});

const columns = [
  { id: "brand", header: "Brand" },
  { id: "created", header: "Created" },
  { id: "updated", header: "Last updated" },
  { id: "role", header: "Role" },
  { id: "action", header: "Action" }
];

const data = computed(() => invites.value?.map(member => ({
  id: member.id,
  brand: member.brand,
  created: member.createdAt,
  createdAgo: useTimeAgo(member.createdAt).value,
  updated: member.updatedAt,
  updatedAgo: useTimeAgo(member.updatedAt).value,
  role: roleNames[member.roleId],
  active: member.active
})) || []);

const meta: TableMeta<typeof data.value[0]> = {
  class: {
    tr: (row: Row<typeof data.value[0]>) => {
      if (row.index % 2 === 0) return "bg-muted/50";
      return "";
    }
  }
};

const pendingCount = computed(() => invites.value?.filter(invite => !invite.active).length || 0);

const loading = ref({
  accept: {} as Record<number, boolean>,
  decline: {} as Record<number, boolean>
});

const acceptInvite = (id: number) => {
  loading.value.accept[id] = true;
  $fetch(`/api/user/invites/${id}`, {
    method: "PATCH"
  }).then(() => {
    const invite = invites.value?.find(invite => invite.id === id);
    if (invite) {
      invite.active = true;
    }
  }).catch(() => {}).finally(() => {
    loading.value.accept[id] = false;
  });
};

const deleteInvite = (id: number) => {
  if (!confirm("Are you sure you want to decline this invite? This action cannot be undone.")) return;
  loading.value.decline[id] = true;
  $fetch(`/api/user/invites/${id}`, {
    method: "DELETE"
  }).then(() => {
    invites.value = invites.value?.filter(invite => invite.id !== id) || [];
  }).catch(() => {}).finally(() => {
    loading.value.decline[id] = false;
  });
};
</script>

<template>
  <section class="space-y-4">
    <div>
      <h2 class="text-xl font-semibold">
        Brand invites <UBadge v-if="pendingCount > 0" :label="`${pendingCount} pending`" color="warning" variant="outline" class="tabular-nums px-2" />
      </h2>
      <p class="text-muted">Accepting an invite will give you access to the brand's dashboard and resources.</p>
    </div>
    <UTable :columns="columns" :data="data" class="border border-muted rounded-lg" :meta="meta" empty="No pending invites">
      <template #brand-cell="{ row }">
        <div class="flex items-center">
          <UUser :description="row.original.brand.description || ''">
            <template #name>
              <ULink :to="`/${row.original.brand.slug}`" class="underline text-lg">{{ row.original.brand.name }}</ULink>
            </template>
          </UUser>
        </div>
      </template>
      <template #created-cell="{ row }">
        <NuxtTime :datetime="row.original.created" :title="row.original.createdAgo" />
      </template>
      <template #updated-cell="{ row }">
        <NuxtTime :datetime="row.original.updated" :title="row.original.updatedAgo" />
      </template>
      <template #action-cell="{ row }">
        <div class="flex gap-2">
          <template v-if="!row.original.active">
            <UButton
              icon="lucide:check"
              variant="subtle"
              color="success"
              title="Accept invite"
              :loading="loading.accept[row.original.id]"
              @click="acceptInvite(row.original.id)"
            />
            <UButton
              icon="lucide:x"
              variant="subtle"
              color="error"
              title="Decline invite"
              :loading="loading.decline[row.original.id]"
              @click="deleteInvite(row.original.id)"
            />
          </template>
          <template v-else>
            <UBadge icon="lucide:check" label="Accepted" variant="subtle" color="success" />
            <UButton
              icon="lucide:trash"
              variant="subtle"
              color="neutral"
              title="Leave brand"
              :loading="loading.decline[row.original.id]"
              @click="deleteInvite(row.original.id)"
            />
          </template>
        </div>
      </template>
    </UTable>
  </section>
</template>
