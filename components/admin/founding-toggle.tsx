"use client";

import { useActionState } from "react";
import { Award, Loader2 } from "lucide-react";
import { foundingAction, type FoundingState } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export function FoundingToggle({ leadId, enrolled, count, cap }: { leadId: string; enrolled: boolean; count: number; cap: number }) {
  const [state, action, pending] = useActionState<FoundingState, FormData>(foundingAction, {});
  return (
    <form action={action}>
      <input type="hidden" name="leadId" value={leadId} />
      <input type="hidden" name="enroll" value={String(!enrolled)} />
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
            <Award size={15} className={enrolled ? "text-electric-600" : "text-slate-400"} aria-hidden />
            {enrolled ? "Founding partner" : "Not enrolled"}
          </p>
          <p className="text-xs text-slate-500">{count} of {cap} spots filled</p>
        </div>
        <button
          type="submit"
          disabled={pending || (!enrolled && count >= cap)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50",
            enrolled ? "border border-slate-300 text-slate-700 hover:bg-slate-50" : "bg-electric-600 text-white hover:bg-electric-500",
          )}
        >
          {pending && <Loader2 size={13} className="animate-spin" aria-hidden />}
          {enrolled ? "Remove" : "Enroll"}
        </button>
      </div>
      {state.error && <p role="alert" className="mt-2 text-xs text-rose-600">{state.error}</p>}
    </form>
  );
}
