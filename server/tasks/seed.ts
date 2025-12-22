const testPassword = process.env.TEST_PASSWORD;
const testEmail = process.env.TEST_EMAIL;

const insertTestUsers = async (c?: number) => {
  if (!testPassword) throw new Error("TEST_PASSWORD is not set");
  for (let i = 0; i < (c || 1); i++) {
    await db.insert(tables.users).values({
      id: i + 1,
      name: `User ${i + 1}`,
      email: i === 0 && testEmail ? testEmail : `test${i + 1}@test.test`,
      password: testPassword ? hash(testPassword, useRuntimeConfig().secure.salt) : null,
      confirmed: true
    }).onConflictDoUpdate({
      target: [tables.users.id],
      set: {
        password: sql`excluded.password`
      }
    }).run();
  }
};

export default defineTask({
  meta: {
    name: "db:seed",
    description: "Run database seed task"
  },
  async run () {
    await insertTestUsers(3);
    console.info("Database seeded");
    return { result: "success" };
  }
});
