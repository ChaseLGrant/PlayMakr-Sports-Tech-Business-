import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "../db";
import { hashToken } from "./password";
import { clientIp } from "./security";
import { userForToken, type AdminUser } from "./auth-core";

export { authenticate, createSession, type AdminUser } from "./auth-core";

export const SESSION_COOKIE = "pm_admin";

/** Data Access Layer check — call at the top of every admin page and action. */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return userForToken(await getDb(), token);
});

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function setSessionCookie(token: string, expires: Date) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await (await getDb()).query("delete from admin_sessions where token_hash = $1", [hashToken(token)]);
  }
  jar.delete(SESSION_COOKIE);
}

export async function requestIp() {
  return clientIp(await headers());
}
