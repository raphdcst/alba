import type { Session } from "@alba/auth";
import type { Database } from "@alba/db";

export interface Context {
  session: Session | null;
  db: Database;
}
