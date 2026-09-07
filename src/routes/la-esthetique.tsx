import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarCheck,
  ChevronDown,
  Clock,
  Facebook,
  Heart,
  Instagram,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
  Stethoscope,
  X,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { captureAttribution } from "@/lib/crm";
import { Reveal } from "@/components/funnel/primitives";

// ---------------------------------------------------------------------------
// Placeholder imagery — replace these files in src/assets/clinic/ with the
// real logo, doctor photo and clinic photos when provided. Same filenames =
// instant swap, no layout changes needed.
// ---------------------------------------------------------------------------
import drPortrait from "@/assets/clinic/dr-sumbleen.jpg";
import clinicReception from "@/assets/clinic/reception.jpg";
import clinicTreatmentRoom from "@/assets/clinic/treatment-room.jpg";
import clinicEquipment from "@/assets/clinic/equipment.jpg";
import featHydrafacial from "@/assets/clinic/feat-hydrafacial.jpg";
import featLaser from "@/assets/clinic/feat-laser.jpg";
import featBotox from "@/assets/clinic/feat-botox.jpg";
import featHair from "@/assets/clinic/feat-hair.jpg";

const PHONE_DISPLAY = "0300 5013111";
const PHONE_TEL = "tel:+923005013111";
const WHATSAPP_URL =
  "https://wa.me/923005013111?text=Hello%20La%20Esthetique%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Sumbleen%20Majid.";
const ADDRESS =
  "Office No. 12 & 13, Lord Trade Center, Above Najeeb Pharmacy, F-11 Markaz, Islamabad, 44000";
