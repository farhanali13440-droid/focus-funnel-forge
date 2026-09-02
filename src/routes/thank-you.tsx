import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Brain,
  CalendarPlus,
  CheckCircle2,
  ClipboardList,
  Compass,
  MapPin,
  MessageCircle,
  Pill,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import doctorAsset from "@/assets/dr-faheem-khan.png.asset.json";
const doctorImg = doctorAsset.url;
import {
  CtaButton,
  Eyebrow,
  IconBubble,
  Section,
  SectionHeading,
  WHATSAPP_URL,
} from "@/components/funnel/primitives";
import { trackPurchase } from "@/lib/meta-pixel";

/** Fixed offer price — must match the price shown at checkout. */
const SESSION_PRICE = 999;

const TITLE = "You're Booked – ADHD Clarity Session | Dr. Faheem Khan";
const DESCRIPTION =
  "Your ADHD Clarity Session with Dr. Mohammad Faheem Khan is confirmed. Here are your session details, next steps and support options.";

/**
 * Gate: /thank-you is ONLY reachable after a successful checkout submission.
 * The checkout stores `adhd-booking` + `adhd-transaction-id` in sessionStorage
 * only after the mandatory screenshot upload succeeds and the form submits
 * successfully. Anyone hitting /thank-you directly, via a link, or after a
 * failed submission has neither marker and is redirected to /checkout.
 * (Runs client-side only; SSR has no sessionStorage and renders nothing
 * sensitive — the client guard immediately redirects on hydration nav.)
 */
function requireSuccessfulSubmission() {
  if (typeof window === "undefined") return;
  let hasSubmission = false;
  try {
    hasSubmission = Boolean(
      sessionStorage.getItem("adhd-booking") && sessionStorage.getItem("adhd-transaction-id"),
    );
  } catch {
    hasSubmission = false;
  }
  if (!hasSubmission) throw redirect({ to: "/checkout" });
}

export const Route = createFileRoute("/thank-you")({
  beforeLoad: requireSuccessfulSubmission,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/thank-you" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/thank-you" }],
  }),
  component: ThankYouPage,
});

type Booking = Record<string, string>;

const nextSteps = [
  { title: "Save our WhatsApp number", body: "So your confirmation and reminders don't get missed." },
  { title: "Complete the intake form", body: "We'll send a short form — it makes your hour far more useful." },
  { title: "Join your session on time", body: "Find a quiet, private space with a stable connection." },
  { title: "Receive your written summary", body: "Sent after the session with your initial plan." },
  { title: "Discuss what's next", body: "Whether a comprehensive ADHD assessment is appropriate for you." },
];

const upsells = [
  { icon: Brain, title: "Comprehensive ADHD Diagnostic Assessment", body: "The full diagnostic pathway — your PKR 999 is credited within 30 days." },
  { icon: Pill, title: "Medication Management", body: "Careful, monitored treatment where clinically appropriate." },
  { icon: ClipboardList, title: "CBT", body: "Structured therapy for focus, anxiety and self-esteem." },
  { icon: Compass, title: "ADHD Coaching", body: "Practical systems for work, study and daily routines." },
  { icon: Users, title: "ASD Assessment", body: "If autism traits are also part of the picture." },
];

