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
  BadgeCheck,
  Brain,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Compass,
  GraduationCap,
  HelpCircle,
  ListChecks,
  Mail,
  MessageCircle,
  Quote,
  Search,
  Sparkles,
  Star,
  Stethoscope,
  Timer,
  Users,
  UserRound,
  Video,
  Wallet,
} from "lucide-react";
import doctorAsset from "@/assets/dr-faheem-khan.png.asset.json";
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

/* ------------------------------------------------------------------
 * EDITABLE WORKSHOP DETAILS — update these three values only.
 * ------------------------------------------------------------------ */
export const WORKSHOP_DATE = "Sunday 13 September 2026";
export const WORKSHOP_TIME = "5:30 PM – 6:30 PM PKT";
export const WORKSHOP_FEE = "PKR 999";
/* ------------------------------------------------------------------ */

const TITLE = "Live ADHD Clarity Workshop | Dr. Mohammad Faheem Khan";
const DESCRIPTION =
  "Join Dr. Mohammad Faheem Khan, Consultant Psychiatrist, for a live online ADHD Clarity Workshop. Understand ADHD symptoms, patterns and appropriate next steps. Reserve your seat.";

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
          "@type": "EducationEvent",
          name: "ADHD Clarity Workshop",
          description: DESCRIPTION,
          eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
          performer: {
            "@type": "Person",
            name: "Dr. Mohammad Faheem Khan",
            jobTitle: "Consultant Psychiatrist",
          },
        }),
      },
    ],
  }),
  component: SalesPage,
});

const doctorImg = doctorAsset.url;

const eventFacts = [
  { icon: CalendarDays, label: "Date", value: WORKSHOP_DATE },
  { icon: Timer, label: "Time", value: WORKSHOP_TIME },
  { icon: Video, label: "Format", value: "Live online" },
  { icon: Wallet, label: "Fee", value: WORKSHOP_FEE },
];

const painPoints = [
  { icon: Timer, text: "I know what I need to do, but I keep procrastinating." },
  { icon: Brain, text: "I struggle to stay focused even when something is important." },
  { icon: ClipboardList, text: "I start things but have difficulty finishing them." },
  { icon: ListChecks, text: "I keep forgetting things I genuinely want to remember." },
  { icon: Sparkles, text: "My mind feels constantly busy or difficult to organise." },
];

const learnPoints = [
  { title: "What ADHD actually is — and what it isn't", body: "The clinical picture, separated from the myths and social-media shortcuts." },
  { title: "Common ADHD patterns in children, students and adults", body: "How the same condition can look very different at different ages and stages." },
  { title: "Why focus, procrastination and task completion become difficult", body: "The attention and self-regulation mechanisms behind everyday struggles." },
  { title: "How ADHD can affect studies, work and relationships", body: "The knock-on effects people rarely connect back to attention difficulties." },
  { title: "What the appropriate next steps may be if ADHD is suspected", body: "How professional assessment works and when it is worth considering." },
];

const attendees = [
  { icon: UserRound, text: "Adults struggling with focus, procrastination or organisation" },
  { icon: GraduationCap, text: "University students facing concentration or academic difficulties" },
  { icon: Users, text: "Parents concerned about their child's attention or behaviour" },
  { icon: ClipboardList, text: "Professionals struggling with executive functioning" },
  { icon: HelpCircle, text: "People who have wondered whether ADHD could explain some of their difficulties" },
  { icon: Brain, text: "Anyone looking for evidence-based ADHD information" },
];

const experience = [
  { icon: Brain, title: "LEARN", body: "Understand ADHD beyond common myths." },
  { icon: Search, title: "RECOGNISE", body: "Identify common patterns that may warrant further attention." },
  { icon: MessageCircle, title: "ASK", body: "Get your questions answered during the live session." },
  { icon: Compass, title: "UNDERSTAND", body: "Learn what appropriate next steps may look like." },
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
  { myth: "ADHD is laziness.", reality: "ADHD is a neurodevelopmental condition affecting attention, working memory and self-regulation." },
  { myth: "Only children have ADHD.", reality: "Many adults remain unidentified and have coped quietly for decades before seeking information." },
  { myth: "Medication is the only answer.", reality: "Support is individualised — therapy, coaching, routine design and lifestyle change all play a role." },
];

