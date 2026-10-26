import type { Queryable } from "../db/core";
import { hashToken, newSessionToken, verifyPassword } from "./password";
import { hashIp, rateLimit } from "./security";

const SESSION_DAYS = 7;

export type AdminUser = { id: string; email: string; name: string };

// A precomputed hash so unknown emails take as long as wrong passwords.
const DUMMY_HASH =
  "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";

export async function authenticate(
  db: Queryable,
  email: string,
  password: string,
  ip: string,
): Promise<{ ok: true; user: AdminUser } | { ok: false; error: string }> {
  const normalized = email.trim().toLowerCase();
  const allowed = await rateLimit(db, `login:${hashIp(ip)}`, 8, 15 * 60);
  if (!allowed) return { ok: false, error: "Too many sign-in attempts. Try again in 15 minutes." };

  const { rows } = await db.query<AdminUser & { password_hash: string }>(
    "select id, email, name, password_hash from admin_users where email = $1",
    [normalized],
  );
  const user = rows[0];
  const valid = await verifyPassword(password, user?.password_hash ?? DUMMY_HASH);
  if (!user || !valid) return { ok: false, error: "Incorrect email or password." };
  return { ok: true, user: { id: user.id, email: user.email, name: user.name } };
}

export async function createSession(db: Queryable, adminId: string): Promise<{ token: string; expires: Date }> {
  const token = newSessionToken();
  const expires = new Date(Date.now() + SESSION_DAYS * 86400_000);
  await db.query("insert into admin_sessions (token_hash, admin_id, expires_at) values ($1, $2, $3)", [
    hashToken(token),
    adminId,
    expires.toISOString(),
  ]);
  await db.query("update admin_users set last_login_at = now() where id = $1", [adminId]);
  await db.query("delete from admin_sessions where expires_at < now()");
  return { token, expires };
}

export async function userForToken(db: Queryable, token: string | undefined): Promise<AdminUser | null> {
  if (!token) return null;
  const { rows } = await db.query<AdminUser>(
    `select u.id, u.email, u.name from admin_sessions s
     join admin_users u on u.id = s.admin_id
     where s.token_hash = $1 and s.expires_at > now()`,
    [hashToken(token)],
  );
  return rows[0] ?? null;
}
