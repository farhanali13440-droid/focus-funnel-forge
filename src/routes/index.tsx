import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Award,
  BadgeCheck,
  Brain,
  Briefcase,
  CalendarCheck,
  ClipboardList,
  Clock,
  FileText,
  Globe2,
  GraduationCap,
  Heart,
  Laptop,
  ListChecks,
  MessageCircle,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Timer,
  Users,
  UserRound,
  Video,
} from "lucide-react";
import doctorImg from "@/assets/dr-faheem.jpg";
import clinicImg from "@/assets/clinic-room.jpg";
import {
  CtaButton,
  Eyebrow,
  ExitIntentPopup,
  IconBubble,
  Reveal,
  Section,
  SectionHeading,
  StickyCta,
  WaveDivider,
  WhatsAppFloat,
  WHATSAPP_URL,
} from "@/components/funnel/primitives";

const TITLE = "ADHD Clarity Session – PKR 999 | Dr. Mohammad Faheem Khan";
const DESCRIPTION =
  "Can't focus? Overthinking constantly? Book a 60-minute ADHD Clarity Session with Consultant Psychiatrist Dr. Mohammad Faheem Khan for PKR 999, online or in-clinic.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          name: "Dr. Mohammad Faheem Khan – ADHD Clarity Session",
          medicalSpecialty: "Psychiatric",
          description: DESCRIPTION,
          priceRange: "PKR 999",
          availableService: {
            "@type": "MedicalTherapy",
            name: "ADHD Clarity Session",
          },
        }),
      },
    ],
  }),
  component: SalesPage,
});

const trustBadges = [
  { icon: Clock, label: "20+ Years Experience" },
  { icon: Stethoscope, label: "Consultant Psychiatrist" },
  { icon: Award, label: "Royal College Fellow" },
  { icon: Globe2, label: "International Experience" },
  { icon: ShieldCheck, label: "Evidence-Based Care" },
  { icon: Video, label: "Online & In-Clinic" },
];

const audience = [
  { icon: Brain, title: "Can't concentrate", body: "You read the same line five times and still miss it." },
  { icon: Timer, title: "Keep procrastinating", body: "You know what to do. Starting feels impossible." },
  { icon: ListChecks, title: "Forget everything", body: "Names, keys, appointments, why you walked in." },
  { icon: Sparkles, title: "Always overwhelmed", body: "Small tasks feel heavy before you even begin." },
  { icon: ClipboardList, title: "Never finish tasks", body: "Ten things started, nothing completed." },
  { icon: CalendarCheck, title: "Can't organise life", body: "Systems work for a week, then collapse." },
  { icon: Briefcase, title: "Struggling at work", body: "Underperforming despite working twice as hard." },
  { icon: GraduationCap, title: "Struggling at university", body: "Deadlines, notes, exams — always last minute." },
  { icon: Heart, title: "Parents worried about a child", body: "Restless, distracted, drifting at school." },
  { icon: UserRound, title: "Women who were missed", body: "Quietly coping since childhood, never assessed." },
  { icon: Laptop, title: "Entrepreneurs", body: "Big ideas, scattered execution, constant burnout." },
  { icon: Users, title: "Professionals & students", body: "High potential that never quite lands." },
];

const symptoms = [
  "I can't focus",
  "My brain never stops",
  "I constantly procrastinate",
  "I forget everything",
  "I'm always late",
  "I lose things",
  "I start but never finish",
  "I overthink everything",
  "I get mentally exhausted",
  "My emotions feel too intense",
];

const myths = [
  { myth: "ADHD is laziness.", reality: "ADHD is a neurodevelopmental condition affecting attention, memory and self-regulation." },
  { myth: "Only children have ADHD.", reality: "Many adults remain undiagnosed and have coped quietly for decades." },
  { myth: "Medication is the only treatment.", reality: "Treatment is individualised and can include therapy, coaching and lifestyle strategies." },
];

const included = [
  { title: "60-Minute Consultant Session", body: "One full hour with Dr. Faheem — not a rushed 10-minute slot." },
  { title: "Detailed Psychiatric Assessment", body: "Your history, patterns and current difficulties explored carefully." },
  { title: "ADHD Screening", body: "Structured, evidence-based screening tools used in international practice." },
  { title: "Functional Assessment", body: "How attention affects your work, study, relationships and daily life." },
  { title: "Initial Management Plan", body: "Practical, personalised first steps you can act on immediately." },
  { title: "Written Summary", body: "A clear written record of what was discussed and recommended." },
  { title: "Referral Advice", body: "Guidance if psychology, coaching or further input would help." },
  { title: "Clear Next Steps", body: "You leave knowing exactly what to do next — and what is optional." },
];

