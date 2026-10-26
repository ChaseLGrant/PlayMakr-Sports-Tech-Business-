"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { authenticate, createSession, destroySession, requestIp, requireAdmin, setSessionCookie } from "@/lib/server/auth";
import { addNote, addTask, setFoundingPartner, toggleTask, updateLeadStatus } from "@/lib/server/leads";
import { leadStatuses, valuesOf } from "@/lib/options";

export type LoginState = { error?: string; email?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").slice(0, 200);
  const password = String(formData.get("password") ?? "").slice(0, 500);
  if (!email || !password) return { error: "Enter your email and password.", email };

  const db = await getDb();
  const result = await authenticate(db, email, password, await requestIp());
  if (!result.ok) return { error: result.error, email };

  const { token, expires } = await createSession(db, result.user.id);
  await setSessionCookie(token, expires);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

const uuid = z.string().uuid();

export async function updateStatusAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = uuid.parse(formData.get("leadId"));
  const status = z.enum(valuesOf(leadStatuses)).parse(formData.get("status"));
  await updateLeadStatus(await getDb(), id, status, admin.email);
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin");
}

export async function addNoteAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = uuid.parse(formData.get("leadId"));
  await addNote(await getDb(), id, String(formData.get("body") ?? ""), admin.name);
  revalidatePath(`/admin/leads/${id}`);
}

export async function addTaskAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = uuid.parse(formData.get("leadId"));
  await addTask(await getDb(), id, String(formData.get("title") ?? ""), String(formData.get("due") ?? "") || null, admin.name);
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin");
}

export async function toggleTaskAction(formData: FormData) {
  await requireAdmin();
  const leadId = uuid.parse(formData.get("leadId"));
  const taskId = uuid.parse(formData.get("taskId"));
  await toggleTask(await getDb(), taskId, formData.get("done") === "true");
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin");
}

export type FoundingState = { error?: string };

export async function foundingAction(_prev: FoundingState, formData: FormData): Promise<FoundingState> {
  await requireAdmin();
  const id = uuid.parse(formData.get("leadId"));
  const enroll = formData.get("enroll") === "true";
  const r = await setFoundingPartner(await getDb(), id, enroll);
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin");
  revalidatePath("/");
  return r.ok ? {} : { error: r.error };
}
