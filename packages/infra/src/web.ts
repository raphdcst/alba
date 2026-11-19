import * as Cloudflare from "@alchemy.run/cloudflare";
import type * as Effect from "effect/Effect";

import type { server } from "./server";

export const web = (serverWorker: Effect.Success<typeof server>) =>
  Cloudflare.Website.Nuxt("web", {
    compatibility: {
      flags: ["nodejs_compat", "global_fetch_strictly_public"],
    },
    dev: {
      port: 3001,
    },
    env: {
      NUXT_PUBLIC_SERVER_URL: serverWorker.url.as<string>(),
    },
    rootDir: "../../apps/web",
  });
