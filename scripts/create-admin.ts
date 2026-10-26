/**
 * Creates (or resets the password of) an admin user.
 *   npm run admin:create -- --email you@company.com --name "Your Name"
 * You'll be prompted for a password, or set ADMIN_PASSWORD in the environment.
 * Stop `npm run dev` first when using the local embedded database.
 */
import { createInterface } from "node:readline/promises";
import { createDb } from "../lib/db/core";
import { hashPassword, passwordProblems } from "../lib/server/password";

function arg(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  const email = arg("email")?.trim().toLowerCase();
  const name = arg("name") ?? email?.split("@")[0];
  if (!email || !email.includes("@")) throw new Error('Usage: npm run admin:create -- --email you@company.com --name "Your Name"');

  let password = process.env.ADMIN_PASSWORD;
  if (!password) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    password = await rl.question("Password (min 12 characters): ");
    rl.close();
  }
  const problem = passwordProblems(password);
  if (problem) throw new Error(problem);

  const db = await createDb();
  await db.query(
    `insert into admin_users (email, name, password_hash) values ($1, $2, $3)
     on conflict (email) do update set password_hash = excluded.password_hash, name = excluded.name`,
    [email, name, await hashPassword(password)],
  );
  await db.query("delete from admin_sessions where admin_id = (select id from admin_users where email = $1)", [email]);
  console.log(`Admin ready: ${email}`);
  await db.close();
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
