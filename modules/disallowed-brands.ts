import { readFile, writeFile } from "node:fs/promises";
import { join } from "pathe";
import { defineNuxtModule } from "nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "disallowed-brands"
  },
  hooks: {
    "pages:extend": async (pages) => {
      const pageNames = [...new Set(pages.map(page => page.name?.split("-")[0]))];

      const disallowedBrands = [
        ...pageNames,
        // Additional reserved names
        "api",
        "uploads",
        "images"
      ];

      const filePath = join("server", "utils", "constants.ts");
      let fileContent = await readFile(filePath, "utf-8");

      const eol = fileContent.includes("\r\n") ? "\r\n" : "\n";
      const arrayContent = `${eol}  ${disallowedBrands.map(b => `"${b}"`).join(`,${eol}  `)}${eol}`;

      const exportRegex = /export const DISALLOWED_BRANDS = \[[\s\S]*?\];/m;
      const newExport = `export const DISALLOWED_BRANDS = [${arrayContent}];`;

      fileContent = fileContent.replace(exportRegex, newExport);
      await writeFile(filePath, fileContent, "utf-8");
    }
  }
});
