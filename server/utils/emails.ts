// @ts-expect-error no types from html-to-text
import { convert } from "html-to-text";
import type { ExtractComponentProps } from "../../node_modules/nuxt-email-renderer/dist/runtime/server/utils/render";
import type AccountVerify from "~~/emails/AccountVerify.vue";

interface EmailTemplates {
  AccountVerify: typeof AccountVerify;
}

export const renderEmail = async <T extends keyof EmailTemplates>(
  templateName: T,
  props?: ExtractComponentProps<EmailTemplates[T]>
) => {
  const html = await renderEmailComponent(templateName, props) as string;

  const text: string = convert(html, {
    selectors: [
      { selector: "img", format: "skip" }
    ]
  });

  return { html, text };
};