const FACEBOOK_URL = "https://www.facebook.com/laesthetiqueisb";
const INSTAGRAM_URL = "https://www.instagram.com/laesthetique.isb";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("La Esthetique, Lord Trade Center, F-11 Markaz, Islamabad")}`;

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Dr. Sumbleen", href: "#about" },
  { label: "Treatments", href: "#treatments" },
  { label: "Why La Esthetique", href: "#why" },
  { label: "FAQs", href: "#faqs" },
  { label: "Contact", href: "#contact" },
];

type Treatment = { name: string; blurb: string };
type Category = { title: string; treatments: Treatment[] };

const CATEGORIES: Category[] = [
  {
    title: "Skin & Dermatology",
    treatments: [
      { name: "Advanced Skincare Treatments", blurb: "Personalized treatments using advanced techniques to improve skin health, texture, tone and overall appearance." },
      { name: "Acne Scars Customized Treatments", blurb: "Personalized treatments designed to target different types of acne scars and improve skin texture and tone." },
      { name: "Chemical Peel", blurb: "A controlled exfoliation treatment designed to refresh the skin, improve texture and brighten the complexion." },
      { name: "LED Light Therapy", blurb: "A gentle, non-invasive treatment using targeted LED light to support healthier, clearer and more radiant-looking skin." },
      { name: "HydraFacial", blurb: "A multi-step facial that cleanses, exfoliates, extracts impurities and hydrates the skin." },
      { name: "HydraFacial with Q-Switched Laser", blurb: "A combined treatment designed to cleanse and hydrate the skin while targeting pigmentation and uneven skin tone." },
      { name: "HydraFacial with OxyGeneo", blurb: "A combination treatment that cleanses, exfoliates and hydrates while refreshing and brightening the complexion." },
      { name: "Carbon Hollywood Facial", blurb: "A non-invasive laser facial designed to deep-clean pores, exfoliate the skin and improve its overall brightness and texture." },
      { name: "Skin Tag Removal", blurb: "A targeted treatment to safely remove unwanted skin tags and restore a smoother-looking skin surface." },
      { name: "Laser Tattoo Removal", blurb: "Advanced laser treatment designed to gradually break down unwanted tattoo pigment." },
    ],
  },
  {
    title: "Hair & Scalp",
    treatments: [
      { name: "PRP Scalp Treatment", blurb: "A platelet-rich plasma treatment designed to support scalp health and healthier-looking hair." },
      { name: "Hair Exosomes", blurb: "An advanced hair rejuvenation treatment using exosome-based therapy to support scalp and follicle health." },
      { name: "Laser Hair Removal", blurb: "An advanced treatment designed to reduce unwanted hair and leave the skin smoother for longer." },
    ],
  },
  {
    title: "Aesthetic & Anti-Aging",
    treatments: [
      { name: "Botox Treatments", blurb: "A targeted aesthetic treatment designed to soften the appearance of fine lines and wrinkles for a smoother, refreshed look." },
      { name: "Under-Eye Fillers", blurb: "A minimally invasive treatment designed to address under-eye hollows and restore subtle facial volume." },
      { name: "Threads Lifting", blurb: "A non-surgical treatment designed to lift sagging skin and enhance facial contours." },
      { name: "PRP Microneedling with Thread Lift", blurb: "A combination treatment designed to improve skin texture, support collagen production and provide a subtle lifting effect." },
      { name: "Anti-Aging Treatments", blurb: "Personalized aesthetic treatments including biostimulators, RF microneedling, threads, Botox and fillers based on individual needs." },
    ],
  },
  {
    title: "Wellness & Glow",
    treatments: [
      { name: "IV Glow Drip", blurb: "A wellness-focused IV infusion designed to support hydration and deliver selected vitamins and nutrients." },
      { name: "Vampire Facial", blurb: "A PRP-based rejuvenation treatment designed to support collagen production and improve skin texture and tone." },
    ],
  },
];

const FEATURED = [
  { name: "HydraFacial", img: featHydrafacial, alt: "Premium skincare products used in HydraFacial treatments at La Esthetique Islamabad", copy: "A multi-step facial that deeply cleanses, exfoliates and hydrates for a refreshed glow." },
  { name: "Laser Hair Removal", img: featLaser, alt: "Modern laser device used for laser hair removal at La Esthetique Islamabad", copy: "Advanced laser technology designed to reduce unwanted hair and leave skin smoother for longer." },
  { name: "Botox Treatments", img: featBotox, alt: "Aesthetic treatment vials representing Botox treatments at La Esthetique Islamabad", copy: "Softening the appearance of fine lines and wrinkles for a naturally refreshed look." },
  { name: "PRP Scalp Treatment", img: featHair, alt: "Hair and scalp care products representing PRP scalp treatment at La Esthetique Islamabad", copy: "Platelet-rich plasma therapy designed to support scalp health and healthier-looking hair." },
  { name: "Acne Scar Treatments", img: clinicTreatmentRoom, alt: "Treatment room at La Esthetique Islamabad where acne scar treatments are performed", copy: "Personalized combinations that target different types of acne scars and refine skin texture." },
  { name: "Anti-Aging Treatments", img: clinicReception, alt: "Reception area of La Esthetique clinic in F-11 Markaz Islamabad", copy: "Biostimulators, RF microneedling, threads, Botox and fillers — planned around your needs." },
];

const GALLERY = [
  { img: clinicReception, alt: "Reception area of La Esthetique clinic, F-11 Markaz Islamabad", label: "Reception" },
  { img: clinicTreatmentRoom, alt: "Treatment room at La Esthetique dermatology clinic Islamabad", label: "Treatment Room" },
  { img: clinicEquipment, alt: "Advanced dermatology laser equipment at La Esthetique Islamabad", label: "Technology" },
  { img: drPortrait, alt: "Dr. Sumbleen Majid, dermatologist at La Esthetique Islamabad", label: "Your Doctor" },
];

// Placeholder review cards — replace the text with real patient reviews.
const REVIEW_PLACEHOLDERS = [1, 2, 3];

const FAQS = [
  { q: "How do I book an appointment?", a: "You can book a consultation by calling or WhatsApping La Esthetique at 0300 5013111." },
  { q: "Where is La Esthetique located?", a: "Office No. 12 & 13, Lord Trade Center, Above Najeeb Pharmacy, F-11 Markaz, Islamabad." },
  { q: "Do I need a consultation before treatment?", a: "A consultation is recommended so your concerns can be assessed and an appropriate treatment plan can be discussed." },
  { q: "Are treatments suitable for everyone?", a: "Suitability varies by treatment and individual circumstances. A consultation helps determine the most appropriate option." },
  { q: "How can I contact the clinic?", a: "You can contact La Esthetique by phone or WhatsApp at 0300 5013111." },
];

const JOURNEY = [
  { title: "Consultation", copy: "Understand your concerns and goals." },
  { title: "Assessment", copy: "Evaluate your skin, hair or aesthetic needs." },
  { title: "Personalized Plan", copy: "Recommend suitable treatments based on your individual needs." },
  { title: "Treatment", copy: "Receive care in a professional clinical environment." },
  { title: "Follow-Up", copy: "Review progress and adjust your treatment plan when needed." },
];

const inputCls =
  "w-full rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring";
const labelCls = "mb-1.5 block text-xs font-semibold tracking-[0.1em] text-foreground/70 uppercase";

export const Route = createFileRoute("/la-esthetique")({
  head: () => ({
    meta: [
      { title: "Dr. Sumbleen Majid | Dermatologist in Islamabad | La Esthetique" },
      {
        name: "description",
        content:
          "Consult Dr. Sumbleen Majid at La Esthetique, Islamabad for personalized dermatology, skin, hair and aesthetic treatments in F-11 Markaz.",
      },
      { property: "og:title", content: "Dr. Sumbleen Majid | Dermatologist in Islamabad | La Esthetique" },
      {
        property: "og:description",
        content:
          "Personalized dermatology, skin, hair and aesthetic treatments by Dr. Sumbleen Majid at La Esthetique, F-11 Markaz, Islamabad.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://adhdpakistan.site/la-esthetique" },
    ],
    links: [
      { rel: "canonical", href: "https://adhdpakistan.site/la-esthetique" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          name: "La Esthetique",
          description:
            "Dermatology and aesthetic clinic in F-11 Markaz, Islamabad, led by Dr. Sumbleen Majid.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Office No. 12 & 13, Lord Trade Center, Above Najeeb Pharmacy, F-11 Markaz",
            addressLocality: "Islamabad",
            postalCode: "44000",
            addressCountry: "PK",
          },
          telephone: "+92-300-5013111",
          medicalSpecialty: "Dermatology",
          founder: { "@type": "Physician", name: "Dr. Sumbleen Majid", medicalSpecialty: "Dermatology" },
          sameAs: [FACEBOOK_URL, INSTAGRAM_URL],
        }),
      },
    ],
  }),
  component: LaEsthetiquePage,
});

function LaEsthetiquePage() {
  return (
    <div className="le-theme min-h-screen font-[family-name:var(--font-sans)] antialiased">
      <Header />
      <main>
        <Hero />
        <Intro />
        <About />
        <FeaturedTreatments />
        <Treatments />
        <WhyUs />
        <JourneySection />
        <ClinicGallery />
        <Reviews />
        <FaqSection />
        <BookingSection />
        <LocationSection />
      </main>
      <Footer />
      <MobileCta />
    </div>
  );
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        {/* Logo placeholder — replace with the La Esthetique logo image */}
        <button onClick={() => scrollTo("home")} className="text-left">
          <span className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-wide text-primary">
            La Esthetique
          </span>
          <span className="block text-[0.6rem] font-medium tracking-[0.28em] text-muted-foreground uppercase">
            Dermatology & Aesthetics
          </span>
        </button>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href.slice(1))}
              className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
            >
              {l.label}
            </button>
          ))}
          <a
            href="#book"
            onClick={(e) => { e.preventDefault(); scrollTo("book"); }}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Book Appointment
          </a>
        </nav>
        <button
          className="grid size-10 place-items-center rounded-lg border border-border lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-5 py-4 lg:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => { setOpen(false); scrollTo(l.href.slice(1)); }}
                className="rounded-lg px-3 py-3 text-left text-sm font-medium text-foreground/80 hover:bg-primary-soft"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => { setOpen(false); scrollTo("book"); }}
              className="mt-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Book Appointment
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}

function CtaRow({ center }: { center?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-3 ${center ? "justify-center" : ""}`}>
      <button
        onClick={() => scrollTo("book")}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary-deep"
      >
        <CalendarCheck className="size-4" /> Book an Appointment
      </button>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-primary bg-background px-7 py-3.5 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:bg-primary-soft"
      >
        <MessageCircle className="size-4" /> WhatsApp Us
      </a>
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-5 py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.28em] text-primary uppercase">
            La Esthetique — F-11 Markaz, Islamabad
          </p>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl leading-[1.05] font-semibold sm:text-6xl">
            Expert Dermatology &amp; Aesthetic Care in Islamabad
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Personalized skin, hair and aesthetic treatments designed around your individual needs,
            with care you can trust.
          </p>
          <div className="mt-8">
            <CtaRow />
          </div>
          <p className="mt-8 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Dermatology • Skin Health • Hair Care • Aesthetic Treatments
          </p>
        </Reveal>
        <Reveal delay={150}>
          <div className="relative mx-auto max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] border border-primary/20" aria-hidden />
            {/* Doctor portrait placeholder — replace src/assets/clinic/dr-sumbleen.jpg */}
            <img
              src={drPortrait}
              alt="Dr. Sumbleen Majid, dermatologist at La Esthetique clinic in Islamabad"
              width={1024}
              height={1024}
              className="aspect-[4/5] w-full rounded-[1.75rem] object-cover"
            />
            <div className="absolute bottom-5 left-5 rounded-xl bg-background/95 px-5 py-3 shadow-[var(--shadow-soft)] backdrop-blur">
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold">Dr. Sumbleen Majid</p>
              <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">Dermatologist</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
      <p className="text-xs font-semibold tracking-[0.28em] text-primary uppercase">{eyebrow}</p>
      <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight font-semibold sm:text-5xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-4 text-base leading-relaxed text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}

