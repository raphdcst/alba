import * as Cloudflare from "@alchemy.run/cloudflare";
import * as GitHub from "@alchemy.run/github";
import * as Alchemy from "alchemy";
import * as Output from "alchemy/Output";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import "varlock/auto-load";

import { Database, databaseProviders, Hyperdrive } from "./src/db";
import { server } from "./src/server";
import { web } from "./src/web";

export type { ServerEnv } from "./src/server";
export { server } from "./src/server";

export default Alchemy.Stack(
  "alba",
  {
    providers: Layer.mergeAll(
      Cloudflare.providers(),
      GitHub.providers(),
      databaseProviders
    ),
    state: Cloudflare.state(),
  },
  Effect.gen(function* stackResources() {
    yield* Database;
    yield* Hyperdrive;
    const serverWorker = yield* server;
    const webWorker = yield* web(serverWorker);

    if (process.env.PULL_REQUEST) {
      yield* GitHub.Comment("preview-comment", {
        body: Output.interpolate`
            ## Preview Deployed

            **Web URL:** ${webWorker.url}
            **Server URL:** ${serverWorker.url}

            Built from commit ${process.env.GITHUB_SHA?.slice(0, 7)}

            ---
            _This comment updates automatically with each push._
          `,
        issueNumber: Number(process.env.PULL_REQUEST),
        owner: "raphdcst",
        repository: "alba",
      });
    }

    return {
      server: serverWorker.url,
      web: webWorker.url,
    };
  })
);
