# Roadmap

- [ ] Gate /thank-you: reachable only after successful submission (client-side guard + empty render until verified)
- [ ] Audit codebase for duplicate Purchase/fbq triggers — confirm exactly one Purchase implementation
- [ ] Report to user: duplicate Purchase comes from Meta Event Setup Tool rule (Meta-side), must be removed in Events Manager; code keeps single manual Purchase
- [ ] Verify full flow in browser: direct visit redirects, one Purchase per submission, none on refresh
