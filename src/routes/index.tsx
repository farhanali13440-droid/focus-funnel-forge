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
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  Globe2,
  GraduationCap,
  Heart,
  Laptop,
  ListChecks,
  Mail,
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
import doctorAsset from "@/assets/dr-faheem-khan.png.asset.json";
import clinicImg from "@/assets/clinic-room.jpg";
import {
  Countdown,
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

const doctorImg = doctorAsset.url;

const heroReviews = [
  {
    name: "Ayesha R.",
    city: "Islamabad",
    text: "For the first time someone listened without rushing me. In one hour I understood why I've struggled since school — and what to actually do about it.",
  },
  {
    name: "Hamza K.",
    city: "Lahore",
    text: "Dr. Faheem explained everything in plain language. The written summary alone was worth far more than the fee I paid.",
  },
  {
    name: "Sana M.",
    city: "Peshawar",
    text: "I booked for my son and left with a calm, clear plan instead of the panic I walked in with. No pressure to do anything extra.",
  },
];

const trustLogos = [
  "Aspire Clinic Ireland",
  "Spring North Hospital",
  "Royal College of Psychiatrists",
  "NHS UK Practice",
  "General Medical Council",
  "PMDC Registered",
];

const included = [
  {
    title: "Full Psychiatric History",
    lead: "We start where every good assessment starts — your actual life, not a form.",
    points: [
      "Childhood patterns, school reports and family history",
      "How the difficulties changed through your teens and twenties",
      "What you've already tried and why it stopped working",
    ],
  },
  {
    title: "Structured ADHD Screening",
    lead: "Internationally used screening tools, applied properly and explained to you.",
    points: [
      "Validated adult and child ADHD screening instruments",
      "Attention, impulsivity and hyperactivity mapped separately",
      "Your scores explained in plain language, not jargon",
    ],
  },
  {
    title: "Functional Impact Review",
    lead: "ADHD is diagnosed by impact, not by how the symptoms sound on paper.",
    points: [
      "Work, study and financial consequences",
      "Relationships, parenting and emotional regulation",
      "Sleep, routine and daily-living breakdown points",
    ],
  },
  {
    title: "Differential Assessment",
    lead: "Attention problems have several possible explanations — we rule them in or out.",
    points: [
      "Anxiety, depression, trauma and sleep disorders considered",
      "Thyroid, anaemia and other medical contributors flagged",
      "Honest answer if ADHD is not the likely explanation",
    ],
  },
  {
    title: "Initial Management Plan",
    lead: "You leave with something practical you can start using the same week.",
    points: [
      "Personalised focus, routine and workload strategies",
      "What medication would and would not do in your case",
      "Therapy, coaching or workplace-support options",
    ],
  },
  {
    title: "Written Summary & Next Steps",
    lead: "Clarity you can keep, re-read, and share with family or an employer.",
    points: [
      "Written record of findings and recommendations",
      "Whether a Comprehensive ADHD Assessment is appropriate",
      "Clear guidance on what is optional versus important",
    ],
  },
];

const audience = [
  { icon: Brain, title: "Can't concentrate", body: "You read the same line five times and still miss it." },
  { icon: Timer, title: "Keep procrastinating", body: "You know what to do. Starting feels impossible." },
  { icon: ListChecks, title: "Forget everything", body: "Names, keys, appointments, why you walked in." },
  { icon: Sparkles, title: "Always overwhelmed", body: "Small tasks feel heavy before you even begin." },
  { icon: ClipboardList, title: "Never finish tasks", body: "Ten things started, nothing completed." },
  { icon: CalendarCheck, title: "Can't organise life", body: "Systems work for a week, then collapse." },
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

const bonuses = [
  {
    icon: FileText,
    title: "ADHD Focus & Routine Toolkit",
    body: "A printable set of attention, planning and task-initiation strategies used in clinical practice — start applying them the day after your session.",
    value: "Value: PKR 6,000",
  },
  {
    icon: ClipboardList,
    title: "Personal Symptom Tracker",
    body: "A simple 14-day tracker for focus, sleep, mood and task completion so your follow-up appointment starts with real data, not guesswork.",
    value: "Value: PKR 4,000",
  },
  {
    icon: GraduationCap,
    title: "School & Workplace Support Guide",
    body: "How to request accommodations in Pakistani schools, universities and workplaces — including what to say and what documentation helps.",
    value: "Value: PKR 5,000",
  },
  {
    icon: Users,
    title: "Family Explainer Pack",
    body: "A short guide you can hand to a parent, spouse or sibling that explains ADHD without blame, so the people around you finally understand.",
    value: "Value: PKR 3,000",
  },
];

const profiles = [
  { who: "Adults (25–45)", path: "Lifelong underperformance → screening → clarity on whether ADHD explains it" },
  { who: "University students", path: "Deadline crisis → focus assessment → study strategy + accommodation advice" },
  { who: "Parents of children", path: "School complaints → child-focused review → structured parent guidance" },
  { who: "Women missed in childhood", path: "Quiet coping → inattentive-presentation screening → validation and a plan" },
  { who: "Working professionals", path: "Burnout despite effort → functional review → workload and career strategy" },
  { who: "Entrepreneurs", path: "Scattered execution → attention and impulsivity mapping → operating system that fits you" },
];

const myths = [
  { myth: "ADHD is laziness.", reality: "ADHD is a neurodevelopmental condition affecting attention, working memory and self-regulation." },
  { myth: "Only children have ADHD.", reality: "Many adults remain undiagnosed and have coped quietly for decades before seeking help." },
  { myth: "Medication is the only treatment.", reality: "Treatment is individualised — therapy, coaching, routine design and lifestyle change all play a role." },
];

const credentials = ["MBBS", "MRCPsych", "FRCPsych", "CCT", "DMH", "DPM", "DCP", "PG Dip Psychiatry"];

const steps = [
  { title: "Step 1 — Book Your Slot", body: "Reserve your session for PKR 999. Takes under two minutes; we confirm on WhatsApp." },
  { title: "Step 2 — Attend Online or In-Clinic", body: "A full 60 private minutes with Dr. Faheem — secure video call or a calm in-person consultation." },
  { title: "Step 3 — Leave With a Written Plan", body: "Structured findings, an initial management plan and clear next steps you can act on immediately." },
];

const testimonials = [
  { name: "Ayesha R.", source: "Google Review", text: "For the first time someone listened without rushing me. I finally understood why I've struggled since school." },
  { name: "Hamza K.", source: "Facebook Review", text: "Dr. Faheem explained everything in plain language. The written summary alone was worth far more than the fee." },
  { name: "Sana M.", source: "Google Review", text: "I booked for my son and left with a calm, clear plan instead of the panic I walked in with." },
  { name: "Bilal A.", source: "Patient feedback", text: "I thought I was just lazy for 15 years. This session changed how I see myself." },
  { name: "Fatima Z.", source: "Google Review", text: "Professional, kind and genuinely thorough. The online session was as good as being in the room." },
];

const faqs = [
  { q: "Can adults have ADHD?", a: "Yes. ADHD often continues into adulthood, and many adults are identified for the first time later in life after years of coping quietly." },
  { q: "Will I be put on medication?", a: "Not automatically. The session focuses on understanding your difficulties. Any treatment discussion is individualised and only takes place where clinically appropriate." },
  { q: "Is this a formal diagnosis?", a: "No. The Clarity Session is a screening and assessment consultation. It clarifies whether a Comprehensive ADHD Assessment is appropriate for you." },
  { q: "Can I book for my child?", a: "Yes. Parents are welcome to book on behalf of a child, and we recommend a parent attends the session." },
  { q: "Is it online or in person?", a: "Your choice — a secure online video consultation or an in-clinic appointment, whichever suits you." },
  { q: "How long is the session?", a: "A full 60 minutes with Dr. Mohammad Faheem Khan. It is not a rushed 10-minute slot." },
  { q: "Is my PKR 999 wasted if I proceed further?", a: "No. If you proceed to a Comprehensive ADHD Assessment within 30 days, your PKR 999 is deducted from that assessment." },
  { q: "Is my information confidential?", a: "Yes. Everything discussed is kept as a confidential medical record and is never shared without your consent." },
];

function SalesPage() {
  const [checked, setChecked] = useState<number[]>([]);
  const toggle = (i: number) =>
    setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));

  return (
    <main className="pb-20 sm:pb-0">
      {/* Top bar */}
      <div className="border-b border-border bg-card px-5 py-3">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <span className="truncate text-sm font-semibold tracking-[0.16em] text-primary-deep uppercase">
            ADHD Clarity Session
          </span>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary-deep sm:text-sm"
          >
            <Mail strokeWidth={1.7} className="size-4" /> Need help?
          </a>
        </div>
      </div>

      {/* Hero */}
      <header className="organic-glow relative overflow-hidden px-5 pt-8 pb-4 sm:pt-14">
        <div className="mx-auto w-full max-w-4xl text-center">
          <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase sm:text-sm">
            Trusted by adults, students &amp; parents across Pakistan
          </p>
          <h1 className="mt-5 text-3xl leading-[1.1] font-semibold sm:text-5xl lg:text-[3.4rem]">
            Discover Why You Still Can&apos;t Focus, Finish or Switch Off —{" "}
            <span className="text-primary">In One 60-Minute Session</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Even if you&apos;ve been told you&apos;re just lazy, careless or &quot;not trying hard
            enough&quot; your whole life.
          </p>
          <p className="mt-3 text-sm font-semibold text-primary-deep sm:text-base">
            What school and family missed: attention, memory, emotional regulation &amp; a real
            clinical answer
          </p>

          <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-[2rem] border border-border shadow-[var(--shadow-lift)]">
            <img
              src={doctorImg}
              width={500}
              height={500}
              alt="Dr. Mohammad Faheem Khan, Consultant Psychiatrist"
              className="h-full w-full object-cover"
            />
          </div>

          <p className="mt-7 text-sm font-semibold sm:text-base">
            60-Minute ADHD Clarity Session with Consultant Psychiatrist Dr. Mohammad Faheem Khan —
            online or in-clinic
          </p>

          <div className="mt-6">
            <Countdown label="Introductory pricing ends in" />
            <p className="mt-3 text-xs text-muted-foreground">
              Limited weekly slots. Pricing returns to standard consultation fee when the timer ends.
            </p>
          </div>

          <div className="mt-8">
            <CtaButton to="/checkout" className="w-full flex-col gap-0.5 sm:w-auto">
              <span>YES! I Want Clarity About My Focus</span>
              <span className="text-sm font-medium opacity-90">Book now for just PKR 999</span>
            </CtaButton>
          </div>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 strokeWidth={1.8} className="size-4 text-primary" /> Full 60 minutes +
            written summary + free reschedule
          </p>
        </div>
      </header>

      <WaveDivider soft />

      {/* Early social proof */}
      <Section soft id="reviews-top" className="py-14 sm:py-20">
        <SectionHeading
          title="What Patients Say After Their Session"
          subtitle="Real feedback from adults, students and parents who came in confused and left with a plan."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {heroReviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 80}>
              <div className="card-premium flex h-full flex-col p-7">
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} strokeWidth={1.6} className="size-4" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-5 text-sm font-semibold">— {r.name}</p>
                <p className="text-xs text-muted-foreground">{r.city}, Pakistan</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <CtaButton to="/checkout">YES! I WANT MY SESSION →</CtaButton>
        </div>
      </Section>

      <WaveDivider flip soft />

      {/* Trust strip */}
      <Section className="py-12 sm:py-16">
        <p className="text-center text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Training, practice &amp; registration
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {trustLogos.map((t) => (
            <div
              key={t}
              className="grid h-full place-items-center rounded-2xl border border-border bg-primary-soft px-4 py-5 text-center text-xs font-semibold text-primary-deep"
            >
              {t}
            </div>
          ))}
        </div>
      </Section>

      <WaveDivider soft />

      {/* What is it */}
      <Section soft id="what">
        <div className="mx-auto max-w-3xl">
          <SectionHeading title="What Is the ADHD Clarity Session?" />
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              The ADHD Clarity Session is the fastest way to get a proper clinical answer about your
              attention — without waiting months for a referral, guessing from internet quizzes, or
              paying for a full diagnostic assessment you may not even need.
            </p>
            <p>
              Because let&apos;s be honest — you already suspect something is going on. You&apos;ve
              seen the reels. You&apos;ve taken the online tests. You&apos;ve read threads at 2am
              that described your entire life in three paragraphs.
            </p>
            <p className="font-semibold text-foreground">
              But the part nobody helps you with is what to actually do next.
            </p>
            <p>
              Is it ADHD, anxiety, burnout, sleep, or all of them layered together? Do you need
              medication, therapy, structure — or simply an explanation? Who is even qualified to
              tell you in Pakistan?
            </p>
            <p>
              This session removes the guesswork. In 60 structured minutes with a Consultant
              Psychiatrist you get a proper history, validated screening, a functional review, and a
              written plan you can act on the same week.
            </p>
          </div>
        </div>
      </Section>

      <WaveDivider flip soft />

      {/* What's inside — the "curriculum" */}
      <Section id="included">
        <SectionHeading
          eyebrow="Inside your session"
          title="What Happens in Your 60-Minute ADHD Clarity Session"
          subtitle="Six clinical components, delivered in one appointment for a single introductory fee of PKR 999."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {included.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 80}>
              <div className="card-premium flex h-full gap-5 p-7">
                <div className="hidden shrink-0 sm:block">
                  <img
                    src={doctorImg}
                    width={500}
                    height={500}
                    loading="lazy"
                    alt="Dr. Mohammad Faheem Khan"
                    className="size-16 rounded-2xl object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                    Part #{i + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.lead}</p>
                  <ul className="mt-4 space-y-2">
                    {item.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-sm leading-relaxed">
                        <CheckCircle2
                          strokeWidth={1.7}
                          className="mt-0.5 size-4 shrink-0 text-primary"
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <CtaButton to="/checkout" className="flex-col gap-0.5">
            <span>YES! Reserve My Session Now</span>
            <span className="text-sm font-medium opacity-90">Limited weekly slots — PKR 999</span>
          </CtaButton>
        </div>
      </Section>

      <WaveDivider soft />

      {/* Will this work for me */}
      <Section soft id="who">
        <div className="mx-auto max-w-3xl">
          <SectionHeading title="Will This Work for Your Situation?" />
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Whether you&apos;re a student, professional, parent, homemaker, entrepreneur, or someone
            who has quietly struggled since childhood…
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            This session is designed to explain why attention, memory and follow-through have been so
            hard for you specifically — and what evidence-based options exist for your age, stage and
            circumstances.
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-3xl gap-3">
          {[
            "Understand whether ADHD is the likely explanation for your difficulties",
            "Rule out anxiety, depression, sleep and medical causes properly",
            "Get strategies matched to your actual daily routine",
            "Know exactly whether a full diagnostic assessment is worth your money",
          ].map((b) => (
            <div key={b} className="flex gap-3 rounded-2xl border border-border bg-card px-5 py-4">
              <CheckCircle2 strokeWidth={1.7} className="mt-0.5 size-5 shrink-0 text-primary" />
              <span className="text-sm leading-relaxed">{b}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audience.map((a, i) => (
            <Reveal key={a.title} delay={(i % 3) * 70}>
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

      <WaveDivider flip soft />

      {/* Special offer / fee adjustment */}
      <Section id="offer">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/25 bg-primary-soft px-7 py-12 text-center sm:px-14">
          <Eyebrow>Special patient benefit</Eyebrow>
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold sm:text-4xl">
            Your Full PKR 999 Is Credited Toward a Comprehensive ADHD Assessment
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            If your Clarity Session shows that a full diagnostic assessment is appropriate and you
            proceed within 30 days, the entire PKR 999 is deducted from that assessment. You are
            never paying twice for the same clinical work.
          </p>
          <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
            {[
              "Full fee adjusted within 30 days",
              "No obligation to continue",
              "Priority scheduling for your assessment",
              "Same consultant throughout your care",
            ].map((x) => (
              <div
                key={x}
                className="flex items-center gap-2.5 rounded-2xl border border-border bg-card px-5 py-3.5 text-left text-sm font-medium"
              >
                <BadgeCheck strokeWidth={1.8} className="size-4 shrink-0 text-primary" />
                {x}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm font-semibold text-primary-deep">
            Effective value of your clarity session if you continue: PKR 0
          </p>
          <div className="mt-8">
            <CtaButton to="/checkout" className="flex-col gap-0.5">
              <span>YES! I Want In</span>
              <span className="text-sm font-medium opacity-90">Book my session + fee credit</span>
            </CtaButton>
          </div>
        </div>
      </Section>

      <WaveDivider soft />

      {/* Bonuses */}
      <Section soft id="bonuses">
        <SectionHeading
          title="You Also Receive 4 Additional Patient Resources"
          subtitle="Included free with every ADHD Clarity Session — sent to you after your appointment."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {bonuses.map((b, i) => (
            <Reveal key={b.title} delay={(i % 2) * 80}>
              <div className="card-premium flex h-full gap-5 p-7">
                <IconBubble icon={b.icon} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                    Patient Resource #{i + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                  <p className="mt-4 text-sm font-semibold text-primary-deep">{b.value}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-base font-semibold">
          Total resource value: PKR 18,000 — included free with your session today.
        </p>
        <div className="mt-8 text-center">
          <CtaButton to="/checkout" className="flex-col gap-0.5">
            <span>YES! I Want the Resources</span>
            <span className="text-sm font-medium opacity-90">
              My session + all 4 resources for PKR 999
            </span>
          </CtaButton>
        </div>
      </Section>

      <WaveDivider flip soft />

      {/* Objection: no referral needed */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <SectionHeading title="No Referral, Diagnosis or Medical Knowledge Needed" />
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            You don&apos;t need a GP letter, a previous psychiatric file, test results, or any
            understanding of clinical terminology to attend.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Everything is explained in simple, practical language. You will understand:
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "What is actually causing your attention difficulties",
              "What you can improve yourself with structure and strategy",
              "What genuinely requires clinical treatment",
              "Where not to waste money on unnecessary tests or unqualified 'ADHD coaching'",
            ].map((x) => (
              <li key={x} className="flex gap-3 text-sm leading-relaxed sm:text-base">
                <CheckCircle2 strokeWidth={1.7} className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Objection: no medication commitment */}
      <Section soft>
        <div className="mx-auto max-w-3xl">
          <SectionHeading title="You Are Not Committing to Medication or Long-Term Treatment" />
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            The purpose of this session is not to push you toward medication or an expensive
            treatment pathway. It is to give you an honest clinical picture so that any decision you
            make afterwards is an informed one.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Start with understanding, not prescriptions",
              "Try structure, routine and therapy-based strategies first where appropriate",
              "Escalate only if the clinical picture genuinely calls for it",
              "Focus on real-life function, not labels for their own sake",
            ].map((x) => (
              <li key={x} className="flex gap-3 text-sm leading-relaxed sm:text-base">
                <CheckCircle2 strokeWidth={1.7} className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base leading-relaxed font-semibold sm:text-lg">
            The goal isn&apos;t more treatment. The goal is the right treatment — or none at all.
          </p>
        </div>
      </Section>

      <WaveDivider soft />

      {/* Self-check */}
      <Section id="checklist">
        <SectionHeading
          eyebrow="Quick self-check"
          title="Tick Everything That Sounds Like You"
          subtitle="A reflection tool, not a diagnostic test — but a useful thing to bring to your session."
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
                ? `You ticked ${checked.length}. When several of these show up together, it is worth a proper clinical look.`
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

      <WaveDivider soft />

      {/* How it works */}
      <Section soft id="how">
        <SectionHeading
          title="How Does the ADHD Clarity Session Work?"
          subtitle="Clarity about your attention, mapped out for you in just 3 steps."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <div className="card-premium h-full p-7">
                <span className="grid size-11 place-items-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <WaveDivider flip soft />

      {/* Not generic advice */}
      <Section>
        <SectionHeading
          title="Not Generic ADHD Advice"
          subtitle="This isn't a reel telling you to 'use a planner' or 'try cold showers.' Your session is shaped around who you actually are."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p, i) => (
            <Reveal key={p.who} delay={(i % 3) * 70}>
              <div className="card-premium h-full p-6">
                <h3 className="text-base font-semibold">{p.who}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.path}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <WaveDivider soft />

      {/* Myths */}
      <Section soft>
        <SectionHeading eyebrow="Myths &amp; reality" title="What ADHD Actually Is — and Isn't" />
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

      <WaveDivider flip soft />

      {/* Authority */}
      <Section id="doctor">
        <SectionHeading
          eyebrow="Your consultant"
          title="Who Is Dr. Mohammad Faheem Khan?"
        />
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative">
            <div className="overflow-hidden rounded-[2.5rem] border border-border shadow-[var(--shadow-lift)]">
              <img
                src={doctorImg}
                width={500}
                height={500}
                loading="lazy"
                alt="Dr. Mohammad Faheem Khan, Consultant Psychiatrist"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 left-4 rounded-2xl border border-border bg-card px-5 py-3 shadow-[var(--shadow-soft)]">
              <p className="text-sm font-semibold">Dr. Mohammad Faheem Khan</p>
              <p className="text-xs text-muted-foreground">MBBS, MRCPsych, FRCPsych</p>
            </div>
          </div>
          <div>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Dr. Faheem is a Consultant Psychiatrist with over 20 years of clinical experience
              across international and local practice. He is CEO &amp; Founder of Aspire Clinic
              Ireland and Spring North Hospital, and works to evidence-based international standards
              with a calm, unhurried, non-judgemental approach.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              He has spent two decades assessing attention, mood and neurodevelopmental conditions —
              and has seen how often capable people are dismissed as lazy for years before anyone
              asks the right questions.
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

        <div className="mt-12 overflow-hidden rounded-[2.5rem] border border-border shadow-[var(--shadow-soft)]">
          <img
            src={clinicImg}
            width={1280}
            height={960}
            loading="lazy"
            alt="Calm consultation room where in-clinic ADHD Clarity Sessions take place"
            className="h-full w-full object-cover"
          />
        </div>
      </Section>

      <WaveDivider soft />

      {/* Full testimonials */}
      <Section soft id="reviews">
        <SectionHeading
          eyebrow="Patient experiences"
          title="More Feedback From Patients"
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

      {/* Risk reversal + price */}
      <Section id="price">
        <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-border bg-card p-8 text-center shadow-[var(--shadow-lift)] sm:p-12">
          <Eyebrow>Introductory pricing</Eyebrow>
          <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">
            One Hour With a Consultant Psychiatrist for PKR 999
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            A standard private consultant appointment of this length typically costs many times more.
            This introductory price exists so cost is never the reason someone spends another decade
            wondering what is wrong with them.
          </p>
          <p className="mt-8 text-5xl font-semibold">PKR 999</p>
          <p className="mt-2 text-sm text-muted-foreground">
            60 minutes · online or in-clinic · written summary included
          </p>
          <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, l: "Free reschedule up to 24h before" },
              { icon: Clock, l: "Full hour, never rushed" },
              { icon: Video, l: "Online or in-clinic" },
            ].map((x) => (
              <div
                key={x.l}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-primary-soft px-4 py-5 text-center text-xs font-semibold text-primary-deep"
              >
                <x.icon strokeWidth={1.7} className="size-5" />
                {x.l}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Countdown label="Introductory pricing ends in" />
          </div>
          <div className="mt-8">
            <CtaButton to="/checkout" className="flex-col gap-0.5">
              <span>YES! Book My ADHD Clarity Session</span>
              <span className="text-sm font-medium opacity-90">PKR 999 — credited if you continue</span>
            </CtaButton>
          </div>
        </div>
      </Section>

      <WaveDivider soft />

      {/* FAQ */}
      <Section soft id="faq">
        <SectionHeading eyebrow="FAQ" title="Questions People Ask Before Booking" />
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
          <div className="mt-8 text-center">
            <CtaButton href={WHATSAPP_URL} variant="outline">
              <MessageCircle strokeWidth={1.7} className="size-5" /> Still have a question? WhatsApp
              us
            </CtaButton>
          </div>
        </div>
      </Section>

      {/* Final close */}
      <section className="relative overflow-hidden bg-primary-deep px-5 py-20 text-center text-primary-foreground sm:py-28">
        <div className="mx-auto max-w-2xl">
          <Stethoscope strokeWidth={1.5} className="mx-auto size-10 opacity-80" />
          <h2 className="mt-6 text-4xl leading-tight font-semibold sm:text-5xl">
            Stop Wondering.
            <br />
            Start Understanding.
          </h2>
          <p className="mt-5 text-base opacity-90 sm:text-lg">
            You have already spent years explaining away the same difficulties. One structured hour
            with a Consultant Psychiatrist can replace all of that guessing with a clear, written,
            clinical answer.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <CtaButton to="/checkout" className="w-full flex-col gap-0.5 sm:w-auto">
              <span>YES! Book My Session for PKR 999</span>
              <span className="text-sm font-medium opacity-90">Online or in-clinic · 60 minutes</span>
            </CtaButton>
            <CtaButton
              href={WHATSAPP_URL}
              variant="outline"
              className="w-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
            >
              <MessageCircle strokeWidth={1.7} className="size-5" /> WhatsApp us
            </CtaButton>
          </div>
          <p className="mt-6 text-sm opacity-80">
            Free reschedule up to 24 hours before · Confidential medical record
          </p>
        </div>
      </section>

      <footer className="px-5 py-10 text-center text-xs leading-relaxed text-muted-foreground">
        <p className="mx-auto max-w-2xl">
          The ADHD Clarity Session is a screening and assessment consultation. It does not constitute
          a diagnosis, and no treatment outcome is guaranteed. Any further assessment or treatment is
          discussed individually.
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
