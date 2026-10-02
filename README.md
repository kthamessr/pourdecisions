# Pour Decisions

**It’s what’s inside that counts.** Make coffee drinks from ingredients you already have.

## Run locally

No install or build step. Run `python3 -m http.server 8000` from this folder, then open http://localhost:8000.

## What works

- Opening screen with an animated custom cup.
- Manual ingredient entry, editing, removal, and review.
- Ingredients saved in this browser using localStorage, including changes and removals.
- Mood choices: hot/iced, no added syrup/lightly sweet/sweet, regular/bold.
- Select a coffee or espresso base and optional syrup, creamer/milk, and topping.
- Make a Pour Decision: local recipe rules produce ingredient amounts and preparation steps.
- Browser Back/Forward and direct hash links.

Recipes are starting points, not AI output. Only selected inventory products are used; water and ice are assumed kitchen basics. Product sweetness varies. A coffee or espresso base is required. Ingredients stay on this browser/device; clearing site data clears them. Storage failures display a message and leave the current session usable. Mood and generated recipes reset on reload. Photo scanning remains a placeholder. No accounts, backend, or cloud sync.

## Extend

`index.html` is the shell; `src/app.js` handles routes, forms, and inventory storage; `src/recipes.js` contains the recipe rules; `src/styles.css` styles the app; `assets/` holds the cup artwork.
