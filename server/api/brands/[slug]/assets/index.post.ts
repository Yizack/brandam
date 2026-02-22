export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim())
  }).parse);

  const formData = await readFormData(event);

  const files = formData.getAll("files") as File[];
  const previewFiles = formData.getAll("previewFiles") as File[];
  const payload = formData.get("payload") as string;

  const validation = z.object({
    items: z.array(z.object({
      name: z.string().min(1).transform(v => v.trim()),
      description: z.string().optional().transform(v => v?.trim() || null),
      type: z.enum(["image", "vector", "document", "font", "color"]),
      content: z.string().optional(),
      height: z.number().optional(),
      width: z.number().optional(),
      bgColor: z.string().optional()
    })).min(1)
  }).safeParse(JSON.parse(payload));

  if (!validation.success) {
    throw createError({
      status: ErrorCode.BAD_REQUEST,
      message: `Invalid payload. ${validation.error.issues.map(i => i.message).join(", ")}`
    });
  }

  const { items } = validation.data;

  const brandId = await getBrandIdBySlug(event, params.slug);

  const member = await db.select().from(tables.members).where(and(
    eq(tables.members.brandId, brandId),
    eq(tables.members.userId, user.id)
  )).get();

  if (!member) {
    throw createError({
      status: ErrorCode.FORBIDDEN,
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
        } : undefined,
        hasPreview: !!previewFiles[i] || undefined,
        bgColor: item.bgColor
      }) satisfies BrandamAsset["data"],
      brandId,
      userId: user.id
    };
  });

  const assets = await db.insert(tables.assets).values(values).onConflictDoNothing().returning().all();

  if (!assets) {
    throw createError({
      status: ErrorCode.INTERNAL_SERVER_ERROR,
      message: "Failed to create assets"
    });
  }

  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const asset = assets[i];

      if (file && asset) {
        await blob.put(`/assets/${asset.uuid}`, file, {
          contentType: file.type,
          prefix: "uploads",
          customMetadata: {
            brandId: brandId.toString(),
            userId: user.id.toString()
          }
        });
      }
    }
  }

  if (previewFiles && previewFiles.length > 0) {
    for (let i = 0; i < previewFiles.length; i++) {
      const previewFile = previewFiles[i];
      const asset = assets[i];

      if (previewFile && asset) {
        await blob.put(`/assets/${asset.uuid}-preview`, previewFile, {
          contentType: previewFile.type,
          prefix: "uploads",
          customMetadata: {
            brandId: brandId.toString(),
            userId: user.id.toString()
          }
        });
      }
    }
  }

  return assets;
});
