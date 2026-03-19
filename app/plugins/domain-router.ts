export default defineNuxtPlugin({
  name: "domain-brand",
  enforce: "pre",
  setup () {
    const event = useRequestEvent();
    const brandSlug = event?.context.brandSlug as string | undefined;
    const slug = useState("brandSlug", () => brandSlug);

    if (import.meta.server) {
      if (!slug.value) return;
      addRouteMiddleware("domain-router-middleware", (to) => {
        if (to.path === `/${slug.value}`) return;
        return navigateTo(`/${slug.value}`, { replace: true });
      }, { global: true });
    }

    if (import.meta.client) {
      const router = useRouter();
      const stopAfterEach = router.afterEach((to) => {
        if (to.path === `/${slug.value}`) {
          history.replaceState(history.state, "", "/");
          stopAfterEach();
        }
      });
    }
  }
});
