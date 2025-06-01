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
      color: z.string().optional().transform(v => v?.trim()),
      font: z.object({
        name: z.string().min(1).transform(v => v.trim()),
        url: z.string().url().optional()
      }).optional()
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
  const brand = await useDB().select().from(tables.brands).where(and(
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
    const file = files[i]!;
    return {
      name: item.name,
      description: item.description,
      data: (item.color && !file ? {
        type: "color",
        content: item.color
      } : item.font ? {
        type: "font",
        content: item.font.name,
        url: item.font.url,
        metadata: { size: file.size, mimetype: file.type }
      } : {
        type: "file",
        metadata: { size: file.size, mimetype: file.type }
      }) satisfies BrandamAsset["data"],
      brandId: validation.data.brandId,
      userId: user.id
    };
  });

  const asset = await DB.insert(tables.assets).values(values).returning().get();
  return asset;
});
