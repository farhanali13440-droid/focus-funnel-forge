import type { Tables } from "@/integrations/supabase/types";

export type Lead = Tables<"leads">;
export type LeadActivity = Tables<"lead_activities">;
export type LeadPayment = Tables<"lead_payments">;

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Follow-Up",
  "Qualified",
  "Converted",
  "Lost",
] as const;

export const LEAD_SOURCES = [
  "Facebook",
  "Instagram",
  "WhatsApp",
  "Google",
  "Website",
  "Referral",
  "Organic",
  "Other",
] as const;

export const ACTIVITY_TYPES = [
  "Note",
  "Call",
  "WhatsApp",
  "Email",
  "Follow-Up",
  "Status Change",
] as const;

export const PAYMENT_METHODS = [
  "Bank Transfer",
  "JazzCash",
  "Easypaisa",
  "Cash",
  "Credit/Debit Card",
  "Other",
] as const;

export const PAYMENT_STATUSES = [
  "Pending Verification",
  "Verified",
  "Rejected",
  "Refunded",
] as const;

export const statusStyles: Record<string, string> = {
  New: "bg-sky-100 text-sky-800 border-sky-200",
  Contacted: "bg-amber-100 text-amber-800 border-amber-200",
  "Follow-Up": "bg-violet-100 text-violet-800 border-violet-200",
  Qualified: "bg-teal-100 text-teal-800 border-teal-200",
  Converted: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Lost: "bg-rose-100 text-rose-800 border-rose-200",
  Verified: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Pending Verification": "bg-amber-100 text-amber-800 border-amber-200",
  Rejected: "bg-rose-100 text-rose-800 border-rose-200",
  Refunded: "bg-slate-100 text-slate-700 border-slate-200",
};

export const PAYMENT_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];
export const PAYMENT_MAX_BYTES = 10 * 1024 * 1024;

export function sanitizeFileName(name: string): string {
  return name
    .replace(/[^\w.\- ]+/g, "_")
    .replace(/\s+/g, "-")
    .slice(-80);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return `${formatDate(value)} · ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

export function money(n: number): string {
  return `PKR ${Math.round(n).toLocaleString("en-PK")}`;
}

export function telHref(phone: string | null | undefined): string {
  return `tel:${(phone ?? "").replace(/[^\d+]/g, "")}`;
}

export function waHref(phone: string | null | undefined): string {
  let digits = (phone ?? "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `92${digits.slice(1)}`;
  return `https://wa.me/${digits}`;
}

/** Reads UTM / attribution data from the current browser URL. */
export function captureAttribution() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const get = (k: string) => p.get(k) || null;
  return {
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_content: get("utm_content"),
    utm_term: get("utm_term"),
    campaign: get("utm_campaign"),
    landing_page: window.location.pathname + window.location.search,
    referrer: document.referrer || null,
  };
}
