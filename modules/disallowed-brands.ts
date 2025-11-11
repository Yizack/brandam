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
      const pageNames = new Set(pages.map(page => page.name?.split("-")[0]));

      const filePath = join("server", "utils", "constants.ts");
      const mod = await loadFile(filePath);

      mod.exports.DISALLOWED_BRANDS = [
        ...pageNames,
        // Additional reserved names
        "api",
        "uploads",
        "images"
      ];

      const eol = mod.$code.match(/\r\n/) ? "\r\n" : "\n";

      const generated = mod.generate({ lineTerminator: eol });
      const code = generated.code.endsWith(eol) ? generated.code : generated.code + eol;
      await writeFile(filePath, code, "utf-8");
    })
  }
});
