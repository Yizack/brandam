export const useBrandStore = defineStore("brand", () => {
  const toast = useToast();
  const { user } = useUserSession();

  const brand = ref() as Ref<BrandamBrand>;
  const assets = ref<BrandamAsset[]>([]);
  const domains = ref<BrandamDomain[]>([]);
  const members = ref<BrandamMember[]>([]);
  const role = ref<{ id?: MemberRole, name: string }>({ id: undefined, name: "" });

  const grants = computed(() => getRoleGrants(role.value.id, !!user.value));

  const setup = (data: BrandamBrandWithAssets & { roleId?: MemberRole }) => {
    const { brand: brandData, assets: assetsData, roleId } = data;
    brand.value = brandData;
    assets.value = assetsData;
    if (roleId) {
      role.value.id = roleId;
      role.value.name = roleNames[roleId];
    }
  };

  const updateBrand = async (data: Partial<BrandamBrand>) => {
    return $fetch(`/api/brands/${brand.value.slug}`, {
      method: "PATCH",
      body: data
    }).then(() => {
      brand.value = { ...brand.value, ...data };
      toast.add({
        description: "Brand settings updated",
        color: "success"
      });
    });
  };

  const deleteAsset = async (asset: BrandamAsset) => {
    if (!confirm("Are you sure you want to delete this asset? This action cannot be undone.")) return;
    return $fetch(`/api/brands/${brand.value.slug}/assets/${asset.uuid}`, {
      method: "DELETE"
    }).then(() => {
      assets.value = assets.value.filter(a => a.uuid !== asset.uuid);
      toast.add({
        description: "The asset has been successfully deleted",
        color: "success"
      });
    });
  };

  const addAssets = async (data: {
    name: string;
    description: string;
    type: BrandamAssetTypes;
    content?: string;
    file?: File;
    previewFile?: File;
  }[]) => {
    const payload = new FormData();
    const items = data.map(({ file, ...item }) => ({ ...item }));
    payload.append("payload", JSON.stringify({ brandId: brand.value.id, items }));
    for (const item of data) {
      if (!(item.file instanceof File)) continue;
      payload.append("files", item.file);
      if (item.previewFile instanceof File) {
        payload.append("previewFiles", item.previewFile);
      }
    }

    return $fetch(`/api/brands/${brand.value.slug}/assets`, {
      method: "POST",
      body: payload
    }).then((newAssets) => {
      assets.value.push(...newAssets);
      toast.add({
        description: "Asset added successfully",
        color: "success"
      });
    });
  };

  const editAsset = async (uuid: string, data: Pick<BrandamAsset, "name" | "description">) => {
    return $fetch(`/api/brands/${brand.value.slug}/assets/${uuid}`, {
      method: "PATCH",
      body: data
    }).then((response) => {
      const asset = assets.value.find(a => a.uuid === uuid);
      if (!asset) return;
      asset.name = response.name;
      asset.description = response.description;
      toast.add({
        description: "Asset updated successfully",
        color: "success"
      });
    });
  };

  const downloadAsset = async (asset: BrandamAsset) => {
    if (asset.data.type === "color" || !asset.data.metadata) return;

    const { default: mime } = await import("mime");
    const extension = mime.getExtension(asset.data.metadata.mimetype);
    const filename = toSlug(asset.name);

    const link = document.createElement("a");

    link.href = getAssetURL(asset.uuid);
    link.download = [filename, extension].filter(Boolean).join(".");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.add({
      description: "Asset download started",
      color: "success"
    });
  };

  const fetchMembers = async () => {
    const { data, status } = await useFetch(`/api/brands/${brand.value.slug}/members`, {
      key: `brands:${brand.value.slug}:members`,
      lazy: true,
      getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
    });

    watch(status, (newStatus) => {
      if (newStatus === "success") {
        members.value = data.value || [];
      }
    });

    return { status };
  };

  const editMember = async (memberId: number, data: Pick<BrandamMember, "roleId">) => {
    return $fetch(`/api/brands/${brand.value.slug}/members/${memberId}`, {
      method: "PATCH",
      body: data
    }).then(() => {
      const member = members.value.find(m => m.id === memberId);
      if (!member) return;
      member.roleId = data.roleId;
      toast.add({
        description: "Member updated successfully",
        color: "success"
      });
    });
  };

  const deleteMember = async (id: number) => {
    if (!confirm("Are you sure you want to remove this member? This action cannot be undone.")) return;
    return $fetch(`/api/brands/${brand.value.slug}/members/${id}`, {
      method: "DELETE"
    }).then(() => {
      members.value = members.value.filter(member => member.id !== id);
      useCachedData(`brands:${brand.value.slug}:members`, () => members.value);
      toast.add({
        description: "Member removed successfully",
        color: "success"
      });
    });
  };

  const fetchDomains = async () => {
    const { data, status } = await useFetch(`/api/brands/${brand.value.slug}/domains`, {
      key: `brands:${brand.value.slug}:domains`,
      lazy: true,
      getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
    });

    watch(status, (newStatus) => {
      if (newStatus === "success") {
        domains.value = data.value || [];
      }
    });

    return { status };
  };

  const addDomain = async (hostname: string) => {
    return $fetch(`/api/brands/${brand.value.slug}/domains`, {
      method: "POST",
      body: { hostname }
    }).then((domain) => {
      domains.value.push(domain);
      useCachedData(`brands:${brand.value.slug}:domains`, () => domains.value);
      toast.add({
        description: "Domain added successfully",
        color: "success"
      });
    });
  };

  const deleteDomain = async (hostname: string) => {
    if (!confirm("Are you sure you want to delete this domain? This action cannot be undone.")) return;
    return $fetch(`/api/brands/${brand.value.slug}/domains/${hostname}`, {
      method: "DELETE"
    }).then(() => {
      domains.value = domains.value.filter(d => d.hostname !== hostname);
      useCachedData(`brands:${brand.value.slug}:domains`, () => domains.value);
      toast.add({
        description: "Domain deleted successfully",
        color: "success"
      });
    });
  };

  const inviteMember = async (email: string) => {
    return $fetch(`/api/brands/${brand.value.slug}/members`, {
      method: "POST",
      body: { email }
    }).then(() => {
      toast.add({
        description: "Invitation request sent successfully",
        color: "success"
      });
    });
  };

  return {
    brand,
    assets,
    members,
    role,
    domains,
    grants,
    setup,
    updateBrand,
    addAssets,
    editAsset,
    deleteAsset,
    downloadAsset,
    fetchMembers,
    editMember,
    deleteMember,
    fetchDomains,
    addDomain,
    deleteDomain,
    inviteMember
  };
});