function ThankYouPage() {
  const navigate = useNavigate();
  // null = verifying, false = no successful submission (redirecting away)
  const [booking, setBooking] = useState<Booking | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    let parsed: Booking | null = null;
    let transactionId: string | null = null;
    try {
      const raw = sessionStorage.getItem("adhd-booking");
      if (raw) parsed = JSON.parse(raw) as Booking;
      transactionId = sessionStorage.getItem("adhd-transaction-id");
    } catch {
      /* ignore */
    }

    // Gate: this page is ONLY for successful submissions. Direct visits,
    // typed URLs, or arrivals after a failed submission have no markers —
    // send them back to the checkout form. No Purchase is ever fired here.
    if (!parsed || !transactionId) {
      void navigate({ to: "/checkout", replace: true });
      return;
    }

    setBooking(parsed);
    setVerified(true);

    // Fire Purchase exactly once per successful submission. trackPurchase
    // dedupes on the transaction ID (localStorage) so refreshes don't re-fire.
    trackPurchase({
      value: SESSION_PRICE,
      currency: "PKR",
      transactionId,
    });
  }, [navigate]);

  // Render nothing until the successful-submission markers are verified —
  // the confirmation UI must never be visible without a real submission.
  if (!verified) return null;

  const summary = [
    { label: "Name", value: booking?.["fullName"] || "—" },
    { label: "Session", value: "ADHD Clarity Session (60 min)" },
    { label: "Mode", value: booking?.["mode"] || "To be confirmed" },
    { label: "Date", value: booking?.["date"] || "To be confirmed" },
    { label: "Time", value: booking?.["time"] || "To be confirmed" },
    { label: "Paid", value: "PKR 999" },
  ];

  const downloadIcs = () => {
    const date = (booking?.["date"] || "").replace(/-/g, "");
    const time = (booking?.["time"] || "10:00").replace(":", "") + "00";
    const start = date ? `${date}T${time}` : "";
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "SUMMARY:ADHD Clarity Session with Dr. Mohammad Faheem Khan",
      start ? `DTSTART:${start}` : "",
      "DESCRIPTION:60-minute ADHD Clarity Session. Please join 5 minutes early.",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "adhd-clarity-session.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="pb-16">
      <section className="organic-glow px-5 pt-16 pb-10 text-center">
        <div className="mx-auto max-w-2xl animate-fade-up">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary-soft text-primary ring-1 ring-border">
            <CheckCircle2 strokeWidth={1.6} className="size-8" />
          </span>
          <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">Payment Submitted Successfully</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Thank you. Your payment proof has been received successfully. Our team will review your
            submission and contact you on WhatsApp with the next steps.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <CtaButton href={WHATSAPP_URL} variant="primary">
              <MessageCircle strokeWidth={1.7} className="size-5" /> Message us on WhatsApp
            </CtaButton>
            <button
              onClick={downloadIcs}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary bg-background px-7 py-4 text-base font-semibold text-primary-deep transition-all hover:-translate-y-0.5 hover:bg-primary-soft"
            >
              <CalendarPlus strokeWidth={1.7} className="size-5" /> Add to calendar
            </button>
          </div>
        </div>
      </section>

      <Section className="pt-4">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
            <Eyebrow>Booking summary</Eyebrow>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {summary.map((s) => (
                <div key={s.label} className="rounded-2xl bg-primary-soft px-5 py-4">
                  <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                    {s.label}
                  </dt>
                  <dd className="mt-1 font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Video strokeWidth={1.7} className="size-4 text-primary" /> Online sessions
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A secure video link is sent 30 minutes before your appointment. Join from a quiet,
                  private space with headphones if possible.
                </p>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin strokeWidth={1.7} className="size-4 text-primary" /> Visiting the clinic
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Please arrive 10 minutes early. Directions and parking details are included in
                  your WhatsApp confirmation.
                </p>
              </div>
            </div>
          </div>

          <aside className="h-max rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
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
                <p className="text-xs text-muted-foreground">Consultant Psychiatrist</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              MBBS, MRCPsych, FRCPsych, CCT · 20+ years of consultant psychiatry across
              international and local practice.
            </p>
            <div className="mt-5 rounded-2xl bg-primary-soft p-5 text-sm leading-relaxed">
              <Sparkles strokeWidth={1.7} className="size-4 text-primary" />
              <p className="mt-2">
                Your PKR 999 is credited toward a Comprehensive ADHD Assessment booked within 30
                days of your session.
              </p>
            </div>
          </aside>
        </div>
      </Section>

      <Section soft className="rounded-[2.5rem]">
        <SectionHeading eyebrow="Next steps" title="Five things to do before your session" />
        <div className="mx-auto max-w-3xl">
          <ol className="relative border-l border-border pl-8">
            {nextSteps.map((s, i) => (
              <li key={s.title} className="relative pb-8 last:pb-0">
                <span className="absolute -left-[2.6rem] grid size-7 place-items-center rounded-full border border-border bg-card text-xs font-semibold text-primary-deep">
                  {i + 1}
                </span>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Optional next steps"
          title="After your session, you may be eligible for"
          subtitle="Entirely optional. Nothing is decided until you and Dr. Faheem discuss it together."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upsells.map((u) => (
            <div key={u.title} className="card-premium flex h-full gap-4 p-6">
              <IconBubble icon={u.icon} />
              <div className="min-w-0">
                <h3 className="text-base font-semibold">{u.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{u.body}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Questions in the meantime?{" "}
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-semibold text-primary-deep underline-offset-4 hover:underline">
            Message us on WhatsApp
          </a>{" "}
          or{" "}
          <Link to="/" className="font-semibold text-primary-deep underline-offset-4 hover:underline">
            revisit the session details
          </Link>
          .
        </p>
      </Section>
    </main>
  );
}
