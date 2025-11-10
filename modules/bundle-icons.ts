import { defineNuxtModule } from "nuxt/kit";

const iconsList = [
  "lucide:menu",
  "lucide:info",
  "lucide:house",
  "lucide:layout-dashboard",
  "lucide:moon",
  "lucide:sun",
  "lucide:arrow-left",
  "lucide:arrow-right",
  "lucide:chevron-down",
  "lucide:arrow-big-right-dash",
  "lucide:user",
  "lucide:users",
  "lucide:plus",
  "lucide:x",
  "lucide:check",
  "lucide:box",
  "lucide:grid-2x2",
  "lucide:images",
  "lucide:pen-tool",
  "lucide:file-text",
  "lucide:type",
  "lucide:palette",
  "lucide:search",
  "lucide:shield-check",
  "lucide:cog",
  "lucide:copy-check",
  "lucide:copy",
  "lucide:external-link",
  "lucide:log-out",
  "lucide:download",
  "lucide:upload",
  "lucide:pencil",
  "lucide:trash",
  "lucide:ellipsis",
  "lucide:ellipsis-vertical",
  "lucide:loader-circle",
  "simple-icons:github",
  "logos:google-icon"
];

export default defineNuxtModule({
  meta: {
    name: "bundle-icons"
  },
  hooks: {
    "icon:clientBundleIcons": (icons: Set<string>) => {
      for (const icon of iconsList) {
        icons.add(icon);
      }
    }
  }
});
