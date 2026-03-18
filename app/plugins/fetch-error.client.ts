export default defineNuxtPlugin({
  name: "fetch-error",
  parallel: true,
  async setup () {
    const toast = useToast();
    globalThis.$fetch = $fetch.create({
      onResponseError: ({ response }) => {
        const message = response.status === 500 ? "An unknown error occurred" : response._data.message;
        toast.add({ title: SITE.name, description: message, color: "error" });
      }
    });
  }
});
