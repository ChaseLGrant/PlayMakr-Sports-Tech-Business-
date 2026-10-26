import "server-only";
import { createDb, type Db } from "./core";

/**
 * Server-only database access.
 *
 * - Production: set DATABASE_URL (Supabase, Neon, RDS, or any PostgreSQL).
 * - Local development: with no DATABASE_URL, an embedded PostgreSQL (PGlite)
 *   stores data in ./.data/pglite so the app works out of the box.
 */

const globalForDb = globalThis as unknown as { __playmakrDb?: Promise<Db> };

export function getDb(): Promise<Db> {
  if (!globalForDb.__playmakrDb) {
    globalForDb.__playmakrDb = createDb().catch((err) => {
      globalForDb.__playmakrDb = undefined;
      throw err;
    });
  }
  return globalForDb.__playmakrDb;
}

export type { Db } from "./core";
