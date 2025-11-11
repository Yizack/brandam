import { defineNuxtModule } from "nuxt/kit";
import iconsList from "./icons";

export default defineNuxtModule({
  meta: {
    name: "bundle-icons"
  },
  hooks: {
    "icon:clientBundleIcons": (icons) => {
      for (const icon of iconsList) {
        icons.add(icon);
      }
    }
  }
});