const credentials = [
  "MBBS",
  "MRCPsych",
  "FRCPsych",
  "CCT",
  "DMH",
  "DPM",
  "DCP",
  "PG Dip Psychiatry",
];

const steps = [
  { title: "Book Your Session", body: "Reserve your slot in under two minutes for PKR 999." },
  { title: "Meet Online or Visit Clinic", body: "Secure video call or a calm in-person consultation." },
  { title: "Receive Detailed Assessment", body: "A full hour of structured clinical assessment." },
  { title: "Know Your Next Steps", body: "A written summary and a clear, practical plan." },
  { title: "Continue If Needed", body: "Move toward a comprehensive ADHD assessment only if appropriate." },
];

const testimonials = [
  { name: "Ayesha R.", source: "Google Review", text: "For the first time someone listened without rushing me. I finally understood why I've struggled since school." },
  { name: "Hamza K.", source: "Facebook Review", text: "Dr. Faheem explained everything in plain language. The written summary alone was worth far more than the fee." },
  { name: "Sana M.", source: "Google Review", text: "I booked for my son and left with a calm, clear plan instead of the panic I walked in with." },
  { name: "Bilal A.", source: "Video Testimonial (placeholder)", text: "I thought I was just lazy for 15 years. This session changed how I see myself." },
  { name: "Fatima Z.", source: "Google Review", text: "Professional, kind and genuinely thorough. The online session was as good as being in the room." },
];

const faqs = [
  { q: "Can adults have ADHD?", a: "Yes. ADHD often continues into adulthood, and many adults are identified for the first time later in life after years of coping quietly." },
  { q: "Will I receive medication?", a: "Not automatically. The session focuses on understanding your difficulties. Any treatment discussion is individualised and only takes place where clinically appropriate." },
  { q: "Is this a diagnosis?", a: "No. The Clarity Session is a screening and assessment consultation. It helps clarify whether a comprehensive ADHD diagnostic assessment is appropriate for you." },
  { q: "Can children attend?", a: "Yes. Parents are welcome to book on behalf of a child, and we recommend a parent attends the session." },
  { q: "Is it online?", a: "You can choose a secure online video consultation or an in-clinic appointment — whichever suits you." },
  { q: "How long is the session?", a: "A full 60 minutes with Dr. Mohammad Faheem Khan." },
  { q: "Will my PKR 999 be adjusted?", a: "Yes. If you proceed to a Comprehensive ADHD Assessment within 30 days, your PKR 999 fee is deducted from that assessment." },
];

