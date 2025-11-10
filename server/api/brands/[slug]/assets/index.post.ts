export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim())
  }).parse);

  const formData = await readFormData(event);

  const files = formData.getAll("files") as File[];
  const payload = formData.get("payload") as string;

  const validation = z.object({
    items: z.array(z.object({
      name: z.string().min(1).transform(v => v.trim()),
      description: z.string().optional().transform(v => v?.trim() || null),
      type: z.enum(["image", "vector", "document", "font", "color"]),
      content: z.string().optional(),
      height: z.number().optional(),
      width: z.number().optional()
    })).min(1)
  }).safeParse(JSON.parse(payload));

  if (!validation.success) {
    throw createError({
      statusCode: ErrorCode.BAD_REQUEST,
      message: `Invalid payload. ${validation.error.issues.map(i => i.message).join(", ")}`
    });
  }

  const { items } = validation.data;

  const DB = useDB();

  const brand = await DB.select({
    id: tables.brands.id
  }).from(tables.brands).where(eq(tables.brands.slug, params.slug)).get();

  if (!brand) {
    throw createError({
      statusCode: ErrorCode.NOT_FOUND,
      message: "Brand not found"
    });
  }

  const member = await DB.select().from(tables.members).where(and(
    eq(tables.members.brandId, brand.id),
    eq(tables.members.userId, user.id)
  )).get();

  if (!member) {
    throw createError({
      statusCode: ErrorCode.FORBIDDEN,
      message: "You do not have access to this brand"
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
        metadata: files[i] ? {
          size: files[i].size,
          mimetype: files[i].type,
          width: item.width,
          height: item.height
        } : undefined
      }) satisfies BrandamAsset["data"],
      brandId: brand.id,
      userId: user.id
    };
  });

  const assets = await DB.insert(tables.assets).values(values).onConflictDoNothing().returning().all();

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

  return assets;
});
