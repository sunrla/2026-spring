# SkinLoop Demo Guide

This guide is designed for a 5-7 minute school final presentation.

## Presentation Goal

Show that SkinLoop is more than a static skincare prototype. It is a complete local-first MVP that connects user input, product data, ingredient tags, weekly logs, routine guidance, progress tracking, and brand business storytelling.

Safe positioning:

> SkinLoop은 스킨케어 루틴 관찰과 제품 제안 보조를 위한 참고 정보 플랫폼이며, 의학적 진단이나 치료를 제공하지 않습니다.

## 5-7 Minute Flow

| Step | What To Click | What To Say | Why It Matters For Grading |
| --- | --- | --- | --- |
| 1. Landing page | Open `/` | "SkinLoop is a local-first skincare routine observation MVP. It helps users organize survey data, current products, ingredients, logs, and routine guidance." | Shows completeness and clear product positioning. |
| 2. Seed demo data | Click `데모 데이터 채우기` | "For presentation reliability, I can seed realistic local demo data instead of starting from an empty browser." | Shows demo readiness and practical execution. |
| 3. Survey profile | Go to `/survey` | "The survey captures dryness, oiliness, sensitivity, redness, breakout tendency, and the main skincare goal." | Shows the onboarding foundation and user data model. |
| 4. Product registration and autofill | Go to `/products`, search terms like `크림` or `토너` | "Users can search a local sample catalog and autofill brand, category, ingredient text, and confidence labels. Manual entry still works." | Shows creativity, UX polish, and product data handling. |
| 5. Ingredient tag explanations | Stay on `/products` and review parsed tags | "Ingredient text is split by commas. Mock rules detect tags, and explanation cards show which ingredients triggered each tag." | Shows difficulty and explainability, not just a visual prototype. |
| 6. Routine risk analysis | Go to `/analysis` | "The analysis combines survey profile, products, ingredient tags, and logs to produce a possibility-based routine risk reference." | Shows integrated logic and safe wording. |
| 7. Routine recommendation | Go to `/recommendation` | "This is not connected to a real AI API yet. It uses local rule-based logic to generate morning, evening, avoid/observe, and 1-week observation guidance." | Shows implementation complexity and responsible AI positioning. |
| 8. Weekly logs and dashboard | Go to `/logs`, then `/dashboard` | "Weekly logs capture skin scores, sleep, stress, breakout count, and memo. The dashboard turns 4 weeks of logs into simple trend cards and bars." | Shows end-to-end loop and progress tracking. |
| 9. Brand/admin insights | Go to `/admin` | "The same user flow can become a brand-facing B2B2C insight dashboard for concerns, category demand, ingredient tag signals, funnel ideas, and business model cards." | Shows business potential and final project storytelling. |
| 10. Close with limitations | End on `/admin` or `/` | "This MVP is localStorage-only, uses mock data and mock rules, and does not provide medical diagnosis or treatment. Future work would add consent, backend, evidence references, and safe AI integration." | Shows honest scope control and future vision. |

## Suggested Timing

- 0:00-0:40 Landing and problem
- 0:40-1:10 Demo data seed
- 1:10-2:20 Survey and product registration
- 2:20-3:20 Ingredient tags and explanations
- 3:20-4:20 Analysis and recommendation
- 4:20-5:20 Logs and dashboard
- 5:20-6:30 Brand/admin insights and business model
- 6:30-7:00 Limitations and future expansion

## Key Lines To Say

- "SkinLoop changed from a simple survey prototype into a routine experiment platform."
- "The result is based on user-entered information, not medical judgment."
- "Ingredient tags are explainable because the card shows matched ingredients and rule meaning."
- "The recommendation engine is local and rule-based for this MVP."
- "The brand page explains how this could become a B2B2C widget."
- "The project is demo-ready because local data can be seeded and reset safely."

## Grading Angle

Completeness:

- The app has onboarding, products, ingredients, analysis, recommendation, logs, dashboard, and admin views.

Creativity:

- It connects consumer skincare tracking with brand insight storytelling.

Difficulty:

- It includes localStorage persistence, product autofill, parsing, rule tagging, explanation cards, recommendation logic, and dashboard aggregation.

Business Potential:

- It can expand into brand SaaS, product-page widget, sample request flow, and consent-based customer insight reports.

Safety:

- The app uses routine observation language and does not provide medical diagnosis or treatment.
