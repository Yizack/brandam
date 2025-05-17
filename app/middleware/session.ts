export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();

  if (loggedIn.value!) return;

  const redirect = to.fullPath === "/app" ? undefined : to.fullPath;
  return navigateTo({ name: "login", query: { redirect } }, { replace: true });
});
