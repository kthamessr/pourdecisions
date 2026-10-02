# Pour Decisions

**It’s what’s inside that counts.** A coffee app that starts with ingredients you already have.

## Run locally

No installation or build step is required. From this directory:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Serve the files over HTTP because the app uses JavaScript modules.

## Working foundation

- Opening screen and mobile-friendly navigation.
- **What’s the scoop?**: ingredient-scanning placeholder; no camera or upload yet.
- **I Got it**: manual ingredient entry by category.
- **Look Right?**: review/remove ingredients and confirm with **That’s It**.
- **Something’s missing**: add items to the same ingredient list.
- **What’s Your Mood?**: placeholder for the next stage.
- Browser Back/Forward and direct hash links work.

Ingredients live in memory and reset when the page reloads. No accounts, backend, photo recognition, storage, mood controls, or recipe generation are included yet.

## Structure

- `index.html`: app shell and shared navigation.
- `src/app.js`: routes, screens, ingredient state, and event handlers.
- `src/styles.css`: responsive styling.

Extend `screens` in `src/app.js` to add flows. Replace the scan placeholder when image processing is ready; add storage separately if ingredients should survive reloads. User-entered ingredient text is escaped before rendering.
