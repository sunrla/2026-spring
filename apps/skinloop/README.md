# SkinLoop

SkinLoop is a local-first Next.js MVP for an evidence-structured skincare routine observation and product-fit reference platform.

## Problem Statement

Many skincare users try new products without a clear way to record their current routine, ingredient signals, and weekly skin condition changes together. This makes it hard to explain why a routine feels better or worse over time, and it also makes product recommendations feel vague.

SkinLoop helps users organize their routine experiment in one place:

- What is my current skin profile?
- Which products am I using now?
- Which ingredient tags are visible from the ingredient text?
- What changed across weekly logs?
- What routine guidance can be generated from the information I entered?

SkinLoop does not make medical claims. It provides routine observation and reference information only.

## Final Pivot

The early project direction was closer to a simple survey-based skin diagnosis prototype. The final SkinLoop direction intentionally moved away from certainty-based diagnosis language and toward an evidence-structured routine experiment platform.

The final MVP focuses on:

- User-entered evidence: survey, products, ingredients, logs
- Explainable ingredient tags: what matched and why it matters for routine planning
- Local rule-based recommendations: no real AI API yet
- Safe language: possibility-based guidance, not certainty
- Business storytelling: how the same flow could become a B2B2C brand widget

## Core User Flow

1. Open the landing page.
2. Fill or seed a skin survey profile.
3. Register current skincare products.
4. Use product search/autofill or manually enter products.
5. Parse ingredient text into simple tags.
6. Review ingredient tag explanation cards.
7. Check routine risk analysis.
8. View local rule-based routine recommendations.
9. Add weekly skin logs.
10. Review progress dashboard.
11. Show brand/admin insight dashboard for business potential.

## Main Features

- Landing page with project positioning and safety copy
- Skin survey onboarding
- Current product registration
- Local mock product catalog search/autofill
- Ingredient text parsing by comma
- Mock ingredient rule tagging
- Ingredient tag explanation cards with matched ingredients
- Routine risk analysis
- Local rule-based routine recommendation v1
- Weekly skin log tracking
- Progress dashboard
- Brand/admin B2B2C insights dashboard
- Demo data seed/reset controls

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React
- Browser `localStorage`
- Mock local data only
- No backend
- No authentication
- No external API calls
- No real AI API connection

## How To Run Locally

From the SkinLoop app folder:

```bash
cd apps/skinloop
npm install
npm run dev
```

Then open the local URL shown by Next.js, usually:

```text
http://localhost:3000
```

Useful checks:

```bash
npm run typecheck
npm run build
```

## GitHub Pages Deployment

Expected deployed URL:

```text
https://sunrla.github.io/2026-spring/
```

Local development still runs without the `/2026-spring` path:

```bash
cd apps/skinloop
npm run dev
```

The GitHub Pages workflow builds the app with:

```bash
GITHUB_PAGES=true npm run build
```

That environment variable enables the GitHub Pages `basePath` and `assetPrefix` only during deployment.

## Demo Data Guide

The app includes local demo data controls for presentation reliability.

On the landing page or header:

1. Click `데모 데이터 채우기`.
2. The app seeds:
   - Skin survey profile
   - 3 registered products
   - 4 weekly skin logs
3. Navigate through products, analysis, recommendation, dashboard, and admin pages.
4. Click `로컬 데이터 초기화` to clear only SkinLoop local data.

Seeded localStorage keys:

- `skinloop.profile`
- `skinloop.products`
- `skinloop.weeklyLogs`

The reset control removes only these SkinLoop keys and does not clear unrelated browser storage.

## Safety And Legal Wording

SkinLoop is not a medical service.

Required positioning:

- This service is for skincare routine observation.
- Results are reference information.
- Recommendations are possibility-based.
- Ingredient tags are mock MVP rules.
- Product suggestions are support information, not certainty.
- `이 서비스는 의학적 진단이나 치료를 제공하지 않습니다.`

The app avoids language that claims it diagnoses, treats, cures, prevents disease, or confirms exact product suitability.

## Business Model Explanation

SkinLoop can be explained as a B2C routine observation tool and a future B2B2C brand widget.

For users:

- Organize routine experiments
- Understand ingredient tag signals
- Track weekly changes
- Receive local rule-based routine guidance

For brands or commerce operators:

- Understand common customer concerns
- See registered product category demand
- Identify ingredient tag signals that need clearer product-page copy
- Connect routine guidance to sample application or product-page CTA
- Use aggregated, consent-based insight reports in the future

Possible business model directions:

- Brand SaaS subscription
- Product-page conversion support widget
- Sample request lead collection
- Recommendation-to-commerce referral model
- Customer routine insight report

These are conceptual MVP directions, not real revenue claims.

## Current Limitations

- Data is stored only in browser localStorage.
- There is no backend database.
- There is no authentication.
- There is no real AI recommendation API.
- Ingredient rules are simplified MVP demo rules.
- Product catalog data is local sample data, not verified official product data.
- The admin page uses local data or clearly labeled sample fallback data.
- Results are not medical guidance.

## Future Expansion Ideas

- User accounts and secure cloud sync
- Consent-based data collection and deletion flow
- Real backend API and database
- Admin dashboard with anonymized aggregation
- More structured ingredient database
- Evidence references for ingredient/routine rules
- Optional AI assistant connected to safe prompts and guardrails
- Product-page widget for partner brands
- Sample request and post-sample follow-up flow
- Exportable routine progress report
