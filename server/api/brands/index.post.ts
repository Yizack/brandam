export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    name: z.string().transform(v => v.trim()),
    description: z.string().optional().transform(v => v?.trim()),
    slug: z.string().transform(v => v.trim())
  }).parse);

  const DB = useDB();

  const insert = await DB.insert(tables.brands).values({
    name: body.name,
    description: body.description,
    slug: body.slug
  }).onConflictDoNothing().run();

  console.log(insert);
});
