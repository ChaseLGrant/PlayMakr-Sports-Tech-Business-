"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { buttonClass } from "@/components/ui/button";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required defaultValue={state.email}
          className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 outline-none focus:border-electric-500 focus:ring-4 focus:ring-electric-500/15" />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required
          className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 outline-none focus:border-electric-500 focus:ring-4 focus:ring-electric-500/15" />
      </div>
      {state.error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{state.error}</p>}
      <button type="submit" disabled={pending} className={buttonClass("dark", "md", "w-full")}>
        {pending && <Loader2 size={16} className="animate-spin" aria-hidden />} Sign in
      </button>
    </form>
  );
}
