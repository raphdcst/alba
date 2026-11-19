import * as Cloudflare from "@alchemy.run/cloudflare";
import * as Neon from "@alchemy.run/neon";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

export const Database = Effect.gen(function* Database() {
  const project = yield* Neon.Project("db", {
    historyRetentionSeconds: 21_600,
    region: "aws-eu-central-1",
  });

  const branch = yield* Neon.Branch("db-branch", {
    migrations: "../../packages/db/src/migrations",
    project,
  });

  return { branch, project };
});

export const Hyperdrive = Effect.gen(function* Hyperdrive() {
  const { branch } = yield* Database;
  return yield* Cloudflare.Hyperdrive.Connection("hyperdrive", {
    caching: { disabled: true },
    dev: branch.pooledOrigin,
    origin: branch.origin,
  });
});

export const databaseProviders = Layer.mergeAll(Neon.providers());
