/**
 * Meta Pixel helpers.
 *
 * The base pixel snippet is injected once via head() in src/routes/__root.tsx
 * (the official snippet self-guards with `if (f.fbq) return;` so it can never
 * double-initialise, even if the pixel is also injected elsewhere).
 *
 * `trackPurchase` is the ONLY approved way to fire a Purchase event. It must
 * be called from a point where a payment gateway has CONFIRMED success —
 * never from a form submit, checkout render, or button click.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export const META_PIXEL_ID = "1628603828885616";

/** Fire a PageView (used for SPA route changes; initial load is handled by the base snippet). */
export function trackPageView() {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
}

type PurchaseArgs = {
  /** Amount actually charged, in major currency units (e.g. 999). */
  value: number;
  /** Stable unique transaction ID from the payment gateway — used for dedupe. */
  transactionId: string;
  currency?: string;
};

/**
 * Fire a Meta Pixel Purchase event exactly once per transaction.
 *
 * Duplicate protection: the transaction ID is persisted in localStorage
 * (`fb-purchase:<id>`). Refreshes of a success page, back/forward navigation,
 * or repeat calls with the same ID will not re-fire the event.
 */
export function trackPurchase({ value, transactionId, currency = "PKR" }: PurchaseArgs) {
  if (typeof window === "undefined") return;
  if (!transactionId) {
    console.warn("[meta-pixel] trackPurchase called without a transactionId — skipped.");
    return;
  }
  if (typeof window.fbq !== "function") return; // pixel blocked/not loaded

  const key = `fb-purchase:${transactionId}`;
  try {
    if (localStorage.getItem(key)) return; // already counted
    localStorage.setItem(key, new Date().toISOString());
  } catch {
    /* storage unavailable — fall back to in-memory dedupe for this page load */
    if (memoryDedupe.has(key)) return;
    memoryDedupe.add(key);
  }

  window.fbq("track", "Purchase", {
    value,
    currency,
    content_name: "ADHD Clarity Session",
  });
}
