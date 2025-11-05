export const useBrandStore = defineStore("brand", () => {
  const toast = useToast();

  const brand = ref() as Ref<BrandamBrand>;
  const assets = ref<BrandamAsset[]>([]);

  const setup = (data: BrandamBrandWithAssets) => {
    const { assets: assetsData, ...brandData } = data;
    brand.value = brandData;
    assets.value = assetsData;
  };

  const updateBrand = async (data: Partial<BrandamBrand>) => {
    return $fetch(`/api/brands/${brand.value.slug}`, {
      method: "PATCH",
      body: data
    }).then(() => {
      brand.value = { ...brand.value, ...data };
      toast.add({ title: SITE.name, description: "Brand settings updated", color: "success" });
    });
  };

  const deleteAsset = async (uuid: string) => {
    return $fetch(`/api/brands/${brand.value.slug}/assets/${uuid}`, {
      method: "DELETE"
    }).then(() => {
      assets.value = assets.value.filter(asset => asset.uuid !== uuid);
      toast.add({ title: "Asset Deleted", description: "The asset has been successfully deleted.", color: "success" });
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
      toast.add({ title: SITE.name, description: "Asset added successfully.", color: "success" });
    });
  };

  return {
    brand,
    assets,
    setup,
    updateBrand,
    deleteAsset,
    addAssets
  };
});
