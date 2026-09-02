# Roadmap

- [x] Gate /thank-you: reachable only after successful submission (beforeLoad + client guard, empty render until verified)
- [x] Audit codebase for duplicate Purchase/fbq triggers — exactly one Purchase implementation (src/lib/meta-pixel.ts → thank-you.tsx)
- [x] Verify full flow in browser: direct visit redirects to /checkout, Purchase fires once per submission, refresh deduped via localStorage transaction ID
- [x] Report: duplicate Purchase is Meta-side Event Setup Tool rule — user must delete it in Events Manager