const credentials = [
  "MBBS",
  "FRCPsych (London)",
  "CCT (London)",
  "DPM (Ireland)",
  "DMH (Ireland)",
  "DCP (Ireland)",
  "DIP (UK)",
  "GMC: 5208075",
  "IMC: 063419",
];

const testimonials = [
  { name: "Ayesha R.", source: "Google Review", text: "Dr. Faheem explains things calmly and in plain language. I finally understood what attention difficulties actually are." },
  { name: "Hamza K.", source: "Facebook Review", text: "Clear, evidence-based and free of jargon. I left with a much better understanding than any article gave me." },
  { name: "Sana M.", source: "Google Review", text: "I attended because of my son. It answered questions I didn't even know how to ask." },
  { name: "Bilal A.", source: "Attendee feedback", text: "I thought I was just lazy for 15 years. Hearing the actual explanation changed how I see myself." },
  { name: "Fatima Z.", source: "Google Review", text: "Professional and genuinely respectful. The online format worked perfectly." },
];

const faqs = [
  { q: "Is this a private 1-on-1 consultation?", a: "No. This is a live collective educational workshop attended by multiple participants." },
  { q: "Will I receive an ADHD diagnosis during the workshop?", a: "No. The workshop is educational and does not replace a formal psychiatric assessment. If further assessment is appropriate, you can discuss the next steps with a qualified professional." },
  { q: "Who can attend?", a: "Adults, university students, parents and others interested in understanding ADHD and related difficulties." },
  { q: "Is the workshop online?", a: "Yes. The workshop is conducted live online." },
  { q: "Can I ask questions?", a: "Yes. There will be an opportunity to ask relevant questions during the live session." },
  { q: "What happens after the workshop?", a: "Attendees who feel they need further support can explore appropriate professional assessment or treatment options." },
];

