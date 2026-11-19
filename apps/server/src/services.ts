import { createAuth as createConfiguredAuth } from "@alba/auth";
import type { Database } from "@alba/db";
import { createDb } from "@alba/db";

import { ENV } from "./env.server";

export const getDb = (): Database => createDb(ENV.HYPERDRIVE.connectionString);

export const createAuth = (database?: Database) =>
  createConfiguredAuth(ENV, database ?? getDb());
