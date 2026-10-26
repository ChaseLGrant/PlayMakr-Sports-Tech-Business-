/**
 * Applies pending database migrations.
 *   npm run db:migrate            -> uses DATABASE_URL (or the local embedded DB)
 *   npm run db:migrate -- --print -> prints the SQL instead (paste into Supabase SQL editor)
 */
import { createDb, runMigrations } from "../lib/db/core";
import { migrations } from "../lib/db/migrations";

async function main() {
  if (process.argv.includes("--print")) {
    for (const m of migrations) console.log(`-- ${m.id}\n${m.sql}`);
    return;
  }
  const db = await createDb({ migrate: false });
  const applied = await runMigrations(db);
  console.log(applied.length ? `Applied: ${applied.join(", ")}` : "Database is up to date.");
  await db.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