function Intro() {
  return (
    <section className="px-5 py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <img
            src={clinicTreatmentRoom}
            alt="Inside La Esthetique dermatology and aesthetic clinic in Islamabad"
            width={1280}
            height={768}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
        </Reveal>
        <Reveal delay={120} className="order-1 lg:order-2">
          <p className="text-xs font-semibold tracking-[0.28em] text-primary uppercase">Welcome to La Esthetique</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight font-semibold sm:text-5xl">
            Where Skin Health Meets Aesthetic Expertise
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            At La Esthetique, Dr. Sumbleen Majid provides personalized dermatology and aesthetic care
            focused on healthier-looking skin, hair and natural-looking enhancement. Every treatment
            begins with understanding your concerns and creating a plan suited to your individual needs.
          </p>
          <button
            onClick={() => scrollTo("about")}
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-3 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:bg-primary-soft"
          >
            Meet Dr. Sumbleen
          </button>
        </Reveal>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="bg-secondary px-5 py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.28em] text-primary uppercase">Your Dermatologist</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight font-semibold sm:text-5xl">
            Meet Dr. Sumbleen Majid
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Dr. Sumbleen Majid is a dermatologist dedicated to providing personalized care for a wide
            range of skin, hair and aesthetic concerns. At La Esthetique, her approach combines clinical
            dermatology with advanced aesthetic treatments to help patients achieve healthy, refreshed
            and natural-looking results.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold tracking-wide">
              <Stethoscope className="size-4 text-primary" /> Dermatologist
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold tracking-wide">
              <MapPin className="size-4 text-primary" /> La Esthetique, Islamabad
            </span>
          </div>
          {/* Editable placeholder: add qualifications, experience and credentials here when provided. */}
          <div className="mt-8">
            <CtaRow />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <img
            src={drPortrait}
            alt="Portrait of Dr. Sumbleen Majid, dermatologist in Islamabad"
            width={1024}
            height={1024}
            loading="lazy"
            className="mx-auto aspect-[4/5] w-full max-w-md rounded-2xl object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}

function FeaturedTreatments() {
  return (
    <section className="px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Featured"
          title="Signature Treatments"
          subtitle="A closer look at some of our most requested dermatology and aesthetic treatments."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((f, i) => (
            <Reveal key={f.name} delay={i * 70}>
              <article className="group overflow-hidden rounded-2xl border border-border bg-card">
                <div className="overflow-hidden">
                  <img
                    src={f.img}
                    alt={f.alt}
                    width={1024}
                    height={800}
                    loading="lazy"
                    className="aspect-[5/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold">{f.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.copy}</p>
                  <button
                    onClick={() => scrollTo("book")}
                    className="mt-4 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Book Consultation
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button
            onClick={() => scrollTo("treatments")}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary-deep"
          >
            Explore All Treatments
          </button>
        </div>
      </div>
    </section>
  );
}

function Treatments() {
  return (
    <section id="treatments" className="bg-secondary px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Treatments"
          title="Our Treatments"
          subtitle="Personalized dermatology and aesthetic solutions for your skin, hair and overall appearance."
        />
        <div className="space-y-14">
          {CATEGORIES.map((cat) => (
            <div key={cat.title}>
              <h3 className="mb-6 flex items-center gap-3 font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
                <span className="h-px w-8 bg-primary/40" aria-hidden />
                {cat.title}
              </h3>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cat.treatments.map((t) => (
                  <article
                    key={t.name}
                    className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
                  >
                    <span className="mb-4 inline-grid size-11 place-items-center rounded-full bg-primary-soft text-primary">
                      <Sparkles className="size-5" strokeWidth={1.6} />
                    </span>
                    <h4 className="text-lg font-semibold">{t.name}</h4>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t.blurb}</p>
                    <div className="mt-5 flex items-center gap-4">
                      <a
                        href={`https://wa.me/923005013111?text=${encodeURIComponent(`Hello La Esthetique, I would like to learn more about ${t.name}.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        Learn More
                      </a>
                      <button
                        onClick={() => scrollTo("book")}
                        className="text-sm font-semibold text-foreground/70 underline-offset-4 hover:text-primary hover:underline"
                      >
                        Book Consultation
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const points = [
    { icon: Heart, title: "Personalized Care", copy: "Treatment plans tailored to your skin, hair and aesthetic concerns." },
    { icon: Sparkles, title: "Advanced Treatments", copy: "Modern dermatology and aesthetic techniques selected according to your needs." },
    { icon: Leaf, title: "Natural-Looking Approach", copy: "A focus on balanced, refreshed and natural-looking aesthetic enhancement." },
    { icon: Clock, title: "Comfortable Experience", copy: "A calm, professional clinic environment designed around patient comfort and care." },
  ];
  return (
    <section id="why" className="px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="The Difference" title="Why Choose La Esthetique?" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-border bg-card p-7 text-center">
                <span className="mx-auto mb-5 inline-grid size-13 place-items-center rounded-full bg-primary-soft text-primary">
                  <p.icon className="size-6" strokeWidth={1.5} />
                </span>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function JourneySection() {
  return (
    <section className="bg-secondary px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="How It Works" title="Your Journey to Better Skin Starts Here" />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {JOURNEY.map((step, i) => (
            <Reveal key={step.title} delay={i * 80}>
              <li className="relative h-full rounded-2xl border border-border bg-card p-6">
                <span className="font-[family-name:var(--font-display)] text-4xl font-semibold text-primary/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ClinicGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  return (
    <section className="px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The Clinic"
          title="A Space Designed Around You"
          subtitle="A calm, professional environment in the heart of F-11 Markaz, Islamabad."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {GALLERY.map((g, i) => (
            <button
              key={g.label}
              onClick={() => setLightbox(i)}
              className="group relative overflow-hidden rounded-2xl border border-border text-left"
              aria-label={`View larger image: ${g.label}`}
            >
              <img
                src={g.img}
                alt={g.alt}
                width={1280}
                height={768}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold tracking-wide">
                {g.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      {lightbox !== null && GALLERY[lightbox] && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-foreground/70 p-5 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={GALLERY[lightbox]!.label}
        >
          <div className="relative max-h-[85vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={GALLERY[lightbox]!.img}
              alt={GALLERY[lightbox]!.alt}
              className="max-h-[85vh] w-full rounded-2xl object-contain"
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-3 -right-3 grid size-10 place-items-center rounded-full bg-background shadow-lg"
              aria-label="Close image"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Reviews() {
  return (
    <section className="bg-secondary px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Patient Voices" title="What Our Patients Say" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEW_PLACEHOLDERS.map((n) => (
            <figure key={n} className="rounded-2xl border border-dashed border-primary/40 bg-card p-7">
              <div className="flex gap-1 text-cta" aria-label="Five star rating placeholder">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              {/* Editable placeholder — replace with a real patient review. */}
              <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground italic">
                Patient review placeholder — replace this text with a real Google review from a La
                Esthetique patient.
              </blockquote>
              <figcaption className="mt-4 text-xs font-semibold tracking-[0.12em] text-foreground/70 uppercase">
                Patient Name
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-3 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:bg-primary-soft"
          >
            View More Reviews
          </a>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faqs" className="px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="Questions" title="Frequently Asked Questions" />
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className="overflow-hidden rounded-2xl border border-border bg-card">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={open === i}
              >
                <span className="text-base font-semibold">{f.q}</span>
                <ChevronDown
                  className={`size-5 shrink-0 text-primary transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingSection() {
  const [form, setForm] = useState({ name: "", phone: "", concern: "", date: "", time: "", message: "" });
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.concern.trim()) return;
    setState("saving");
    const attribution = captureAttribution();
    const notes = [
      form.date && `Preferred date: ${form.date}`,
      form.time && `Preferred time: ${form.time}`,
      form.message && `Message: ${form.message}`,
    ].filter(Boolean).join("\n");
    const { error } = await supabase.from("leads").insert({
      full_name: form.name.trim(),
      phone: form.phone.trim(),
      service: `La Esthetique — ${form.concern.trim()}`,
      source: "Website",
      ...attribution,
      campaign: attribution.campaign ?? "la-esthetique",
      status: "New",
      notes: notes || null,
      follow_up_date: form.date || null,
      ...attribution,
    });
    setState(error ? "error" : "done");
  }

  return (
    <section id="book" className="bg-primary px-5 py-16 text-primary-foreground sm:py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.28em] uppercase opacity-80">Book Your Visit</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight font-semibold sm:text-5xl">
            Ready to Give Your Skin the Care It Deserves?
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed opacity-90">
            Book a consultation with Dr. Sumbleen Majid at La Esthetique, Islamabad.
          </p>
          <div className="mt-8 space-y-4">
            <a href={PHONE_TEL} className="flex items-center gap-3 text-lg font-semibold hover:underline">
              <span className="grid size-11 place-items-center rounded-full bg-primary-foreground/15">
                <Phone className="size-5" />
              </span>
              Call: {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-lg font-semibold hover:underline"
            >
              <span className="grid size-11 place-items-center rounded-full bg-primary-foreground/15">
                <MessageCircle className="size-5" />
              </span>
              WhatsApp: {PHONE_DISPLAY}
            </a>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-6 text-foreground shadow-[var(--shadow-lift)] sm:p-8">
          {state === "done" ? (
            <div className="py-10 text-center">
              <span className="mx-auto mb-4 inline-grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
                <CalendarCheck className="size-7" />
              </span>
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Request Received</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Thank you, {form.name.split(" ")[0]}. The clinic will contact you shortly to confirm your
                appointment. For a faster response, message us on WhatsApp.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
              >
                <MessageCircle className="size-4" /> Message on WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className={labelCls} htmlFor="le-name">Name *</label>
                <input id="le-name" required className={inputCls} value={form.name} onChange={set("name")} placeholder="Your full name" />
              </div>
              <div>
                <label className={labelCls} htmlFor="le-phone">Phone Number *</label>
                <input id="le-phone" required type="tel" className={inputCls} value={form.phone} onChange={set("phone")} placeholder="03XX XXXXXXX" />
              </div>
              <div>
                <label className={labelCls} htmlFor="le-concern">Treatment / Concern *</label>
                <select id="le-concern" required className={inputCls} value={form.concern} onChange={set("concern")}>
                  <option value="">Select a treatment or concern</option>
                  {CATEGORIES.flatMap((c) => c.treatments).map((t) => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                  ))}
                  <option value="General consultation">General consultation</option>
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="le-date">Preferred Date</label>
                  <input id="le-date" type="date" className={inputCls} value={form.date} onChange={set("date")} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="le-time">Preferred Time</label>
                  <input id="le-time" type="time" className={inputCls} value={form.time} onChange={set("time")} />
                </div>
              </div>
              <div>
                <label className={labelCls} htmlFor="le-message">Message</label>
                <textarea id="le-message" rows={3} className={inputCls} value={form.message} onChange={set("message")} placeholder="Anything you'd like us to know" />
              </div>
              {state === "error" && (
                <p className="text-sm font-medium text-destructive">
                  Something went wrong sending your request. Please call or WhatsApp us at {PHONE_DISPLAY}.
                </p>
              )}
              <button
                type="submit"
                disabled={state === "saving"}
                className="w-full rounded-lg bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-deep disabled:opacity-60"
              >
                {state === "saving" ? "Sending…" : "Request Appointment"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section id="contact" className="px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Find Us" title="Visit La Esthetique" />
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                <MapPin className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{ADDRESS}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                <Phone className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold">Call Us</h3>
                <a href={PHONE_TEL} className="mt-1 block text-sm text-muted-foreground hover:text-primary">
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                <MessageCircle className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold">WhatsApp Us</h3>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-1 block text-sm text-muted-foreground hover:text-primary">
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Follow Us</h3>
              <div className="mt-3 flex gap-3">
                <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" aria-label="La Esthetique on Facebook"
                  className="grid size-11 place-items-center rounded-full border border-border text-primary transition-colors hover:bg-primary-soft">
                  <Facebook className="size-5" />
                </a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="La Esthetique on Instagram"
                  className="grid size-11 place-items-center rounded-full border border-border text-primary transition-colors hover:bg-primary-soft">
                  <Instagram className="size-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <iframe
              title="Map — La Esthetique, F-11 Markaz, Islamabad"
              src={`https://www.google.com/maps?q=${encodeURIComponent("Lord Trade Center, F-11 Markaz, Islamabad")}&output=embed`}
              className="h-[320px] w-full sm:h-[380px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-primary-deep px-5 pt-14 pb-28 text-primary-foreground sm:pb-14">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl font-semibold">La Esthetique</p>
          <p className="mt-1 text-[0.6rem] font-medium tracking-[0.28em] uppercase opacity-70">
            Dermatology & Aesthetics
          </p>
          <p className="mt-4 text-sm leading-relaxed opacity-80">
            Personalized dermatology and aesthetic care by Dr. Sumbleen Majid in F-11 Markaz, Islamabad.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid size-10 place-items-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20">
              <Facebook className="size-4" />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid size-10 place-items-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20">
              <Instagram className="size-4" />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid size-10 place-items-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20">
              <MessageCircle className="size-4" />
            </a>
          </div>
        </div>
        <nav aria-label="Footer navigation">
          <h3 className="text-xs font-semibold tracking-[0.2em] uppercase opacity-70">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="opacity-80 transition-opacity hover:opacity-100">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h3 className="text-xs font-semibold tracking-[0.2em] uppercase opacity-70">Treatments</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {["HydraFacial", "Laser Hair Removal", "Botox Treatments", "PRP Scalp Treatment", "Acne Scar Treatments", "Chemical Peel"].map((t) => (
              <li key={t}>
                <a href="#treatments" className="opacity-80 transition-opacity hover:opacity-100">{t}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold tracking-[0.2em] uppercase opacity-70">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm opacity-80">
            <li className="leading-relaxed">{ADDRESS}</li>
            <li><a href={PHONE_TEL} className="hover:underline">{PHONE_DISPLAY}</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-6xl border-t border-primary-foreground/15 pt-6 text-center text-xs opacity-70">
        © 2026 La Esthetique. All rights reserved.
      </div>
    </footer>
  );
}

function MobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
      <a href={PHONE_TEL} className="flex flex-col items-center gap-1 py-3 text-xs font-semibold text-primary">
        <Phone className="size-5" /> Call
      </a>
      <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 border-x border-border py-3 text-xs font-semibold text-primary">
        <MessageCircle className="size-5" /> WhatsApp
      </a>
      <button onClick={() => scrollTo("book")} className="flex flex-col items-center gap-1 bg-primary py-3 text-xs font-semibold text-primary-foreground">
        <CalendarCheck className="size-5" /> Book
      </button>
    </div>
  );
}
