import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  BarChart3,
  CalendarClock,
  Download,
  Eye,
  FileText,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  formatDate,
  formatDateTime,
  money,
  telHref,
  waHref,
  type Lead,
  type LeadPayment,
} from "@/lib/crm";
import { LeadFormDialog } from "@/components/admin/LeadFormDialog";
import { LeadDetail } from "@/components/admin/LeadDetail";
import { StatusBadge, inputCls, labelCls } from "@/components/admin/ui";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Lead Management Portal | Spring North" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Private lead management portal for Spring North Hospital." },
    ],
  }),
  component: AdminPortal,
});

type Tab = "dashboard" | "leads" | "followups" | "proofs" | "analytics" | "settings";

function AdminPortal() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const verify = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setIsAdmin(false);
      setEmail(null);
      setChecking(false);
      return;
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(Boolean(roles));
    setEmail(data.user.email ?? null);
    setChecking(false);
  }, []);

  useEffect(() => {
    void verify();
  }, [verify]);

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (!isAdmin) return <LoginScreen onSignedIn={verify} signedInEmail={email} />;
  return <Portal email={email} onSignOut={verify} />;
}

function LoginScreen({ onSignedIn, signedInEmail }: { onSignedIn: () => void; signedInEmail: string | null }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(signedInEmail ? "This account does not have portal access." : null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(null); setBusy(true);
    const fd = new FormData(e.currentTarget);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email") ?? "").trim(), password: String(fd.get("password") ?? ""),
    });
    setBusy(false);
    if (err) { setError("Incorrect email or password."); return; }
    onSignedIn();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-sm">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Spring North Hospital</p>
        <h1 className="mt-2 text-2xl font-semibold">Lead Management Portal</h1>
        <p className="mt-1 text-sm text-muted-foreground">Owner access only. Please sign in to continue.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div><label className={labelCls} htmlFor="login-email">Email</label><input id="login-email" name="email" type="email" required autoComplete="email" className={inputCls} /></div>
          <div><label className={labelCls} htmlFor="login-password">Password</label><input id="login-password" name="password" type="password" required autoComplete="current-password" className={inputCls} /></div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={busy} className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Signing in…" : "Log in"}</button>
        </form>
        {signedInEmail && <button type="button" onClick={async () => { await supabase.auth.signOut(); onSignedIn(); }} className="mt-4 w-full text-center text-xs font-semibold text-muted-foreground underline">Sign out of {signedInEmail}</button>}
      </div>
    </div>
  );
}

const NAV: { key: Tab; label: string; icon: typeof Users }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "leads", label: "Leads", icon: Users },
  { key: "followups", label: "Follow-Ups", icon: CalendarClock },
  { key: "proofs", label: "Payment Proofs", icon: FileText },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
];

