import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  ImageUp,
  Lock,
  ShieldCheck,
  Timer,
  Video,
} from "lucide-react";
import doctorAsset from "@/assets/dr-faheem-khan.png.asset.json";
const doctorImg = doctorAsset.url;

import { CtaButton, Eyebrow, WHATSAPP_URL } from "@/components/funnel/primitives";
import { supabase } from "@/integrations/supabase/client";

/* Editable webinar details — keep in sync with the landing page. */
const WEBINAR_DATE = "Sunday 13 September 2026";
const WEBINAR_TIME = "5:30 PM – 6:30 PM PKT";
const WEBINAR_FEE = "PKR 999";

/**
 * Uploads the payment screenshot to permanent cloud storage. Resolves with the
 * stored file path only when the upload genuinely succeeds; rejects otherwise so
 * the caller keeps the user on the form (no redirect, no Purchase event).
 */
async function uploadReceipt(file: File, transactionId: string): Promise<string> {
  const buffer = await file.arrayBuffer();
  if (!buffer.byteLength) throw new Error("Screenshot upload failed — the file appears to be empty.");

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${transactionId}.${ext}`;
  const { error } = await supabase.storage
    .from("payment-receipts")
    .upload(path, file, { contentType: file.type });
  if (error) throw new Error("Screenshot upload failed. Please check your connection and try again.");
  return path;
}

const TITLE = "Register – Live ADHD Clarity Webinar | Dr. Faheem Khan";
const DESCRIPTION =
  "Reserve your seat for the live ADHD Clarity Webinar with Dr. Mohammad Faheem Khan. Complete your registration and upload your payment screenshot.";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/checkout" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/checkout" }],
  }),
  component: CheckoutPage,
});

const includes = [
  "Live expert-led ADHD webinar",
  "Understanding ADHD symptoms and patterns",
  "Live Q&A during the session",
  "Guidance on appropriate next steps",
  "Joining link sent before the webinar",
];

const field =
  "w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30";
const labelCls = "mb-1.5 block text-sm font-semibold";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_BYTES = 8 * 1024 * 1024;

function CheckoutPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSubmitError(null);
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setReceipt(null);
      setFileError("Payment screenshot is required.");
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setReceipt(null);
      setFileError("Please upload a JPG, JPEG, PNG or WEBP image.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setReceipt(null);
      setFileError("File is too large — maximum size is 8 MB.");
      return;
    }
    setFileError(null);
    setReceipt(file);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    // Screenshot is mandatory — block submission entirely without it.
    if (!receipt) {
      setFileError("Payment screenshot is required.");
      document.getElementById("receipt")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const data = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      // Unique transaction ID for this registration — also dedupes the Meta Pixel
      // Purchase event on the Thank You page.
      const transactionId = crypto.randomUUID();

      // Step 1 — upload the screenshot. Must succeed before anything else.
      const receiptPath = await uploadReceipt(receipt, transactionId);

      // Step 2 — save the registration permanently. Only a successful save redirects.
      const booking = {
        ...Object.fromEntries(data.entries()),
        receiptName: receipt.name,
      } as Record<string, string>;
      delete booking["receipt"];

      const { error: insertError } = await supabase.from("bookings").insert({
        transaction_id: transactionId,
        full_name: booking["fullName"] ?? "",
        age: booking["age"] ? Number(booking["age"]) : null,
        city: booking["city"] ?? null,
        phone: booking["phone"] ?? "",
        whatsapp: booking["whatsapp"] ?? null,
        email: booking["email"] ?? null,
        patient_type: booking["attendeeType"] ?? null,
        mode: "Live online webinar",
        preferred_date: null,
        preferred_time: null,
        concern: booking["concern"] || null,
        receipt_path: receiptPath,
      });
      if (insertError) throw new Error("Registration failed. Please try again.");

      sessionStorage.setItem("adhd-booking", JSON.stringify(booking));
      sessionStorage.setItem("adhd-transaction-id", transactionId);

      // Step 3 — success: go to the Thank You page (where Purchase fires).
      navigate({ to: "/thank-you" });
    } catch (err) {
      setSubmitting(false);
      setSubmitError(
        err instanceof Error ? err.message : "Registration failed. Please try again.",
      );
    }
  };

  return (
    <main className="min-h-screen surface-soft pb-16">
      <div className="mx-auto w-full max-w-6xl px-5 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft strokeWidth={1.7} className="size-4" /> Back to webinar details
        </Link>

        {/* Progress */}
        <div className="mt-6 flex items-center gap-3">
          {["Your details", "Registration", "Confirmed"].map((s, i) => (
            <div key={s} className="flex min-w-0 flex-1 items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className={`h-1.5 rounded-full ${i <= 1 ? "bg-primary" : "bg-border"}`} />
                <p
                  className={`mt-2 truncate text-xs font-semibold ${
                    i <= 1 ? "text-primary-deep" : "text-muted-foreground"
                  }`}
                >
                  {s}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Step 2 of 3
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8"
          >
            <h1 className="text-2xl font-semibold sm:text-3xl">
              Reserve your seat — ADHD Clarity Webinar
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ll send your joining link and reminders on WhatsApp.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="fullName">Full name</label>
                <input id="fullName" name="fullName" required maxLength={100} className={field} placeholder="Your full name" />
              </div>
              <div>
                <label className={labelCls} htmlFor="age">Age</label>
                <input id="age" name="age" type="number" min={3} max={100} required className={field} placeholder="e.g. 28" />
              </div>
              <div>
                <label className={labelCls} htmlFor="city">City</label>
                <input id="city" name="city" required maxLength={60} className={field} placeholder="e.g. Peshawar" />
              </div>
              <div>
                <label className={labelCls} htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" required maxLength={20} className={field} placeholder="03XX XXXXXXX" />
              </div>
              <div>
                <label className={labelCls} htmlFor="whatsapp">WhatsApp number</label>
                <input id="whatsapp" name="whatsapp" type="tel" required maxLength={20} className={field} placeholder="03XX XXXXXXX" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required maxLength={255} className={field} placeholder="you@email.com" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="attendeeType">I am attending as</label>
                <select id="attendeeType" name="attendeeType" required defaultValue="Adult" className={field}>
                  <option>Adult</option>
                  <option>Student</option>
                  <option>Parent</option>
                  <option>Professional</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="concern">
                  Question for the webinar <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="concern"
                  name="concern"
                  rows={4}
                  maxLength={1000}
                  className={field}
                  placeholder="Anything you'd like Dr. Faheem to cover during the live session?"
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="receipt">
                  Upload Payment Screenshot <span className="text-cta">*</span>
                </label>
                <label
                  htmlFor="receipt"
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed px-4 py-4 transition-colors ${
                    fileError ? "border-destructive bg-destructive/5" : "border-border bg-primary-soft/50 hover:border-primary"
                  }`}
                >
                  <ImageUp strokeWidth={1.7} className="size-5 shrink-0 text-primary" />
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {receipt ? receipt.name : "Choose your payment screenshot (JPG, PNG or WEBP)"}
                  </span>
                  {receipt && (
                    <CheckCircle2 strokeWidth={1.7} className="size-5 shrink-0 text-primary" />
                  )}
                </label>
                <input
                  id="receipt"
                  name="receipt"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  className="sr-only"
                  onChange={onFileChange}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Required — please attach proof of your {WEBINAR_FEE} webinar fee. Max 8 MB.
                </p>
                {fileError && (
                  <p role="alert" className="mt-2 text-sm font-medium text-destructive">
                    {fileError}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-border bg-primary-soft p-5">
              <div className="flex items-center justify-between text-sm">
                <span>ADHD Clarity Webinar (live online)</span>
                <span className="font-semibold">{WEBINAR_FEE}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>Registration fee</span>
                <span>PKR 0</span>
              </div>
              <div className="my-4 h-px bg-border" />
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total due today</span>
                <span>{WEBINAR_FEE}</span>
              </div>
            </div>

            {submitError && (
              <p role="alert" className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-2xl bg-cta px-7 py-4 text-base font-semibold text-cta-foreground shadow-[var(--shadow-cta)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 disabled:opacity-70"
            >
              {submitting ? "Uploading & confirming…" : "RESERVE MY SEAT"}
            </button>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Lock strokeWidth={1.7} className="size-4" /> Secure &amp; encrypted
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CreditCard strokeWidth={1.7} className="size-4" /> Card, bank &amp; wallet
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck strokeWidth={1.7} className="size-4" /> Your details stay confidential
              </span>
            </div>
          </form>

          {/* Summary */}
          <aside className="h-max rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] lg:sticky lg:top-6">
            <div className="flex items-center gap-4">
              <img
                src={doctorImg}
                width={1024}
                height={1280}
                loading="lazy"
                alt="Dr. Mohammad Faheem Khan"
                className="size-16 shrink-0 rounded-full object-cover object-top"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Dr. Mohammad Faheem Khan</p>
                <p className="text-xs text-muted-foreground">Consultant Psychiatrist · FRCPsych</p>
              </div>
            </div>

            <div className="mt-6">
              <Eyebrow>Your registration</Eyebrow>
              <h2 className="mt-3 text-xl font-semibold">Live ADHD Clarity Webinar</h2>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <CalendarDays strokeWidth={1.7} className="size-4 text-primary" /> {WEBINAR_DATE}
                </p>
                <p className="flex items-center gap-2">
                  <Timer strokeWidth={1.7} className="size-4 text-primary" /> {WEBINAR_TIME}
                </p>
                <p className="flex items-center gap-2">
                  <Video strokeWidth={1.7} className="size-4 text-primary" /> Live online
                </p>
              </div>
              <ul className="mt-5 space-y-2.5">
                {includes.map((i) => (
                  <li key={i} className="flex gap-2.5 text-sm">
                    <CheckCircle2 strokeWidth={1.7} className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl bg-primary-soft p-5 text-center">
                <p className="text-xs font-semibold tracking-[0.14em] text-primary-deep uppercase">
                  Webinar fee
                </p>
                <p className="mt-1 text-3xl font-semibold">{WEBINAR_FEE}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  This is a group educational webinar, not a private consultation, and does not
                  provide a diagnosis.
                </p>
              </div>
              <div className="mt-5">
                <CtaButton href={WHATSAPP_URL} variant="outline" className="w-full py-3 text-sm">
                  Need help? WhatsApp us
                </CtaButton>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