function SalesPage() {
  const [checked, setChecked] = useState<number[]>([]);
  const toggle = (i: number) =>
    setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));

  return (
    <main className="pb-20 sm:pb-0">
      {/* Announcement */}
      <div className="bg-primary-deep px-4 py-2.5 text-center text-xs font-medium text-primary-foreground sm:text-sm">
        Introductory pricing — PKR 999 for the ADHD Clarity Session, deductible from your full
        assessment within 30 days.
      </div>

      {/* Hero */}
      <header className="organic-glow relative overflow-hidden px-5 pt-12 pb-4 sm:pt-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-up">
            <Eyebrow>
              <Stethoscope strokeWidth={1.7} className="size-3.5" /> Consultant Psychiatrist
            </Eyebrow>
            <h1 className="mt-5 text-4xl leading-[1.08] font-semibold sm:text-5xl lg:text-6xl">
              Can&apos;t Focus? Constantly Overthinking?{" "}
              <span className="text-primary">You Might Not Be Lazy.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Book a 60-Minute ADHD Clarity Session with Consultant Psychiatrist Dr. Mohammad
              Faheem Khan and finally understand what&apos;s really happening.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CtaButton to="/checkout">Book My ADHD Clarity Session</CtaButton>
              <CtaButton href={WHATSAPP_URL} variant="outline">
                <MessageCircle strokeWidth={1.7} className="size-5" /> Ask a question
              </CtaButton>
            </div>

            <div className="mt-8 inline-flex flex-wrap items-center gap-x-6 gap-y-2 rounded-3xl border border-border bg-primary-soft px-6 py-5">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-primary-deep uppercase">
                  Introductory Price
                </p>
                <p className="mt-1 text-3xl font-semibold">PKR 999</p>
              </div>
              <p className="max-w-[15rem] text-sm leading-snug text-muted-foreground">
                Deductible from your Full ADHD Assessment within 30 days.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2.5rem] border border-border shadow-[var(--shadow-lift)]">
              <img
                src={doctorImg}
                width={1024}
                height={1280}
                alt="Dr. Mohammad Faheem Khan, Consultant Psychiatrist"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-4 rounded-2xl border border-border bg-card px-5 py-3 shadow-[var(--shadow-soft)] sm:left-auto sm:-right-4">
              <p className="text-sm font-semibold">Dr. Mohammad Faheem Khan</p>
              <p className="text-xs text-muted-foreground">MBBS, MRCPsych, FRCPsych</p>
            </div>
            <div className="absolute -top-4 -left-3 hidden rounded-2xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-primary-deep shadow-[var(--shadow-soft)] sm:block">
              <BadgeCheck strokeWidth={1.8} className="mr-1.5 inline size-4" /> 20+ Years Experience
            </div>
          </div>
        </div>
      </header>

      <WaveDivider soft />

      {/* Trust */}
      <Section soft className="py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
          {trustBadges.map((b, i) => (
            <Reveal key={b.label} delay={i * 60}>
              <div className="card-premium flex h-full flex-col items-center gap-3 px-4 py-6 text-center">
                <IconBubble icon={b.icon} />
                <p className="text-sm font-semibold leading-snug">{b.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <WaveDivider flip soft />

      {/* Who this is for */}
      <Section id="who">
        <SectionHeading
          eyebrow="Who this is for"
          title="If any of this sounds like your everyday life, you're in the right place"
          subtitle="You're not disorganised by choice. There may be a clinical explanation worth understanding."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audience.map((a, i) => (
            <Reveal key={a.title} delay={(i % 3) * 80}>
              <div className="card-premium flex h-full gap-4 p-6">
                <IconBubble icon={a.icon} />
                <div className="min-w-0">
                  <h3 className="text-base font-semibold">{a.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <WaveDivider soft />

      {/* Symptoms checklist */}
      <Section soft id="checklist">
        <SectionHeading
          eyebrow="Quick self-check"
          title="Tick everything that sounds like you"
          subtitle="This is a reflection tool, not a diagnostic test."
        />
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-3 sm:grid-cols-2">
            {symptoms.map((s, i) => {
              const active = checked.includes(i);
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(i)}
                  className={`hover-lift flex items-center gap-3 rounded-2xl border bg-card px-5 py-4 text-left text-sm font-medium transition-colors duration-300 ${
                    active ? "border-primary bg-primary-soft text-primary-deep" : "border-border"
                  }`}
                >
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-md border transition-colors ${
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    {active ? <BadgeCheck strokeWidth={2} className="size-3.5" /> : null}
                  </span>
                  {s}
                </button>
              );
            })}
          </div>

          <div className="mt-8 rounded-3xl border border-border bg-card p-7 text-center shadow-[var(--shadow-soft)]">
            <p className="text-base leading-relaxed sm:text-lg">
              {checked.length >= 3
                ? `You ticked ${checked.length}. If several of these sound familiar, an ADHD assessment may help you understand why.`
                : "If several of these sound familiar, an ADHD assessment may help you understand why."}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              This checklist does not provide a diagnosis.
            </p>
            <div className="mt-6">
              <CtaButton to="/checkout">Book My ADHD Clarity Session</CtaButton>
            </div>
          </div>
        </div>
      </Section>

      <WaveDivider flip soft />

      {/* Myths */}
      <Section>
        <SectionHeading eyebrow="Myths & reality" title="What ADHD actually is — and isn't" />
        <div className="grid gap-5 lg:grid-cols-3">
          {myths.map((m, i) => (
            <Reveal key={m.myth} delay={i * 90}>
              <div className="card-premium h-full p-7">
                <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Myth
                </p>
                <p className="mt-2 text-lg font-semibold text-muted-foreground line-through decoration-border">
                  {m.myth}
                </p>
                <div className="my-5 h-px bg-border" />
                <p className="text-xs font-semibold tracking-[0.14em] text-primary-deep uppercase">
                  Reality
                </p>
                <p className="mt-2 leading-relaxed">{m.reality}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <WaveDivider soft />

      {/* What you get */}
      <Section soft id="included">
        <SectionHeading
          eyebrow="What you get"
          title="Everything included in your 60-minute session"
          subtitle="One flat introductory fee of PKR 999. No hidden charges."
        />
        <div className="mx-auto max-w-3xl">
          <ol className="relative border-l border-border pl-8">
            {included.map((item, i) => (
              <Reveal key={item.title} delay={i * 50}>
                <li className="relative pb-8 last:pb-0">
                  <span className="absolute -left-[2.6rem] grid size-7 place-items-center rounded-full border border-border bg-card text-xs font-semibold text-primary-deep">
                    {i + 1}
                  </span>
                  <h3 className="text-base font-semibold sm:text-lg">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <WaveDivider flip soft />

      {/* Authority */}
      <Section id="doctor">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-[2.5rem] border border-border shadow-[var(--shadow-soft)]">
            <img
              src={clinicImg}
              width={1280}
              height={960}
              loading="lazy"
              alt="Calm consultation room at the clinic"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <Eyebrow>Why Dr. Faheem</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Two decades of consultant psychiatry — international standards, delivered with warmth.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Dr. Mohammad Faheem Khan is a Consultant Psychiatrist with over 20 years of clinical
              experience across international and local practice. He is CEO &amp; Founder of Aspire
              Clinic Ireland and Spring North Hospital, and works to evidence-based standards with a
              calm, compassionate approach.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {credentials.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-border bg-primary-soft px-4 py-1.5 text-sm font-semibold text-primary-deep"
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { n: "20+", l: "Years of experience" },
                { n: "2", l: "Clinics founded & led" },
                { n: "1,000s", l: "Patients supported" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-2xl font-semibold text-primary">{s.n}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <WaveDivider soft />

      {/* How it works */}
      <Section soft id="how">
        <SectionHeading eyebrow="How it works" title="Five simple steps from confusion to clarity" />
        <div className="grid gap-4 lg:grid-cols-5">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 70}>
              <div className="card-premium h-full p-6">
                <span className="grid size-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <WaveDivider flip soft />

      {/* Bonus */}
      <Section>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/25 bg-primary-soft px-7 py-12 text-center sm:px-14">
          <Eyebrow>Limited time</Eyebrow>
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold sm:text-4xl">
            Your PKR 999 is credited back toward your full assessment
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
            If you decide to proceed within 30 days, the entire PKR 999 fee is adjusted against your
            Comprehensive ADHD Assessment. Clarity now, no wasted spend later.
          </p>
          <div className="mt-8">
            <CtaButton to="/checkout">Book My ADHD Clarity Session</CtaButton>
          </div>
        </div>
      </Section>

      <WaveDivider soft />

      {/* Testimonials */}
      <Section soft id="reviews">
        <SectionHeading
          eyebrow="Patient experiences"
          title="What patients say after their session"
          subtitle="Collected from Google and Facebook reviews. Video testimonials coming soon."
        />
        <Carousel opts={{ align: "start", loop: true }} className="mx-auto max-w-5xl">
          <CarouselContent>
            {testimonials.map((t) => (
              <CarouselItem key={t.name} className="sm:basis-1/2 lg:basis-1/3">
                <div className="card-premium flex h-full flex-col p-7">
                  <Quote strokeWidth={1.6} className="size-6 text-primary" />
                  <p className="mt-4 flex-1 text-sm leading-relaxed">{t.text}</p>
                  <div className="mt-5 flex items-center gap-1 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} strokeWidth={1.6} className="size-4" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.source}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </Section>

      <WaveDivider flip soft />

      {/* FAQ */}
      <Section id="faq">
        <SectionHeading eyebrow="FAQ" title="Questions people ask before booking" />
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="rounded-2xl border border-border bg-card px-6 shadow-[var(--shadow-soft)] last:border-b"
              >
                <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-primary-deep px-5 py-20 text-center text-primary-foreground sm:py-28">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-4xl leading-tight font-semibold sm:text-5xl">
            Stop Wondering.
            <br />
            Start Understanding.
          </h2>
          <p className="mt-5 text-base opacity-90 sm:text-lg">
            Book your ADHD Clarity Session today — 60 minutes with a Consultant Psychiatrist for
            PKR 999.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <CtaButton to="/checkout" className="w-full sm:w-auto">
              Book My ADHD Clarity Session
            </CtaButton>
            <CtaButton
              href={WHATSAPP_URL}
              variant="outline"
              className="w-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
            >
              <MessageCircle strokeWidth={1.7} className="size-5" /> WhatsApp us
            </CtaButton>
          </div>
        </div>
      </section>

      <footer className="px-5 py-10 text-center text-xs leading-relaxed text-muted-foreground">
        <p className="mx-auto max-w-2xl">
          The ADHD Clarity Session is a screening and assessment consultation. It does not
          constitute a diagnosis, and no treatment outcome is guaranteed. Any further assessment or
          treatment is discussed individually.
        </p>
        <p className="mt-4">
          © {new Date().getFullYear()} Dr. Mohammad Faheem Khan ·{" "}
          <Link to="/checkout" className="text-primary-deep underline-offset-4 hover:underline">
            Book a session
          </Link>
        </p>
      </footer>

      <StickyCta label="Book ADHD Clarity Session – PKR 999" />
      <WhatsAppFloat />
      <ExitIntentPopup />
    </main>
  );
}
