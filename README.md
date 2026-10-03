# Pour Decisions

**It's What's Inside That Counts.** A small, whimsical coffee app made from what’s already in your cupboard.

## Run and build

Requires Node 22 or newer.

```sh
npm ci
npm run dev
npm test
npm run build
```

Development opens `app.html`. The React 19 + TypeScript source lives in `src/`; TanStack Router content routes live in `src/routes/index.tsx` and `src/routes/decisions.tsx`, with route-specific `head()` metadata. Tailwind v4 is compiled by Vite. Fraunces and Outfit are loaded by the root route using link tags.

The production app is entirely static. `dist/` contains the complete build. GitHub Pages is configured to serve main from the repository root, so the matching built `index.html`, `404.html`, `decisions/index.html`, and `build-assets/` files are committed there too. Run the build and copy the contents of `dist/` to the repository root when publishing changes. Preserve source files. The default base is `/pourdecisions/`; set `PD_BASE=/` to build for a root-domain host.

## V1

- Scan: real camera/upload input, client-side JPEG compression, photo previews, and an explicitly labeled **demo recognition** result. No live image recognition or photo upload to a server.
- Manual entry: category chips, suggested ingredients, free text, case-insensitive duplicate prevention.
- Review: editable names, touch-friendly removal, clear everything.
- Five 0–100 taste sliders and Hot / Iced / Surprise Me.
- Recipes with quantities, instructions, and playful names.
- Finish: optional photo; Pour Decision keeps that exact drink, Bad Decision discards it.
- Save, share, and revisit your collection; expand cards to view recipe and taste settings; delete saved drinks.
- Floating latte artwork, cozy cream/caramel palette, reduced-motion support.

## Storage

`pd-inv` holds inventory; `pd-decisions` holds saved decisions. `pd-draft` preserves current taste, temperature choice, recipe, photo, verdict screen, and saved ID across refreshes. `pd-scan` holds compressed scan previews. Photos have a maximum dimension of 640 pixels and are encoded as JPEG at quality 0.7. Everything stays in this browser. No accounts, backend, or cross-device sync. Storage failures are caught; a failed decision save prompts a retry without a photo. Browser clearing removes local data.

First use seeds seven demo ingredients unless older Pour Decisions ingredients are available to migrate. Clearing the cupboard saves an empty array, so it stays empty on reload. Scanning adds only the four sample items that are not already present.

Recipe rules are local, not AI. Water/ice are kitchen basics; pump sizes and product sweetness vary. Use product and machine instructions for preparing a base. Keep the experience simple and playful.

## Checks

`npm run build` typechecks and compiles. `npm test` checks recipe thresholds, quantities, ordering, inventory deduplication, migration, clear/reload behavior, and malformed storage. Physical camera testing still needs a phone/tablet.
