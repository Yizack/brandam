export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim())
  }).parse);

  const formData = await readFormData(event);

  const files = formData.getAll("files") as File[];
  const payload = formData.get("payload") as string;

  const validation = z.object({
    brandId: z.number().int().positive(),
    items: z.array(z.object({
      name: z.string().min(1).transform(v => v.trim()),
      description: z.string().optional().transform(v => v?.trim() || null),
      type: z.enum(["image", "vector", "document", "font", "color"]),
      content: z.string().optional()
    })).min(1)
  }).safeParse(JSON.parse(payload));

  if (!validation.success) {
    throw createError({
      statusCode: ErrorCode.BAD_REQUEST,
      message: "Invalid payload"
    });
  }

  const { items } = validation.data;

  const DB = useDB();
  const brand = await DB.select().from(tables.brands).where(and(
    eq(tables.brands.id, validation.data.brandId),
    eq(tables.brands.slug, params.slug)
  )).get();

  if (!brand) {
    throw createError({
      statusCode: ErrorCode.NOT_FOUND,
      message: "Brand not found"
    });
  }

  const values = items.map((item, i) => {
    return {
      name: item.name,
      description: item.description,
      data: (item.type === "color" ? {
        type: item.type,
        content: item.content!
      } : {
        type: item.type,
        content: item.content,
        metadata: files[i] ? { size: files[i].size, mimetype: files[i].type } : undefined
      }) satisfies BrandamAsset["data"],
      brandId: validation.data.brandId,
      userId: user.id
    };
  });

  const assets = await DB.insert(tables.assets).values(values).returning().all();

  if (!assets) {
    throw createError({
      statusCode: ErrorCode.INTERNAL_SERVER_ERROR,
      message: "Failed to create assets"
    });
  }

  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const asset = assets[i];

      if (file && asset) {
        await hubBlob().put(`/assets/${asset.uuid}`, file, {
          contentType: file.type,
          prefix: "uploads",
          customMetadata: {
            brandId: brand.id.toString(),
            userId: user.id.toString()
          }
        });
      }
    }
  }
});
