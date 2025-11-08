export const useBrandsStore = defineStore("brands", () => {
  const toast = useToast();

  const brands = ref<BrandamBrandWithCount[]>([]);

  const setup = (brandsData: BrandamBrandWithCount[]) => {
    brands.value = brandsData;
  };

  const createBrand = async (data: {
    name: string;
    description: string;
    slug: string;
  }) => {
    return $fetch("/api/brands", {
      method: "POST",
      body: data
    }).then((brand) => {
      brands.value.push(brand);
      toast.add({ description: "Your brand has been created", color: "success" });
    });
  };

  return {
    brands,
    setup,
    createBrand
  };
});
