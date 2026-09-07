import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LEAD_SOURCES, LEAD_STATUSES, type Lead } from "@/lib/crm";
import { Modal, inputCls, labelCls } from "./ui";

type Props = {
  open: boolean;
  lead: Lead | null;
  onClose: () => void;
  onSaved: () => void;
};

export function LeadFormDialog({ open, lead, onClose, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => {
      const raw = (fd.get(k) as string | null)?.trim();
      return raw ? raw : null;
    };
    const fullName = v("full_name");
    if (!fullName) {
      setError("Full name is required.");
      return;
    }
    const payload = {
      full_name: fullName.slice(0, 120),
      phone: v("phone"),
      whatsapp: v("whatsapp"),
      email: v("email"),
      city: v("city"),
      service: v("service"),
      source: v("source") ?? "Website",
      campaign: v("campaign"),
      status: v("status") ?? "New",
      assigned_to: v("assigned_to"),
      notes: v("notes"),
      follow_up_date: v("follow_up_date"),
    };

    setSaving(true);
    try {
      if (lead) {
        const { error: err } = await supabase.from("leads").update(payload).eq("id", lead.id);
        if (err) throw err;
        if (lead.status !== payload.status) {
          await supabase.from("lead_activities").insert({
            lead_id: lead.id,
            activity_type: "Status Change",
            description: `Status changed from ${lead.status} to ${payload.status}`,
          });
        }
      } else {
        const { error: err } = await supabase.from("leads").insert(payload);
        if (err) throw err;
      }
      onSaved();
      onClose();
    } catch {
      setError("Could not save this lead. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={lead ? "Edit lead" : "Add new lead"}>
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="full_name">Full name *</label>
          <input id="full_name" name="full_name" required maxLength={120} defaultValue={lead?.full_name ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="phone">Phone number</label>
          <input id="phone" name="phone" maxLength={25} defaultValue={lead?.phone ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="whatsapp">WhatsApp number</label>
          <input id="whatsapp" name="whatsapp" maxLength={25} defaultValue={lead?.whatsapp ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" maxLength={255} defaultValue={lead?.email ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="city">City</label>
          <input id="city" name="city" maxLength={80} defaultValue={lead?.city ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="service">Service / offer interested in</label>
          <input id="service" name="service" maxLength={120} defaultValue={lead?.service ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="source">Lead source</label>
          <select id="source" name="source" defaultValue={lead?.source ?? "Website"} className={inputCls}>
            {LEAD_SOURCES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="campaign">Campaign</label>
          <input id="campaign" name="campaign" maxLength={120} defaultValue={lead?.campaign ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="assigned_to">Assigned to</label>
          <input id="assigned_to" name="assigned_to" maxLength={80} defaultValue={lead?.assigned_to ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={lead?.status ?? "New"} className={inputCls}>
            {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="follow_up_date">Follow-up date</label>
          <input id="follow_up_date" name="follow_up_date" type="date" defaultValue={lead?.follow_up_date ?? ""} className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" rows={4} maxLength={4000} defaultValue={lead?.notes ?? ""} className={inputCls} />
        </div>

        {error && (
          <p role="alert" className="sm:col-span-2 rounded-xl border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="sm:col-span-2 flex flex-wrap justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {saving ? "Saving…" : lead ? "Save changes" : "Create lead"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
