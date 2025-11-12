import { parseURL } from "ufo";

export const useOrigin = (path: string, overrideOrigin?: string) => {
  const url = ref("");

  onBeforeMount(() => {
    const origin = overrideOrigin || window.location.origin;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    url.value = origin + normalizedPath;

    if (origin !== SITE.host) {
      // if origin is different from SITE.host, we assume it's a custom domain
      // remove the brand slug from the path since it should be the root of the custom domain
      const { pathname, search } = parseURL(normalizedPath);
      const pathParts = pathname.split("/").filter(Boolean);
      pathParts.shift();
      const newPath = pathParts.length || search ? `/${pathParts.join("/")}` : "";
      url.value = origin + newPath + search;
    }
  });

  return { url };
};
