import * as Neon from "@alchemy.run/neon";
import * as Output from "alchemy/Output";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";

const managedDatabase = Effect.gen(function* managedDatabase() {
  const database = yield* Neon.Project("database", {
    historyRetentionSeconds: 21_600,
    migrations: "../../packages/db/src/migrations",
  });
  const runtimeUrl = database.pooledConnectionUri.pipe(
    Output.map(Redacted.make)
  );

  return {
    runtimeEnv: { DATABASE_URL: runtimeUrl },
  };
});

export const databaseEnv = managedDatabase.pipe(
  Effect.map(({ runtimeEnv }) => runtimeEnv)
);

export const databaseBindings = {
  DATABASE_URL: databaseEnv.pipe(
    Effect.map(({ DATABASE_URL }) => DATABASE_URL)
  ),
};

export const databaseProviders = Layer.mergeAll(Neon.providers());
