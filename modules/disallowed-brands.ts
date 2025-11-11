import { writeFile } from "node:fs/promises";
import { join } from "pathe";
import { loadFile } from "magicast";
import { defineNuxtModule, extendPages } from "nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "disallowed-brands"
  },
  hooks: {
    ready: () => extendPages(async (pages) => {
      const pageNames = pages.map(page => page.name?.split("-")[0]);
      const reservedNames = [
        "api",
        "uploads",
        "images"
      ];

      const disallowedBrands = new Set([...pageNames, ...reservedNames]);

      const filePath = join("server", "utils", "constants.ts");
      const mod = await loadFile(filePath);

      mod.exports.DISALLOWED_BRANDS ||= [];

      if (mod.exports.DISALLOWED_BRANDS.length === disallowedBrands.size) {
        return;
      }

      mod.exports.DISALLOWED_BRANDS = [...disallowedBrands];

      const eol = mod.$code.match(/\r\n/) ? "\r\n" : "\n";

      const generated = mod.generate({ lineTerminator: eol });
      const code = generated.code.endsWith(eol) ? generated.code : generated.code + eol;
      await writeFile(filePath, code, "utf-8");
    })
  }
});
