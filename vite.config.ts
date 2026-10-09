
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  base: "/samarthnaik/",
  tanstackStart: {
    server: { entry: "server" },
    prerender: {
      enabled: true,
      crawlLinks: true,
    },
  },
});
