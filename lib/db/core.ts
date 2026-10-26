import { migrations } from "./migrations";

export type Row = Record<string, unknown>;

export interface Queryable {
  query<T extends Row = Row>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>;
}

export interface Db extends Queryable {
  transaction<T>(fn: (tx: Queryable) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

export type CreateDbOptions = {
  /** PostgreSQL connection string. Defaults to process.env.DATABASE_URL. */
  url?: string;
  /** Use an in-memory embedded database (tests). */
  memory?: boolean;
  /** Apply pending migrations on connect. Defaults to true for the embedded DB. */
  migrate?: boolean;
};

export async function createDb(opts: CreateDbOptions = {}): Promise<Db> {
  const url = opts.memory ? undefined : (opts.url ?? process.env.DATABASE_URL);

  let db: Db;
  if (url) {
    db = await createPgDb(url);
  } else {
    if (
      !opts.memory &&
      process.env.NODE_ENV === "production" &&
      process.env.ALLOW_EMBEDDED_DB !== "true"
    ) {
      throw new Error(
        "DATABASE_URL is not set. Configure a PostgreSQL database before running in production.",
      );
    }
    db = await createEmbeddedDb(opts.memory ? undefined : ".data/pglite");
  }

  const shouldMigrate = opts.migrate ?? (!url || process.env.AUTO_MIGRATE === "true");
  if (shouldMigrate) await runMigrations(db);
  return db;
}

async function createPgDb(url: string): Promise<Db> {
  const { Pool } = await import("pg");
  const needsSsl = !/localhost|127\.0\.0\.1/.test(url) && !/sslmode=disable/.test(url);
  const pool = new Pool({
    connectionString: url,
    max: Number(process.env.DATABASE_POOL_MAX || 5),
    ssl: needsSsl ? { rejectUnauthorized: process.env.DATABASE_SSL_STRICT === "true" } : undefined,
  });
  return {
    query: async (sql, params) => {
      const r = await pool.query(sql, params as unknown[]);
      return { rows: r.rows };
    },
    transaction: async (fn) => {
      const client = await pool.connect();
      try {
        await client.query("begin");
        const result = await fn({
          query: async (sql, params) => ({ rows: (await client.query(sql, params as unknown[])).rows }),
        });
        await client.query("commit");
        return result;
      } catch (err) {
        await client.query("rollback");
        throw err;
      } finally {
        client.release();
      }
    },
    close: () => pool.end(),
  };
}

async function createEmbeddedDb(dataDir?: string): Promise<Db> {
  const { PGlite } = await import("@electric-sql/pglite");
  if (dataDir) {
    const fs = await import("node:fs");
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const pg = dataDir ? new PGlite(dataDir) : new PGlite();
  await pg.waitReady;
  const wrap = (q: { query: typeof pg.query }): Queryable => ({
    query: async <T extends Row>(sql: string, params?: unknown[]) => {
      const r = await q.query<T>(sql, params as unknown[]);
      return { rows: r.rows };
    },
  });
  return {
    ...wrap(pg),
    transaction: (fn) => pg.transaction((tx) => fn(wrap(tx))),
    close: () => pg.close(),
  };
}

export async function runMigrations(db: Db): Promise<string[]> {
  await db.query(
    "create table if not exists schema_migrations (id text primary key, applied_at timestamptz not null default now())",
  );
  const { rows } = await db.query<{ id: string }>("select id from schema_migrations");
  const done = new Set(rows.map((r) => r.id));
  const applied: string[] = [];
  for (const m of migrations) {
    if (done.has(m.id)) continue;
    await db.transaction(async (tx) => {
      // Run each statement separately (prepared statements allow only one).
      for (const stmt of splitSql(m.sql)) await tx.query(stmt);
      await tx.query("insert into schema_migrations (id) values ($1)", [m.id]);
    });
    applied.push(m.id);
  }
  return applied;
}

function splitSql(sql: string): string[] {
  return sql
    .split(/;\s*(?:\n|$)/)
    .map((s) => s.trim())
    .filter(Boolean);
}
