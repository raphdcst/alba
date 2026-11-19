import { fileURLToPath } from "node:url";

const apiReference = {
  path: fileURLToPath(new URL("../../packages/api", import.meta.url)),
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "latest",
  css: ["~/assets/css/main.css"],
  devServer: {
    port: 3001,
  },
  devtools: { enabled: true },
  experimental: {
    payloadExtraction: "client",
  },
  hooks: {
    "vite:extendConfig"(config, { isClient }) {
      if (!isClient || !config.optimizeDeps) {
        return;
      }
      // Vue Query uses devtools-api 6, whose CommonJS entry needs optimization.
      config.optimizeDeps.exclude = config.optimizeDeps.exclude?.filter(
        (dependency) => dependency !== "@vue/devtools-api"
      );
    },
  },
  modules: ["evlog/nuxt", "@nuxt/ui"],
  nitro: {
    typescript: {
      tsConfig: { references: [apiReference] },
    },
  },
  runtimeConfig: {
    // server-side override for SSR fetches (NUXT_SERVER_URL); falls back to the public URL
    public: {
      serverUrl: process.env.NUXT_PUBLIC_SERVER_URL ?? "",
    },
    serverUrl: "",
  },
  typescript: {
    nodeTsConfig: { references: [apiReference] },
    sharedTsConfig: { references: [apiReference] },
    tsConfig: { references: [apiReference] },
  },
  vite: {
    optimizeDeps: {
      include: [
        "nuxt > @nuxt/devtools > @vue/devtools-core",
        "nuxt > @nuxt/devtools > @vue/devtools-kit",
        "better-auth/vue",
        "zod",
        "@orpc/client",
        "@orpc/client/fetch",
        "@orpc/tanstack-query",
        "@tanstack/vue-query",
        "@tanstack/vue-query > @vue/devtools-api",
        "@tanstack/vue-query-devtools",
      ],
    },
  },
});
