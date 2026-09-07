import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Download,
  Eye,
  FileText,
  MessageCircle,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  ACTIVITY_TYPES,
  LEAD_STATUSES,
  PAYMENT_ACCEPTED_TYPES,
  PAYMENT_MAX_BYTES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  formatDate,
  formatDateTime,
  money,
  sanitizeFileName,
  telHref,
  waHref,
  type Lead,
  type LeadActivity,
  type LeadPayment,
} from "@/lib/crm";
import { Modal, StatusBadge, inputCls, labelCls } from "./ui";

type Props = {
  lead: Lead;
  onClose: () => void;
  onChanged: () => void;
  onEdit: (lead: Lead) => void;
};

export function LeadDetail({ lead, onClose, onChanged, onEdit }: Props) {
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [payments, setPayments] = useState<LeadPayment[]>([]);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [followUp, setFollowUp] = useState(lead.follow_up_date ?? "");
  const [status, setStatus] = useState(lead.status);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editing, setEditing] = useState<LeadPayment | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const [a, p] = await Promise.all([
      supabase.from("lead_activities").select("*").eq("lead_id", lead.id).order("created_at", { ascending: false }),
      supabase.from("lead_payments").select("*").eq("lead_id", lead.id).order("payment_date", { ascending: false }),
    ]);
    setActivities(a.data ?? []);
    setPayments(p.data ?? []);
  }, [lead.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const verified = payments.filter((p) => p.status === "Verified");
  const pending = payments.filter((p) => p.status === "Pending Verification");
  const totalPaid = verified.reduce((s, p) => s + Number(p.amount), 0);
  const totalPending = pending.reduce((s, p) => s + Number(p.amount), 0);
  const paymentState =
    payments.some((p) => p.status === "Refunded") && verified.length === 0
      ? "Refunded"
      : totalPaid > 0 && totalPending > 0
        ? "Partially Paid"
        : totalPaid > 0
          ? "Paid"
          : "Pending";

  const saveInfo = async () => {
    setSavingInfo(true);
    const statusChanged = status !== lead.status;
    await supabase
      .from("leads")
      .update({ notes: notes || null, follow_up_date: followUp || null, status })
      .eq("id", lead.id);
    if (statusChanged) {
      await supabase.from("lead_activities").insert({
        lead_id: lead.id,
        activity_type: "Status Change",
        description: `Status changed from ${lead.status} to ${status}`,
      });
    }
    setSavingInfo(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
    await load();
    onChanged();
  };

  const addActivity = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const description = ((fd.get("description") as string) || "").trim();
    if (!description) return;
    await supabase.from("lead_activities").insert({
      lead_id: lead.id,
      activity_type: (fd.get("activity_type") as string) || "Note",
      description: description.slice(0, 2000),
    });
    form.reset();
    await load();
  };

  const savePayment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPaymentError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file") as File | null;
    const existing = editing;

    let filePath: string | null = existing?.file_path ?? null;
    let fileName: string | null = existing?.file_name ?? null;
    let fileType: string | null = existing?.file_type ?? null;
    let fileSize: number | null = existing?.file_size ?? null;
    let replacedPath: string | null = null;

    setUploading(true);
    try {
      if (file && file.size > 0) {
        if (!PAYMENT_ACCEPTED_TYPES.includes(file.type)) {
          throw new Error("Only JPG, PNG, WEBP or PDF files are allowed.");
        }
        if (file.size > PAYMENT_MAX_BYTES) {
          throw new Error("File is too large — maximum size is 10 MB.");
        }
        const safe = sanitizeFileName(file.name);
        const newPath = `${lead.id}/${crypto.randomUUID()}-${safe}`;
        const { error: upErr } = await supabase.storage
          .from("payment-proofs")
          .upload(newPath, file, { contentType: file.type });
        if (upErr) throw new Error("Upload failed. Please try again.");
        replacedPath = existing?.file_path ?? null;
        filePath = newPath;
        fileName = safe;
        fileType = file.type;
        fileSize = file.size;
      }

      const amount = Number(fd.get("amount") || 0);
      const row = {
        lead_id: lead.id,
        amount: Number.isFinite(amount) ? amount : 0,
        payment_date: (fd.get("payment_date") as string) || new Date().toISOString().slice(0, 10),
        payment_method: (fd.get("payment_method") as string) || "Bank Transfer",
        transaction_id: ((fd.get("transaction_id") as string) || "").trim() || null,
        status: (fd.get("status") as string) || "Pending Verification",
        notes: ((fd.get("notes") as string) || "").trim() || null,
        file_path: filePath,
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
      };

      if (existing) {
        const { error: updErr } = await supabase.from("lead_payments").update(row).eq("id", existing.id);
        if (updErr) throw new Error("Could not update this payment.");
      } else {
        const { error: insErr } = await supabase.from("lead_payments").insert(row);
        if (insErr) throw new Error("Could not save this payment.");
      }

      // Remove the replaced file only after the new one is stored and linked.
      if (replacedPath) await supabase.storage.from("payment-proofs").remove([replacedPath]);

      await supabase.from("lead_activities").insert({
        lead_id: lead.id,
        activity_type: "Note",
        description: `${existing ? "Payment updated" : "Payment recorded"}: ${money(amount)} via ${row.payment_method} (${row.status})`,
      });

      form.reset();
      setEditing(null);
      setShowPaymentForm(false);
      await load();
      onChanged();
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  const openFile = async (payment: LeadPayment, download = false) => {
    if (!payment.file_path) return;
    const { data } = await supabase.storage
      .from("payment-proofs")
      .createSignedUrl(payment.file_path, 300, download ? { download: payment.file_name ?? true } : undefined);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
  };

  const deletePayment = async (payment: LeadPayment) => {
    if (!confirm("Delete this payment record permanently?")) return;
    if (payment.file_path) await supabase.storage.from("payment-proofs").remove([payment.file_path]);
    await supabase.from("lead_payments").delete().eq("id", payment.id);
    await load();
    onChanged();
  };

  return (
    <Modal open onClose={onClose} title={lead.full_name} wide>
      {/* Payment summary */}
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Total paid", value: money(totalPaid) },
          { label: "Pending", value: money(totalPending) },
          { label: "Verified payments", value: String(verified.length) },
          { label: "Payment status", value: paymentState },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-muted/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className="mt-1 text-base font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {lead.phone && (
          <a href={telHref(lead.phone)} className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold">
            <Phone className="size-4" strokeWidth={1.8} /> Call
          </a>
        )}
        {(lead.whatsapp || lead.phone) && (
          <a href={waHref(lead.whatsapp || lead.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-emerald-700">
            <MessageCircle className="size-4" strokeWidth={1.8} /> WhatsApp
          </a>
        )}
        <button type="button" onClick={() => onEdit(lead)} className="rounded-xl border border-border px-3 py-2 text-sm font-semibold">
          Edit lead
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Contact + lead info */}
        <section className="rounded-2xl border border-border p-4">
          <h3 className="text-sm font-semibold">Contact information</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Name" value={lead.full_name} />
            <Row label="Phone" value={lead.phone} />
            <Row label="WhatsApp" value={lead.whatsapp} />
            <Row label="Email" value={lead.email} />
            <Row label="City" value={lead.city} />
          </dl>
          <h3 className="mt-5 text-sm font-semibold">Lead information</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Source" value={lead.source} />
            <Row label="Campaign" value={lead.campaign} />
            <Row label="Service" value={lead.service} />
            <Row label="Assigned to" value={lead.assigned_to} />
            <Row label="Created" value={formatDateTime(lead.created_at)} />
            <Row label="Updated" value={formatDateTime(lead.updated_at)} />
            <Row label="UTM source" value={lead.utm_source} />
            <Row label="UTM medium" value={lead.utm_medium} />
            <Row label="UTM campaign" value={lead.utm_campaign} />
            <Row label="Landing page" value={lead.landing_page} />
            <Row label="Referrer" value={lead.referrer} />
          </dl>
        </section>

        {/* Status / follow-up / notes */}
        <section className="rounded-2xl border border-border p-4">
          <h3 className="text-sm font-semibold">Status &amp; follow-up</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="detail-status">Current status</label>
              <select id="detail-status" value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
                {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="detail-follow">Follow-up date</label>
              <input id="detail-follow" type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} className={inputCls} />
            </div>
          </div>
          <label className={`${labelCls} mt-3`} htmlFor="detail-notes">Notes</label>
          <textarea id="detail-notes" rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls} />
          <div className="mt-3 flex items-center gap-3">
            <button type="button" onClick={saveInfo} disabled={savingInfo} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              {savingInfo ? "Saving…" : "Save"}
            </button>
            {savedFlash && <span className="text-sm font-medium text-emerald-600">Saved</span>}
          </div>
        </section>
      </div>

      {/* Payments */}
      <section className="mt-6 rounded-2xl border border-border p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">Payment history</h3>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setPaymentError(null);
              setShowPaymentForm((v) => !v);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-cta px-3 py-2 text-sm font-semibold text-cta-foreground"
          >
            <Plus className="size-4" strokeWidth={2} /> Add payment
          </button>
        </div>

        {showPaymentForm && (
          <form key={editing?.id ?? "new"} onSubmit={savePayment} className="mt-4 grid gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
            <p className="sm:col-span-2 text-sm font-semibold">{editing ? "Edit payment" : "New payment"}</p>
            <div>
              <label className={labelCls} htmlFor="pay-amount">Amount (PKR)</label>
              <input id="pay-amount" name="amount" type="number" min={0} step="1" required defaultValue={editing ? Number(editing.amount) : undefined} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pay-date">Payment date</label>
              <input id="pay-date" name="payment_date" type="date" defaultValue={editing?.payment_date ?? new Date().toISOString().slice(0, 10)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pay-method">Payment method</label>
              <select id="pay-method" name="payment_method" defaultValue={editing?.payment_method ?? "Bank Transfer"} className={inputCls}>
                {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="pay-status">Payment status</label>
              <select id="pay-status" name="status" defaultValue={editing?.status ?? "Pending Verification"} className={inputCls}>
                {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="pay-txn">Transaction / reference ID</label>
              <input id="pay-txn" name="transaction_id" maxLength={120} defaultValue={editing?.transaction_id ?? ""} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pay-file">
                {editing?.file_path ? "Replace screenshot / proof" : "Payment screenshot / proof"}
              </label>
              <input id="pay-file" name="file" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className={inputCls} />
              {editing?.file_name && (
                <p className="mt-1 text-xs text-muted-foreground">Current: {editing.file_name} — leave empty to keep it.</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="pay-notes">Notes</label>
              <textarea id="pay-notes" name="notes" rows={2} maxLength={1000} defaultValue={editing?.notes ?? ""} className={inputCls} />
            </div>
            {paymentError && <p className="sm:col-span-2 text-sm text-destructive">{paymentError}</p>}
            <div className="sm:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => { setShowPaymentForm(false); setEditing(null); }} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">Cancel</button>
              <button type="submit" disabled={uploading} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                {uploading ? "Saving…" : editing ? "Update payment" : "Save payment"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {payments.length === 0 && <p className="text-sm text-muted-foreground">No payments recorded yet.</p>}
          {payments.map((p) => (
            <div key={p.id} className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold">{money(Number(p.amount))}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(p.payment_date)} · {p.payment_method}
                  </p>
                  {p.transaction_id && <p className="mt-1 text-xs text-muted-foreground break-all">Ref: {p.transaction_id}</p>}
                </div>
                <StatusBadge status={p.status} />
              </div>
              {p.notes && <p className="mt-2 text-sm text-muted-foreground">{p.notes}</p>}
              {p.file_path && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 truncate rounded-lg bg-muted px-2 py-1 text-xs">
                    <FileText className="size-3.5" strokeWidth={1.8} /> {p.file_name}
                  </span>
                  <button type="button" onClick={() => openFile(p)} className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-semibold">
                    <Eye className="size-3.5" strokeWidth={1.8} /> View
                  </button>
                  <button type="button" onClick={() => openFile(p, true)} className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-semibold">
                    <Download className="size-3.5" strokeWidth={1.8} /> Download
                  </button>
                </div>
              )}
              <div className="mt-3 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => { setEditing(p); setPaymentError(null); setShowPaymentForm(true); }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
                >
                  <Pencil className="size-3.5" strokeWidth={1.8} /> Edit
                </button>
                <button type="button" onClick={() => deletePayment(p)} className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
                  <Trash2 className="size-3.5" strokeWidth={1.8} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity */}
      <section className="mt-6 rounded-2xl border border-border p-4">
        <h3 className="text-sm font-semibold">Activity timeline</h3>
        <form onSubmit={addActivity} className="mt-3 grid gap-3 sm:grid-cols-[160px_1fr_auto]">
          <select name="activity_type" className={inputCls} defaultValue="Note">
            {ACTIVITY_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <input name="description" maxLength={2000} placeholder="Add an activity entry…" className={inputCls} />
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Add</button>
        </form>
        <ol className="mt-4 space-y-3 border-l border-border pl-4">
          {activities.length === 0 && <li className="text-sm text-muted-foreground">No activity yet.</li>}
          {activities.map((a) => (
            <li key={a.id} className="relative">
              <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full bg-primary" />
              <p className="text-sm font-medium">{a.description}</p>
              <p className="text-xs text-muted-foreground">
                {a.activity_type} · {formatDateTime(a.created_at)}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex gap-3">
      <dt className="w-32 shrink-0 text-xs text-muted-foreground">{label}</dt>
      <dd className="min-w-0 flex-1 break-words font-medium">{value || "—"}</dd>
    </div>
  );
}