function EventDetails({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {eventFacts.map((f) => (
        <div
          key={f.label}
          className={
            tone === "dark"
              ? "rounded-2xl border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-4 text-center"
              : "rounded-2xl border border-border bg-card px-4 py-4 text-center shadow-[var(--shadow-soft)]"
          }
        >
          <f.icon
            strokeWidth={1.7}
            className={`mx-auto size-5 ${tone === "dark" ? "opacity-80" : "text-primary"}`}
          />
          <p
            className={`mt-2 text-[0.65rem] font-semibold tracking-[0.14em] uppercase ${
              tone === "dark" ? "opacity-75" : "text-muted-foreground"
            }`}
          >
            {f.label}
          </p>
          <p className="mt-1 text-sm font-semibold break-words">{f.value}</p>
        </div>
      ))}
    </div>
  );
}

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
            ADHD Clarity Workshop
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
          <Eyebrow>Live online workshop | Limited seats</Eyebrow>
          <h1 className="mt-5 text-3xl leading-[1.1] font-semibold sm:text-5xl lg:text-[3.4rem]">
            Could ADHD Be Affecting Your Life{" "}
            <span className="text-primary">Without You Realising It?</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Join Dr. Mohammad Faheem Khan for a live ADHD clarity workshop and learn how attention,
            procrastination, forgetfulness and emotional regulation difficulties may relate to ADHD.
          </p>

          <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-[2rem] border border-border shadow-[var(--shadow-lift)]">
            <img
              src={doctorImg}
              width={500}
              height={500}
              alt="Dr. Mohammad Faheem Khan, Consultant Psychiatrist, hosting the live ADHD Clarity Workshop"
              className="h-full w-full object-cover"
            />
          </div>

          <p className="mt-7 text-sm font-semibold sm:text-base">
            Hosted live by Dr. Mohammad Faheem Khan · Consultant Psychiatrist · 20+ years of clinical
            experience
          </p>

          <div className="mx-auto mt-7 max-w-2xl">
            <EventDetails />
          </div>

          <div className="mt-8">
            <CtaButton to="/checkout" className="w-full flex-col gap-0.5 sm:w-auto">
              <span>RESERVE MY SEAT</span>
              <span className="text-sm font-medium opacity-90">
                Live online workshop | Limited seats
              </span>
            </CtaButton>
          </div>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 strokeWidth={1.8} className="size-4 text-primary" /> Join other attendees
            live online and ask your questions
          </p>
        </div>
      </header>

      <WaveDivider soft />

      {/* Problem / hook */}
      <Section soft id="hook">
        <SectionHeading
          title="Does This Sound Like You?"
          subtitle="These experiences are common, and they don't automatically mean you have ADHD — but they are worth understanding properly."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {painPoints.map((p, i) => (
            <Reveal key={p.text} delay={(i % 3) * 70}>
              <div className="card-premium flex h-full gap-4 p-6">
                <IconBubble icon={p.icon} />
                <p className="text-sm leading-relaxed">&ldquo;{p.text}&rdquo;</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <CtaButton to="/checkout">RESERVE MY SEAT →</CtaButton>
        </div>
      </Section>

      <WaveDivider flip soft />

      {/* Offer block */}
      <Section id="offer">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/25 bg-primary-soft px-7 py-12 text-center sm:px-14">
          <Eyebrow>The event</Eyebrow>
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold sm:text-4xl">
            Live ADHD Clarity Workshop
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            A live educational workshop led by Dr. Mohammad Faheem Khan, Consultant Psychiatrist, with
            20+ years of clinical experience — designed to help attendees better understand ADHD,
            recognise common symptoms and patterns, and learn what the appropriate next steps may be.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <EventDetails />
          </div>
          <div className="mt-8">
            <CtaButton to="/checkout" className="flex-col gap-0.5">
              <span>RESERVE MY SEAT</span>
              <span className="text-sm font-medium opacity-90">
                Registration for this live session
              </span>
            </CtaButton>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            This is a group workshop, not a private consultation. It does not provide a diagnosis.
          </p>
        </div>
      </Section>

      <WaveDivider soft />

      {/* What you'll learn */}
      <Section soft id="learn">
        <SectionHeading
          eyebrow="Inside the workshop"
          title="What You'll Learn Inside the Workshop"
          subtitle="Five clear, evidence-based sections delivered live — with time for questions."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {learnPoints.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 80}>
              <div className="card-premium h-full p-7">
                <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                  Part #{i + 1}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <CtaButton to="/checkout" className="flex-col gap-0.5">
            <span>REGISTER FOR THE WORKSHOP</span>
            <span className="text-sm font-medium opacity-90">{WORKSHOP_FEE} · Live online</span>
          </CtaButton>
        </div>
      </Section>

      <WaveDivider flip soft />

      {/* Who is it for */}
      <Section id="who">
        <SectionHeading
          title="Who Is This Workshop For?"
          subtitle="Attendees join from across Pakistan — adults, students, parents and professionals learning together."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {attendees.map((a, i) => (
            <Reveal key={a.text} delay={(i % 3) * 70}>
              <div className="card-premium flex h-full gap-4 p-6">
                <IconBubble icon={a.icon} />
                <p className="text-sm leading-relaxed">{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <WaveDivider soft />

      {/* Workshop experience */}
      <Section soft id="experience">
        <SectionHeading
          eyebrow="The live experience"
          title="What the Session Looks Like"
          subtitle="A live expert-led session where you learn together with other attendees."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {experience.map((e, i) => (
            <Reveal key={e.title} delay={i * 80}>
              <div className="card-premium h-full p-7 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary-soft text-primary-deep ring-1 ring-border">
                  <e.icon strokeWidth={1.6} className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold tracking-[0.1em]">{e.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Join other attendees live online · Learn together · Ask questions during the session
        </p>
      </Section>

      <WaveDivider flip soft />

      {/* Self-check */}
      <Section id="checklist">
        <SectionHeading
          eyebrow="Quick self-check"
          title="Tick Everything That Sounds Like You"
          subtitle="A reflection tool, not a diagnostic test — but a useful thing to bring to the workshop."
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
                ? `You ticked ${checked.length}. When several of these show up together, it is worth understanding them properly.`
                : "If several of these sound familiar, the workshop will help you understand what may be behind them."}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              This checklist does not provide a diagnosis.
            </p>
            <div className="mt-6">
              <CtaButton to="/checkout">RESERVE MY SEAT</CtaButton>
            </div>
          </div>
        </div>
      </Section>

      <WaveDivider soft />

      {/* Myths */}
      <Section soft>
        <SectionHeading eyebrow="Myths & reality" title="What ADHD Actually Is — and Isn't" />
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
        <SectionHeading eyebrow="Your host" title="Why Learn From Dr. M Faheem Khan?" />
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
              <p className="text-sm font-semibold">Dr. M Faheem Khan</p>
              <p className="text-xs text-muted-foreground">Consultant Psychiatrist</p>
            </div>
          </div>
          <div>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Dr. Faheem is a Consultant Psychiatrist with over 20 years of clinical experience across
              international and local practice. He teaches ADHD the way he practises it — calmly,
              clearly and to evidence-based international standards.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              In this live workshop he explains what two decades of assessing attention, mood and
              neurodevelopmental conditions has taught him, in language anyone can follow.
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
                { n: "1,000s", l: "People supported" },
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

      {/* Testimonials */}
      <Section soft id="reviews">
        <SectionHeading
          eyebrow="Feedback"
          title="What People Say About Learning From Dr. Faheem"
          subtitle="Collected from Google and Facebook reviews."
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
                      <Star key={i} strokeWidth={0} className="size-4 fill-current" />
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
        <SectionHeading eyebrow="FAQ" title="Questions People Ask Before Registering" />
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
            Stop Guessing.
            <br />
            Start Understanding.
          </h2>
          <p className="mt-5 text-base opacity-90 sm:text-lg">
            Join the live ADHD Clarity Workshop with Dr. Mohammad Faheem Khan.
          </p>
          <div className="mt-8">
            <EventDetails tone="dark" />
          </div>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <CtaButton to="/checkout" className="w-full flex-col gap-0.5 sm:w-auto">
              <span>RESERVE MY SEAT</span>
              <span className="text-sm font-medium opacity-90">Live online · {WORKSHOP_FEE}</span>
            </CtaButton>
            <CtaButton
              href={WHATSAPP_URL}
              variant="outline"
              className="w-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
            >
              <MessageCircle strokeWidth={1.7} className="size-5" /> WhatsApp us
            </CtaButton>
          </div>
          <p className="mt-6 inline-flex items-center gap-2 text-sm opacity-80">
            <CalendarCheck strokeWidth={1.7} className="size-4" /> Limited workshop seats available.
          </p>
        </div>
      </section>

      <footer className="px-5 py-10 text-center text-xs leading-relaxed text-muted-foreground">
        <p className="mx-auto max-w-2xl">
          The ADHD Clarity Workshop is a live educational session. It is not a diagnostic service and
          does not replace a formal psychiatric assessment. Attendees who need further support can
          explore appropriate professional assessment options separately.
        </p>
        <p className="mt-4">
          © {new Date().getFullYear()} Dr. Mohammad Faheem Khan ·{" "}
          <Link to="/checkout" className="text-primary-deep underline-offset-4 hover:underline">
            Reserve my seat
          </Link>
        </p>
      </footer>

      <StickyCta label="RESERVE MY SEAT" />
      <WhatsAppFloat />
      <ExitIntentPopup />
    </main>
  );
}
