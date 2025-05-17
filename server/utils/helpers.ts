import { digest } from "ohash";

export { z } from "zod";

export const hash = (message: string, salt: string) => {
  return digest(message + salt);
};
