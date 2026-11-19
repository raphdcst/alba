import * as Cloudflare from "@alchemy.run/cloudflare";
import * as Config from "effect/Config";

import { Hyperdrive } from "./db";

export const server = Cloudflare.Worker("server", {
  compatibility: {
    flags: ["nodejs_compat"],
  },
  dev: {
    port: 3000,
  },
  env: {
    BETTER_AUTH_SECRET: Config.Redacted("BETTER_AUTH_SECRET"),
    BETTER_AUTH_URL: Cloudflare.Worker.URL,
    CORS_ORIGIN: Config.String("CORS_ORIGIN"),
    HYPERDRIVE: Hyperdrive,
  },
  main: "../../apps/server/src/index.ts",
});

export type ServerEnv = Cloudflare.InferEnv<typeof server>;
