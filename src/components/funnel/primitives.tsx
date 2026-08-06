import { Link } from "@tanstack/react-router";
import { MessageCircle, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const WHATSAPP_URL =
  "https://wa.me/923001234567?text=Hi%2C%20I%20have%20a%20question%20about%20the%20ADHD%20Clarity%20Session";

export function Section({
  id,
  soft,
  className,
  children,
}: {
  id?: string;
  soft?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("relative px-5 py-16 sm:py-24", soft && "surface-soft", className)}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-primary-soft px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-primary-deep uppercase">
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "mb-10 max-w-2xl sm:mb-14",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-4 text-3xl leading-tight font-semibold sm:text-4xl">{title}</h2>
      {subtitle ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function IconBubble({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="inline-grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-deep ring-1 ring-border">
      <Icon strokeWidth={1.6} className="size-5" />
    </span>
  );
}

export function CtaButton({
  children,
  to,
  href,
  variant = "cta",
  className,
  onClick,
}: {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: "cta" | "primary" | "outline";
  className?: string;
  onClick?: () => void;
}) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 text-base font-semibold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
    variant === "cta" &&
      "bg-cta text-cta-foreground shadow-[var(--shadow-cta)] hover:-translate-y-0.5 hover:brightness-105",
    variant === "primary" &&
      "bg-primary text-primary-foreground shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-primary-deep",
    variant === "outline" &&
      "border border-primary bg-background text-primary-deep hover:-translate-y-0.5 hover:bg-primary-soft",
    className,
  );

  if (to) {
    return (
      <Link to={to} className={styles} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className={styles}
      onClick={onClick}
    >
      {children}
    </a>
  );
}

export function WaveDivider({ flip, soft }: { flip?: boolean; soft?: boolean }) {
  return (
    <div aria-hidden className={cn("-mb-px w-full", flip && "rotate-180")}>
      <svg viewBox="0 0 1440 90" className="block h-[60px] w-full sm:h-[90px]" preserveAspectRatio="none">
        <path
          d="M0,40 C240,90 420,0 720,30 C1020,60 1220,90 1440,45 L1440,90 L0,90 Z"
          fill={soft ? "var(--primary-soft)" : "var(--background)"}
        />
      </svg>
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Rolling urgency countdown — resets on a fixed 48h cycle. */
export function Countdown({ label }: { label?: string }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const cycle = 48 * 60 * 60 * 1000;
    const tick = () => setLeft(cycle - (Date.now() % cycle));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const t = left ?? 0;
  const parts = [
    { v: Math.floor(t / 86400000), l: "Days" },
    { v: Math.floor(t / 3600000) % 24, l: "Hours" },
    { v: Math.floor(t / 60000) % 60, l: "Minutes" },
    { v: Math.floor(t / 1000) % 60, l: "Seconds" },
  ];

  return (
    <div className="text-center">
      {label ? (
        <p className="text-xs font-semibold tracking-[0.14em] text-primary-deep uppercase">
          {label}
        </p>
      ) : null}
      <div className="mt-3 flex items-center justify-center gap-2 sm:gap-3">
        {parts.map((p) => (
          <div
            key={p.l}
            className="min-w-[4.25rem] rounded-2xl border border-border bg-card px-3 py-3 shadow-[var(--shadow-soft)]"
          >
            <p className="text-2xl font-semibold tabular-nums sm:text-3xl">
              {left === null ? "--" : String(p.v).padStart(2, "0")}
            </p>
            <p className="mt-0.5 text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase">
              {p.l}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}


export function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-4 bottom-24 z-40 grid size-13 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:-translate-y-0.5 sm:bottom-8"
    >
      <MessageCircle strokeWidth={1.7} className="size-6" />
    </a>
  );
}

export function StickyCta({ label = "Book Session – PKR 999" }: { label?: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/90 px-4 py-3 backdrop-blur-md sm:hidden">
      <CtaButton to="/checkout" className="w-full py-3.5">
        {label}
      </CtaButton>
    </div>
  );
}

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !shown.current) {
        shown.current = true;
        setOpen(true);
      }
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 grid place-items-center bg-foreground/40 px-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-lift)]">
        <h3 className="text-2xl font-semibold">Still unsure?</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Ask us anything about the ADHD Clarity Session — no obligation. Our team replies on
          WhatsApp during clinic hours.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <CtaButton href={WHATSAPP_URL} variant="primary">
            <MessageCircle strokeWidth={1.7} className="size-5" /> Chat with us on WhatsApp
          </CtaButton>
          <button
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            No thanks, keep reading
          </button>
        </div>
      </div>
    </div>
  );
}