function Portal({ email, onSignOut }: { email: string | null; onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [payments, setPayments] = useState<LeadPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Lead | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [query, setQuery] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fSource, setFSource] = useState("");
  const [fCity, setFCity] = useState("");
  const [fCampaign, setFCampaign] = useState("");
  const [sort, setSort] = useState("newest");

  const load = useCallback(async () => {
    setLoading(true);
    const [l, p] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("lead_payments").select("*"),
    ]);
    setLeads(l.data ?? []);
    setPayments(p.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { if (!detail) return; const fresh = leads.find((l) => l.id === detail.id); if (fresh && fresh !== detail) setDetail(fresh); }, [leads, detail]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = leads.filter((l) => {
      if (q && !`${l.full_name} ${l.phone ?? ""} ${l.email ?? ""} ${l.whatsapp ?? ""}`.toLowerCase().includes(q)) return false;
      if (fStatus && l.status !== fStatus) return false;
      if (fSource && l.source !== fSource) return false;
      if (fCity && (l.city ?? "") !== fCity) return false;
      if (fCampaign && (l.campaign ?? "") !== fCampaign) return false;
      return true;
    });
    const t = (v: string | null) => (v ? new Date(v).getTime() : 0);
    out.sort((a, b) => sort === "oldest" ? t(a.created_at) - t(b.created_at) : sort === "updated" ? t(b.updated_at) - t(a.updated_at) : sort === "followup" ? (t(a.follow_up_date) || Infinity) - (t(b.follow_up_date) || Infinity) : t(b.created_at) - t(a.created_at));
    return out;
  }, [leads, query, fStatus, fSource, fCity, fCampaign, sort]);

  const cities = useMemo(() => [...new Set(leads.map((l) => l.city).filter(Boolean))] as string[], [leads]);
  const campaigns = useMemo(() => [...new Set(leads.map((l) => l.campaign).filter(Boolean))] as string[], [leads]);
  const count = (s: string) => leads.filter((l) => l.status === s).length;
  const verifiedPayments = payments.filter((p) => p.status === "Verified");
  const revenue = verifiedPayments.reduce((s, p) => s + Number(p.amount), 0);
  const pendingRevenue = payments.filter((p) => p.status === "Pending Verification").reduce((s, p) => s + Number(p.amount), 0);
  const now = new Date();
  const paymentsThisMonth = verifiedPayments.filter((p) => { const d = new Date(p.payment_date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const payingCustomers = new Set(verifiedPayments.map((p) => p.lead_id)).size;
  const weekAgo = Date.now() - 7 * 864e5;
  const monthAgo = Date.now() - 30 * 864e5;
  const leadsThisWeek = leads.filter((l) => new Date(l.created_at).getTime() >= weekAgo).length;
  const leadsThisMonth = leads.filter((l) => new Date(l.created_at).getTime() >= monthAgo).length;
  const conversionRate = leads.length ? (count("Converted") / leads.length) * 100 : 0;
  const sourceBreakdown = useMemo(() => { const map = new Map<string, number>(); leads.forEach((l) => map.set(l.source, (map.get(l.source) ?? 0) + 1)); return [...map.entries()].sort((a, b) => b[1] - a[1]); }, [leads]);
  const today = new Date().toISOString().slice(0, 10);
  const followUps = leads.filter((l) => l.follow_up_date).sort((a, b) => (a.follow_up_date ?? "").localeCompare(b.follow_up_date ?? ""));

  const removeLead = async (lead: Lead) => { if (!confirm("Are you sure you want to permanently delete this lead?")) return; await supabase.from("leads").delete().eq("id", lead.id); setDetail(null); await load(); };
  const signOut = async () => { await supabase.auth.signOut(); onSignOut(); };

  return (
    <div className="min-h-screen bg-muted/30 lg:flex">
      <aside className="border-b border-border bg-card lg:min-h-screen lg:w-60 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="px-5 py-4"><p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Spring North</p><p className="text-sm font-semibold">Lead Portal</p></div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {NAV.map(({ key, label, icon: Icon }) => <button key={key} type="button" onClick={() => setTab(key)} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${tab === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}><Icon className="size-4" strokeWidth={1.8} /> {label}</button>)}
          <button type="button" onClick={signOut} className="inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10"><LogOut className="size-4" strokeWidth={1.8} /> Logout</button>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold">Lead Management</h1><p className="text-sm text-muted-foreground">{email}</p></div><button type="button" onClick={() => { setEditing(null); setFormOpen(true); }} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Plus className="size-4" strokeWidth={2} /> Add Lead</button></header>
        {loading && <p className="mt-6 text-sm text-muted-foreground">Loading leads…</p>}

        {!loading && (tab === "dashboard" || tab === "leads") && <>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-6">{[{ label: "Total Leads", value: leads.length },{ label: "New", value: count("New") },{ label: "Contacted", value: count("Contacted") },{ label: "Qualified", value: count("Qualified") },{ label: "Converted", value: count("Converted") },{ label: "Lost", value: count("Lost") }].map((c) => <div key={c.label} className="rounded-2xl border border-border bg-card px-4 py-3"><p className="text-xs text-muted-foreground">{c.label}</p><p className="mt-1 text-2xl font-semibold">{c.value}</p></div>)}</div>
          {tab === "dashboard" && <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{[{ label: "Total Revenue", value: money(revenue) },{ label: "Verified Payments", value: String(verifiedPayments.length) },{ label: "Pending Payments", value: money(pendingRevenue) },{ label: "Payments This Month", value: String(paymentsThisMonth.length) },{ label: "Paying Customers", value: String(payingCustomers) }].map((c) => <div key={c.label} className="rounded-2xl border border-border bg-card px-4 py-3"><p className="text-xs text-muted-foreground">{c.label}</p><p className="mt-1 text-lg font-semibold">{c.value}</p></div>)}</div>}
          <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2 xl:grid-cols-6">
            <div className="relative sm:col-span-2"><Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.8} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, phone or email" aria-label="Search leads" className={`${inputCls} pl-9`} /></div>
            <select aria-label="Filter by status" value={fStatus} onChange={(e) => setFStatus(e.target.value)} className={inputCls}><option value="">All statuses</option>{LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
            <select aria-label="Filter by source" value={fSource} onChange={(e) => setFSource(e.target.value)} className={inputCls}><option value="">All sources</option>{LEAD_SOURCES.map((s) => <option key={s}>{s}</option>)}</select>
            <select aria-label="Filter by city" value={fCity} onChange={(e) => setFCity(e.target.value)} className={inputCls}><option value="">All cities</option>{cities.map((c) => <option key={c}>{c}</option>)}</select>
            <select aria-label="Filter by campaign" value={fCampaign} onChange={(e) => setFCampaign(e.target.value)} className={inputCls}><option value="">All campaigns</option>{campaigns.map((c) => <option key={c}>{c}</option>)}</select>
            <select aria-label="Sort leads" value={sort} onChange={(e) => setSort(e.target.value)} className={inputCls}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="followup">Follow-up date</option><option value="updated">Recently updated</option></select>
          </div>
          <LeadTable leads={filtered} onOpen={setDetail} onDelete={removeLead} />
        </>}

        {!loading && tab === "followups" && <section className="mt-6"><h2 className="text-lg font-semibold">Follow-ups</h2><p className="text-sm text-muted-foreground">{followUps.filter((l) => (l.follow_up_date ?? "") <= today).length} due today or overdue</p><LeadTable leads={followUps} onOpen={setDetail} onDelete={removeLead} /></section>}
        {!loading && tab === "proofs" && <PaymentProofs />}
        {!loading && tab === "analytics" && <section className="mt-6 space-y-6"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[{ label: "Leads this week", value: String(leadsThisWeek) },{ label: "Leads this month", value: String(leadsThisMonth) },{ label: "Conversion rate", value: `${conversionRate.toFixed(1)}%` },{ label: "Revenue (verified)", value: money(revenue) }].map((c) => <div key={c.label} className="rounded-2xl border border-border bg-card px-4 py-3"><p className="text-xs text-muted-foreground">{c.label}</p><p className="mt-1 text-xl font-semibold">{c.value}</p></div>)}</div><div className="grid gap-6 lg:grid-cols-2"><Bars title="Leads by source" rows={sourceBreakdown} total={leads.length} /><Bars title="Leads by status" rows={LEAD_STATUSES.map((s) => [s, count(s)] as [string, number]).filter((r) => r[1] > 0)} total={leads.length} /></div></section>}
        {!loading && tab === "settings" && <section className="mt-6 max-w-xl rounded-2xl border border-border bg-card p-5"><h2 className="text-lg font-semibold">Settings</h2><dl className="mt-4 space-y-2 text-sm"><div className="flex gap-3"><dt className="w-40 text-muted-foreground">Signed in as</dt><dd className="font-medium">{email}</dd></div><div className="flex gap-3"><dt className="w-40 text-muted-foreground">Role</dt><dd className="font-medium">Owner / Admin</dd></div><div className="flex gap-3"><dt className="w-40 text-muted-foreground">Total leads</dt><dd className="font-medium">{leads.length}</dd></div></dl><button type="button" onClick={signOut} className="mt-5 rounded-xl border border-border px-4 py-2 text-sm font-semibold">Log out</button></section>}
      </main>

      {formOpen && <LeadFormDialog open={formOpen} lead={editing} onClose={() => setFormOpen(false)} onSaved={load} />}
      {detail && <LeadDetail lead={detail} onClose={() => setDetail(null)} onChanged={load} onEdit={(l) => { setEditing(l); setFormOpen(true); }} />}
    </div>
  );
}

function Bars({ title, rows, total }: { title: string; rows: [string, number][]; total: number }) {
  return <div className="rounded-2xl border border-border bg-card p-5"><h3 className="text-sm font-semibold">{title}</h3><div className="mt-4 space-y-3">{rows.length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}{rows.map(([label, value]) => <div key={label}><div className="flex justify-between text-xs"><span className="font-medium">{label}</span><span className="text-muted-foreground">{value}</span></div><div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${total ? Math.max(4, (value / total) * 100) : 0}%` }} /></div></div>)}</div></div>;
}

function PaymentProofs() {
  const [files, setFiles] = useState<{ name: string; id: string; created_at?: string; updated_at?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    setLoading(true); setError(null);
    const { data, error: listError } = await supabase.storage.from("payment-proofs").list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    if (listError) setError(listError.message);
    setFiles((data ?? []).filter((f) => f.name && !f.id?.endsWith("/")));
    setLoading(false);
  }, []);

  useEffect(() => { void loadFiles(); }, [loadFiles]);

  const openFile = async (name: string, download = false) => {
    const { data, error: urlError } = await supabase.storage.from("payment-proofs").createSignedUrl(name, 300, download ? { download: true } : undefined);
    if (urlError) { setError(urlError.message); return; }
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
  };

  return <section className="mt-6 space-y-4">
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">Payment Proofs</h2><p className="text-sm text-muted-foreground">Simple folder for uploaded payment screenshots.</p></div><button type="button" onClick={() => void loadFiles()} className="rounded-xl border border-border px-3 py-2 text-sm font-semibold">Refresh</button></div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      {loading ? <p className="mt-6 text-sm text-muted-foreground">Loading payment proofs…</p> : files.length === 0 ? <p className="mt-6 text-sm text-muted-foreground">No payment screenshots uploaded yet.</p> : <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{files.map((file) => <div key={file.id} className="rounded-xl border border-border p-4"><div className="flex items-start gap-3"><FileText className="mt-0.5 size-5 shrink-0 text-primary"/><div className="min-w-0"><p className="truncate text-sm font-semibold">{file.name}</p><p className="mt-1 text-xs text-muted-foreground">{file.created_at ? formatDateTime(file.created_at) : "Uploaded payment proof"}</p></div></div><div className="mt-3 flex gap-2"><button type="button" onClick={() => void openFile(file.name)} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold"><Eye className="size-3.5"/> View</button><button type="button" onClick={() => void openFile(file.name, true)} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold"><Download className="size-3.5"/> Download</button></div></div>)}</div>}
    </div>
  </section>;
}

function LeadTable({ leads, onOpen, onDelete }: { leads: Lead[]; onOpen: (lead: Lead) => void; onDelete: (lead: Lead) => void }) {
  if (leads.length === 0) return <p className="mt-6 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">No leads match these filters.</p>;
  return <>
    <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-border bg-card lg:block"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase"><tr>{["Name", "Phone", "Email", "Source", "Date added", "Status", "Assigned to", "Actions"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead><tbody>{leads.map((l) => <tr key={l.id} className="border-b border-border last:border-0 hover:bg-muted/30"><td className="px-4 py-3 font-semibold"><button type="button" onClick={() => onOpen(l)} className="underline-offset-2 hover:underline">{l.full_name}</button></td><td className="px-4 py-3">{l.phone ? <a href={telHref(l.phone)} className="hover:underline">{l.phone}</a> : "—"}</td><td className="px-4 py-3">{l.email ?? "—"}</td><td className="px-4 py-3">{l.source}</td><td className="px-4 py-3 whitespace-nowrap">{formatDate(l.created_at)}</td><td className="px-4 py-3"><StatusBadge status={l.status} /></td><td className="px-4 py-3">{l.assigned_to ?? "—"}</td><td className="px-4 py-3"><div className="flex items-center gap-2"><button type="button" onClick={() => onOpen(l)} className="rounded-lg border border-border px-2 py-1 text-xs font-semibold">View</button>{(l.whatsapp || l.phone) && <a href={waHref(l.whatsapp || l.phone)} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-2 py-1 text-xs font-semibold text-emerald-700">WhatsApp</a>}<button type="button" onClick={() => onDelete(l)} aria-label={`Delete ${l.full_name}`} className="rounded-lg border border-border p-1.5 text-destructive"><Trash2 className="size-3.5" strokeWidth={1.8}/></button></div></td></tr>)}</tbody></table></div>
    <div className="mt-6 grid gap-3 lg:hidden">{leads.map((l) => <div key={l.id} className="rounded-2xl border border-border bg-card p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><button type="button" onClick={() => onOpen(l)} className="truncate text-base font-semibold underline-offset-2 hover:underline">{l.full_name}</button><p className="text-xs text-muted-foreground">{l.source} · {formatDateTime(l.created_at)}</p></div><StatusBadge status={l.status}/></div><p className="mt-2 text-sm">{l.phone ?? "—"}{l.city ? ` · ${l.city}` : ""}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => onOpen(l)} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold">View</button>{l.phone && <a href={telHref(l.phone)} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold">Call</a>}{(l.whatsapp || l.phone) && <a href={waHref(l.whatsapp || l.phone)} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-emerald-700">WhatsApp</a>}<button type="button" onClick={() => onDelete(l)} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-destructive">Delete</button></div></div>)}</div>
  </>;
}
