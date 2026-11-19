import { drizzle } from "drizzle-orm/node-postgres";

import { relations } from "./relations";

export const createDb = (connectionString: string) =>
  drizzle({ connection: connectionString, relations });

export type Database = ReturnType<typeof createDb>;
