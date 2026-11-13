# AB Bespoke Home

Astro redesign of AB Bespoke Home's existing Sacramento contractor website.

## Local development

Use Node.js 22. Run `npm ci`, then `npm run dev`. `npm run build` generates the static site in `dist`.

## Netlify

Import `gerardo-adg/AB-Bespoke-Home`, deploy `main`, build with `npm run build`, publish `dist`. The settings are included in `netlify.toml`.

## Pages and content

19 pages: homepage, five services, portfolio, five project stories, team, process, service overview, guarantee, remodel-planning guide, contact, and confirmation.

Owner-written copy is stored in `src/data/original.json`, captured from the current ab-bespoke.com pages. Presentation markup and internal link destinations are adapted without rewriting the paragraphs. The homepage hero is centered. Shared design and reduced-motion-aware animations live in `src/styles/site.css` and `src/scripts/site.ts`.

## Before final launch

- This design remains `noindex` until approved for launch.
- Enable Netlify Forms detection and configure submission notifications, then test delivery. The form uses the original field labels and project description. Off Netlify/custom production domains, the preview opens an email draft and does not report a submitted inquiry.
- Home assets are bundled; additional project photos use the client's existing Squarespace CDN URLs. Migrate these assets before retiring Squarespace hosting.
- Insights links to the existing blog. Its articles have not been migrated.
- Original copy has inconsistencies retained for owner review: homepage preconstruction says 6–8 weeks, the process page says 1–6 months; the University project text includes Blackmer/Rio Del Oro references; some addition copy says bathroom. No silent editorial changes were made.

## Validation

Production build passes. All internal page links resolve. Original source paragraphs were compared against the generated pages. Desktop homepage and service layouts were visually inspected; live Netlify submission delivery still requires testing.

Client photos and branding are used for this project. No third-party reuse license is granted.
