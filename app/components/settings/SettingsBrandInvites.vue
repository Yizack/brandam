<script setup lang="ts">
import type { Row, TableMeta } from "@tanstack/vue-table";

const { data: invites } = await useFetch("/api/user/invites", {
  key: "invites",
  lazy: true,
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
});

const columns = [
  {
    id: "brand",
    header: "Brand"
  },
  {
    id: "created",
    header: "Created"
  },
  {
    id: "updated",
    header: "Last updated"
  },
  {
    accessorKey: "role",
    header: "Role"
  },
  {
    id: "action",
    header: "Action"
  }
];

const data = ref(invites.value?.map(invite => ({
  brand: invite.brand,
  created: invite.createdAt,
  createdAgo: useTimeAgo(invite.createdAt),
  updated: invite.updatedAt,
  updatedAgo: useTimeAgo(invite.updatedAt),
  role: roleNames[invite.roleId],
  active: invite.active
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
          <template v-if="row.original.active">
            <UButton icon="lucide:x" variant="subtle" color="error" title="Decline invite" />
            <UButton icon="lucide:check" variant="subtle" color="success" title="Accept invite" />
          </template>
          <template v-else>
            <UBadge icon="lucide:check" label="Accepted" variant="subtle" color="success" />
            <UButton icon="lucide:trash" variant="subtle" color="neutral" title="Leave brand" />
          </template>
        </div>
      </template>
    </UTable>
  </section>
</template>
