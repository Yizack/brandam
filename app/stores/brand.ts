export const useBrandStore = defineStore("brand", () => {
  const toast = useToast();

  const brand = ref() as Ref<BrandamBrand>;
  const assets = ref<BrandamAsset[]>([]);
  const domains = ref<BrandamDomain[]>([]);
  const roleId = ref<MemberRole>();
  const isAdmin = computed(() => roleId.value === MemberRole.ADMIN || roleId.value === MemberRole.OWNER);

  const setup = (data: BrandamBrandWithAssets & { roleId?: MemberRole }) => {
    const { brand: brandData, assets: assetsData, roleId: role } = data;
    brand.value = brandData;
    assets.value = assetsData;
    roleId.value = role;
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
  }[]) => {
    const payload = new FormData();
    const items = data.map(({ file, ...item }) => ({ ...item }));
    payload.append("payload", JSON.stringify({ brandId: brand.value.id, items }));
    for (const item of data) {
      if (!(item.file instanceof File)) continue;
      payload.append("files", item.file);
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

  const downloadAsset = (asset: BrandamAsset) => {
    if (asset.data.type === "color" || !asset.data.metadata) return;
    const link = document.createElement("a");
    link.href = getAssetImage(asset.uuid);
    link.download = asset.name + "." + getFileExtension(asset.data.metadata.mimetype);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.add({
      description: "Asset download started",
      color: "success"
    });
  };

  const getMembers = async () => {
    return useFetch(`/api/brands/${brand.value.slug}/members`, {
      key: `brands:${brand.value.slug}:members`
    });
  };

  const fetchDomains = async () => {
    const { data, status } = await useFetch(`/api/brands/${brand.value.slug}/domains`, {
      key: `brands:${brand.value.slug}:domains`,
      lazy: true
    });

    watch(status, (newStatus) => {
      if (newStatus === "success") {
        domains.value = data.value || [];
      }
    });

    return { status };
  };

  const addDomain = async (name: string) => {
    return $fetch(`/api/brands/${brand.value.slug}/domains`, {
      method: "POST",
      body: { name }
    }).then((domain) => {
      domains.value.push(domain);
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
      domains.value = domains.value.filter(d => d.name !== hostname);
      toast.add({
        description: "Domain deleted successfully",
        color: "success"
      });
    });
  };

  return {
    brand,
    assets,
    domains,
    isAdmin,
    setup,
    updateBrand,
    deleteAsset,
    addAssets,
    downloadAsset,
    getMembers,
    fetchDomains,
    addDomain,
    deleteDomain
  };
});
