# Roadmap

- [x] Gate /thank-you: reachable only after successful submission (beforeLoad + client guard, empty render until verified)
- [x] Audit codebase for duplicate Purchase/fbq triggers — exactly one Purchase implementation (src/lib/meta-pixel.ts → thank-you.tsx)
- [x] Verify full flow in browser: direct visit redirects to /checkout, Purchase fires once per submission, refresh deduped via localStorage transaction ID
- [x] Report: duplicate Purchase is Meta-side Event Setup Tool rule — user must delete it in Events Manager

## La Esthetique clinic website
- [ ] Build single-page clinic site at /la-esthetique (hero, about, treatments, featured, why, journey, gallery, reviews, FAQ, contact, location, footer)
- [ ] Brand tokens in styles.css (ivory/neutral, easy to re-theme when logo provided)
- [ ] Placeholder imagery, easy-to-replace asset structure
- [ ] Sticky mobile CTA (Call / WhatsApp / Book), WhatsApp prefilled message
- [ ] SEO head: title, meta, LocalBusiness/MedicalBusiness JSON-LD
- [ ] Verify build + browser check
