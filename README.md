# t3-ui

A shadcn/ui registry of the Base UI component set extracted from [T3 Code](https://github.com/t3-oss/t3code)'s web app (`apps/web/src/components/ui`, source commit `22e94c37` of the Neonity2020 fork).

Same architecture as upstream T3 Code: **Base UI** primitives (not Radix), React 19 function components, Tailwind CSS v4 (CSS-first), cva variants + tailwind-merge, lucide-react icons.

## Components

39 registry items: `alert`, `alert-dialog`, `autocomplete`, `badge`, `button`, `calendar`, `checkbox`, `closing-positioner`, `collapsible`, `color-picker`, `combobox`, `command`, `dialog`, `dialog-styles`, `empty`, `group`, `input`, `input-group`, `kbd`, `label`, `menu`, `middle-truncate`, `number-field`, `popover`, `preview-card`, `qr-code`, `radio-group`, `scroll-area`, `select`, `separator`, `sheet`, `skeleton`, `spinner`, `switch`, `table`, `textarea`, `toggle`, `toggle-group`, `tooltip` — plus the `theme` item.

Not extracted (app-coupled in T3 Code): `toast` (wired to app stores), `sidebar` (app hooks), `wizard`, `standalone-page`, `discovery-list`, `draft-input`.

## Using in another project

Requires Tailwind CSS v4 and React 19. Add the registry to your `components.json`:

```json
{
  "registries": {
    "@t3ui": "https://<host>/r/{name}.json"
  }
}
```

Then install the theme first, and import it from your tailwind css entry (the file `src/index.css` in this example):

```sh
npx shadcn add @t3ui/theme
```

```css
@import "tailwindcss";
@import "./components/theme.css";
```

After that, add components normally:

```sh
npx shadcn add @t3ui/button @t3ui/dialog @t3ui/menu
```

Components land in your own `components/ui` and are yours to edit. Imports are rewritten to your aliases (`@/components/ui/...`, `@/lib/utils`) at install time, and cross-component dependencies are pulled in automatically (e.g. `dialog` brings `button`, `scroll-area`, `dialog-styles`).

Notes:

- Dark mode is class-based: add `.dark` to `<html>`.
- Fonts are not shipped; the components inherit whatever your `--font-sans`/`--font-mono` tokens resolve to.
- `Badge variant="label"` reads a `--label` custom property that the consumer sets inline per badge (e.g. `style={{ "--label": "var(--color-purple-500)" }}`).
- `--thread-details-panel-width` has a default here; T3 Code's popover sheet variant overrides it from the app layout.

## Hosting the registry

`public/r/` holds the built registry JSON (40 items + `registry.json` catalog). Serve it from any static host:

```sh
pnpm build:registry   # regenerate public/r from registry.json
pnpm dev              # demo gallery at http://localhost:5173, registry at /r/
```

For production, upload `public/` to any static host (GitHub Pages, Vercel, a bucket) and point the `@t3ui` registry URL at it.

## Repo layout

- `registry/default/ui/` — component sources (distributed verbatim)
- `registry/default/lib/` — `cn` and the small helpers components import (`window-controls-overlay`, `visible-animation`, `observe-resize`, `qrcode-generator` (vendored Nayuki, MIT), `color`)
- `registry/default/styles/theme.css` — generated design tokens; rendered by the generator, imported by the demo
- `registry.json` — generated registry index
- `scripts/generate-registry.mjs` — single source for `registry.json` + `theme.css`; edit tokens/components here, then run `node scripts/generate-registry.mjs && pnpm build:registry`
- `src/` — demo gallery rendering every component (light/dark via `?theme=dark`)

## Shadcn CLI quirks this registry works around

- Theme ships as a `registry:file` css file, not `registry:theme` cssVars: the CLI re-serializes theme css and mangles `@custom-variant` preludes, and its cssVars path only generates `bg-*`/`text-*` utilities for values of the form `var(--color-*)`.
- `@custom-variant` uses the block form with `@slot;` for the same reason.
- Internal `registryDependencies` are namespaced (`@t3ui/dialog`); bare names resolve against the official shadcn registry first.
- The lib file is `qrcode-generator.ts`, not `qr-code.ts`, so the CLI does not rewrite the component's import onto itself.
