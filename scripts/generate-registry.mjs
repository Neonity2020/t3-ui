// Generates registry.json and registry/default/styles/theme.css from single-source data.
//
// - UI items: scanned from registry/default/ui; each ships its component file plus
//   every registry/default/lib file it imports (the shadcn CLI rewrites those imports
//   into the consumer's aliases on install).
// - Theme item: emitted as cssVars (light/dark token maps) + css (variants, theme
//   blocks, glass utilities), which the CLI merges into the consumer's tailwind css.
//   The same data also renders registry/default/styles/theme.css for the demo site.
import fs from "node:fs";
import path from "node:path";

const UI = "registry/default/ui";
const LIB = "registry/default/lib";
const REGISTRY_NS = "@t3ui";

// ---------------------------------------------------------------------------
// Theme tokens (extracted from T3 Code apps/web/src/index.css)
// ---------------------------------------------------------------------------

const themeCssVars = {
  light: {
    // Contrast-adjustment knobs: components derive foreground/border colors
    // through --contrast-*, mixing toward --appearance-contrast-target.
    "--appearance-contrast-base": "100%",
    "--appearance-contrast-boost": "0%",
    "--appearance-contrast-border-boost": "0%",
    "--appearance-contrast-target": "black",
    "--background": "var(--color-zinc-25)",
    "--foreground": "var(--color-zinc-900)",
    "--card": "var(--color-white)",
    "--card-foreground": "var(--color-zinc-900)",
    "--popover": "var(--color-white)",
    "--popover-foreground": "var(--color-zinc-900)",
    "--primary": "oklch(0.488 0.217 264)",
    "--primary-foreground": "var(--color-white)",
    "--secondary": "var(--color-zinc-50)",
    "--secondary-foreground": "var(--color-zinc-800)",
    "--muted": "var(--color-zinc-50)",
    "--muted-foreground": "var(--color-zinc-500)",
    // Values must reference --color-* tokens: the shadcn CLI only generates
    // --color-* theme mappings (and thus bg-*/text-* utilities) for those.
    "--placeholder": "var(--color-zinc-500)",
    "--secondary-label": "var(--color-zinc-500)",
    "--icon-muted": "var(--color-zinc-500)",
    "--accent": "var(--color-zinc-100)",
    "--accent-foreground": "var(--color-zinc-900)",
    "--error": "var(--color-red-500)",
    "--error-foreground": "var(--color-red-700)",
    "--error-surface": "color-mix(in srgb, var(--error) 8%, transparent)",
    "--destructive": "var(--color-red-500)",
    "--destructive-foreground": "var(--color-red-700)",
    "--border": "var(--color-zinc-200)",
    "--input": "var(--color-zinc-300)",
    "--ring": "var(--primary)",
    "--info": "var(--color-blue-500)",
    "--info-foreground": "var(--color-blue-700)",
    "--success": "var(--color-emerald-500)",
    "--success-foreground": "var(--color-emerald-700)",
    "--warning": "var(--color-amber-500)",
    "--warning-foreground": "var(--color-amber-700)",
    "--warning-surface": "color-mix(in srgb, var(--warning) 8%, transparent)",
    // Compact UI geometry. Keep these values semantic so tooltip, menu, and
    // control geometry cannot quietly drift apart.
    "--control-radius": "0.5rem",
    "--command-shell-inset": "0.5rem",
    "--command-content-inset": "1rem",
    "--z-sheet": "46",
    "--thread-details-panel-width": "17.5rem",
    "--app-scrollbar-thumb": "rgb(217 217 217)",
    "--app-scrollbar-thumb-hover": "rgb(191 191 191)",
    "--glass-blur": "12px",
    "--glass-opacity": "80%",
    "--glass-saturation": "1.14",
    // Contrast derivations.
    "--contrast-foreground":
      "color-mix(in oklab, color-mix(in oklab, var(--foreground) var(--appearance-contrast-base), var(--background)), var(--appearance-contrast-target) var(--appearance-contrast-boost))",
    "--contrast-muted-foreground":
      "color-mix(in oklab, color-mix(in oklab, var(--muted-foreground) var(--appearance-contrast-base), var(--background)), var(--appearance-contrast-target) var(--appearance-contrast-boost))",
    "--contrast-placeholder":
      "color-mix(in oklab, color-mix(in oklab, var(--placeholder) var(--appearance-contrast-base), var(--background)), var(--appearance-contrast-target) var(--appearance-contrast-boost))",
    "--contrast-secondary-label":
      "color-mix(in oklab, color-mix(in oklab, var(--secondary-label) var(--appearance-contrast-base), var(--background)), var(--appearance-contrast-target) var(--appearance-contrast-boost))",
    "--contrast-icon-muted":
      "color-mix(in oklab, color-mix(in oklab, var(--icon-muted) var(--appearance-contrast-base), var(--background)), var(--appearance-contrast-target) var(--appearance-contrast-boost))",
    "--contrast-card-foreground":
      "color-mix(in oklab, color-mix(in oklab, var(--card-foreground) var(--appearance-contrast-base), var(--card)), var(--appearance-contrast-target) var(--appearance-contrast-boost))",
    "--contrast-popover-foreground":
      "color-mix(in oklab, color-mix(in oklab, var(--popover-foreground) var(--appearance-contrast-base), var(--popover)), var(--appearance-contrast-target) var(--appearance-contrast-boost))",
    "--contrast-accent-foreground":
      "color-mix(in oklab, color-mix(in oklab, var(--accent-foreground) var(--appearance-contrast-base), var(--accent)), var(--appearance-contrast-target) var(--appearance-contrast-boost))",
    "--contrast-secondary-foreground":
      "color-mix(in oklab, color-mix(in oklab, var(--secondary-foreground) var(--appearance-contrast-base), var(--secondary)), var(--appearance-contrast-target) var(--appearance-contrast-boost))",
    "--contrast-input":
      "color-mix(in srgb, color-mix(in srgb, var(--input) var(--appearance-contrast-base), transparent), var(--foreground) var(--appearance-contrast-border-boost))",
    "--contrast-border":
      "color-mix(in srgb, color-mix(in srgb, var(--border) var(--appearance-contrast-base), transparent), var(--foreground) var(--appearance-contrast-border-boost))",
  },
  dark: {
    // True black canvas. Raised surfaces keep their tone so cards and popovers
    // lift; borders and hover states provide separation.
    "--appearance-contrast-target": "white",
    "--background": "#000",
    "--foreground": "var(--color-neutral-100)",
    "--card": "color-mix(in srgb, var(--color-neutral-950) 97%, var(--color-white))",
    "--card-foreground": "var(--color-neutral-100)",
    "--popover": "color-mix(in srgb, var(--color-neutral-950) 97%, var(--color-white))",
    "--popover-foreground": "var(--color-neutral-100)",
    "--primary": "oklch(0.571 0.21 264)",
    "--secondary": "oklch(1 0 0 / 3%)",
    "--secondary-foreground": "var(--color-neutral-100)",
    "--muted": "oklch(1 0 0 / 3%)",
    "--muted-foreground": "var(--color-neutral-400)",
    "--accent": "oklch(1 0 0 / 4%)",
    "--accent-foreground": "var(--color-neutral-100)",
    "--error": "color-mix(in srgb, var(--color-red-500) 90%, var(--color-white))",
    "--error-foreground": "var(--color-red-400)",
    "--error-surface": "color-mix(in srgb, var(--error) 16%, transparent)",
    "--destructive": "color-mix(in srgb, var(--color-red-500) 90%, var(--color-white))",
    "--destructive-foreground": "var(--color-red-400)",
    "--placeholder": "var(--color-neutral-400)",
    "--secondary-label": "var(--color-neutral-400)",
    "--icon-muted": "var(--color-neutral-400)",
    "--border": "oklch(1 0 0 / 8%)",
    "--input": "oklch(1 0 0 / 11%)",
    "--info-foreground": "var(--color-blue-400)",
    "--success-foreground": "var(--color-emerald-400)",
    "--warning-foreground": "var(--color-amber-400)",
    "--warning-surface": "color-mix(in srgb, var(--warning) 16%, transparent)",
    "--app-scrollbar-thumb": "rgb(255 255 255 / 8%)",
    "--app-scrollbar-thumb-hover": "rgb(255 255 255 / 12%)",
    "--glass-blur": "16px",
    "--glass-saturation": "1.08",
  },
};

const themeCss = {
  // Block form: the shadcn CLI's file round-trip turns the paren form
  // `@custom-variant dark (&:is(...))` into an invalid `dark:` prelude.
  "@custom-variant dark": {
    "&:is(.dark, .dark *)": "@slot",
  },
  "@custom-variant light": {
    "&:not(.dark, .dark *)": "@slot",
  },
  "@theme": {
    // system-ui first: the shadcn CLI's css updater cannot parse values whose
    // first token starts with "-" or a quote.
    "--font-sans":
      'system-ui, "Inter Variable", "Segoe UI", BlinkMacSystemFont, sans-serif',
    "--font-mono":
      'ui-monospace, "SF Mono", "SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace',
  },
  "@theme inline": {
    // Two steps below Tailwind's text-xs (12px) for dense UI. Registered with
    // tailwind-merge in lib/utils.ts so cn() treats them as font sizes.
    "--text-2xs": "0.6875rem",
    "--text-2xs--line-height": "calc(1 / 0.6875)",
    "--text-3xs": "0.625rem",
    "--text-3xs--line-height": "calc(0.875 / 0.625)",
    "--text-4xs": "0.5rem",
    "--text-4xs--line-height": "1",
    "--text-5xs": "0.4375rem",
    "--text-5xs--line-height": "1",
    "--color-zinc-25": "oklch(99.2% 0 0)",
    "--animate-skeleton": "skeleton 2.4s infinite",
    "@keyframes skeleton": {
      // One opacity pulse per container, stepped so the compositor draws a
      // handful of discrete frames per cycle instead of one per vsync.
      "0%, 42%": { opacity: "1", "animation-timing-function": "steps(4)" },
      "50%, 92%": { opacity: "0.55", "animation-timing-function": "steps(4)" },
      "100%": { opacity: "1" },
    },
    "--color-background": "var(--background)",
    "--color-foreground": "var(--contrast-foreground)",
    "--color-card": "var(--card)",
    "--color-card-foreground": "var(--contrast-card-foreground)",
    "--color-popover": "var(--popover)",
    "--color-popover-foreground": "var(--contrast-popover-foreground)",
    "--color-primary": "var(--primary)",
    "--color-primary-foreground": "var(--primary-foreground)",
    "--color-secondary": "var(--secondary)",
    "--color-secondary-foreground": "var(--contrast-secondary-foreground)",
    "--color-muted": "var(--muted)",
    "--color-muted-foreground": "var(--contrast-muted-foreground)",
    "--color-placeholder": "var(--contrast-placeholder)",
    "--color-secondary-label": "var(--contrast-secondary-label)",
    "--color-icon-muted": "var(--contrast-icon-muted)",
    "--color-accent": "var(--accent)",
    "--color-accent-foreground": "var(--contrast-accent-foreground)",
    "--color-destructive": "var(--destructive)",
    "--color-destructive-foreground": "var(--destructive-foreground)",
    "--color-error": "var(--error)",
    "--color-error-foreground": "var(--error-foreground)",
    "--color-error-surface": "var(--error-surface)",
    "--color-warning": "var(--warning)",
    "--color-warning-foreground": "var(--warning-foreground)",
    "--color-warning-surface": "var(--warning-surface)",
    "--color-success": "var(--success)",
    "--color-success-foreground": "var(--success-foreground)",
    "--color-info": "var(--info)",
    "--color-info-foreground": "var(--info-foreground)",
    "--color-border": "var(--contrast-border)",
    "--color-input": "var(--contrast-input)",
    "--color-ring": "var(--ring)",
    "--radius-sm": "calc(var(--radius) - 4px)",
    "--radius-md": "calc(var(--radius) - 2px)",
    "--radius-lg": "var(--radius)",
    "--radius-xl": "calc(var(--radius) + 4px)",
    "--radius-2xl": "calc(var(--radius) + 8px)",
    "--radius-3xl": "calc(var(--radius) + 12px)",
  },
  "@utility surface-glass": {
    background: "color-mix(in srgb, var(--background) var(--glass-opacity), transparent)",
    "-webkit-backdrop-filter": "blur(var(--glass-blur)) saturate(var(--glass-saturation))",
    "backdrop-filter": "blur(var(--glass-blur)) saturate(var(--glass-saturation))",
    '@supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px)))': {
      background: "var(--background) !important",
    },
  },
  "@utility alert-glass": {
    "--alert-glass-tint": "transparent",
    background:
      "linear-gradient(color-mix(in srgb, var(--alert-glass-tint) 4%, transparent), color-mix(in srgb, var(--alert-glass-tint) 4%, transparent)), color-mix(in srgb, var(--background) var(--glass-opacity), transparent) !important",
    "-webkit-backdrop-filter": "blur(var(--glass-blur)) saturate(var(--glass-saturation))",
    "backdrop-filter": "blur(var(--glass-blur)) saturate(var(--glass-saturation))",
    '&[data-variant="error"]': { "--alert-glass-tint": "var(--destructive)" },
    '&[data-variant="info"]': { "--alert-glass-tint": "var(--info)" },
    '&[data-variant="success"]': { "--alert-glass-tint": "var(--success)" },
    '&[data-variant="warning"]': { "--alert-glass-tint": "var(--warning)" },
    '@supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px)))': {
      background: "var(--background) !important",
    },
  },
  "@utility dialog-glass": {
    background: "color-mix(in srgb, var(--background) var(--glass-opacity), transparent)",
    "-webkit-backdrop-filter": "blur(var(--glass-blur)) saturate(var(--glass-saturation))",
    "backdrop-filter": "blur(var(--glass-blur)) saturate(var(--glass-saturation))",
    "border-color": "color-mix(in srgb, var(--contrast-foreground) 10%, transparent)",
    "box-shadow": "0 24px 64px -24px rgb(0 0 0 / 65%)",
    "@variant dark": {
      "border-color": "color-mix(in srgb, var(--color-white) 8%, transparent)",
      "box-shadow":
        "inset 0 1px rgb(255 255 255 / 4%), 0 24px 72px -20px rgb(0 0 0 / 90%)",
    },
    '@supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px)))': {
      background: "var(--popover) !important",
    },
  },
  "@utility dialog-backdrop": {
    background: "color-mix(in srgb, var(--background) 60%, transparent)",
    "-webkit-backdrop-filter": "blur(4px)",
    "backdrop-filter": "blur(4px)",
    "@variant dark": {
      background: "color-mix(in srgb, var(--background) 64%, transparent)",
    },
  },
  "@utility dropdown-glass": {
    background:
      "color-mix(in srgb, var(--popover) 18%, color-mix(in srgb, var(--popover) var(--glass-opacity), transparent))",
    "-webkit-backdrop-filter": "blur(var(--glass-blur)) saturate(var(--glass-saturation))",
    "backdrop-filter": "blur(var(--glass-blur)) saturate(var(--glass-saturation))",
    border: "1px solid color-mix(in srgb, var(--contrast-foreground) 10%, transparent)",
    '@supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px)))': {
      background: "var(--popover) !important",
    },
  },
  "@utility visible-animate-spin": {
    animation: "var(--animate-spin)",
    // Play state and will-change are driven by observeVisibleAnimation(), so
    // offscreen spinners cost nothing.
    "animation-play-state": "var(--visible-animation-state, paused)",
    "will-change": "var(--visible-animation-will-change, auto)",
  },
};

// The shadcn CLI expects cssVars keys without the leading "--".
function stripDashes(vars) {
  return Object.fromEntries(Object.entries(vars).map(([k, v]) => [k.replace(/^--/, ""), v]));
}

function cssText(key, value, indent = "") {
  // "@slot" as a value means a block containing Tailwind's `@slot;` keyword.
  if (value === "@slot") return `${indent}${key} {\n${indent}  @slot;\n${indent}}\n`;
  if (typeof value === "string") return `${indent}${key}: ${value};\n`;
  let out = `${indent}${key} {\n`;
  for (const [k, v] of Object.entries(value)) out += cssText(k, v, `${indent}  `);
  return `${out}${indent}}\n`;
}

function renderThemeCss() {
  let out = `/* t3-ui theme — extracted from T3 Code (apps/web/src/index.css).
   Generated by scripts/generate-registry.mjs; edit the tokens there.
   Requires Tailwind CSS v4; import after "tailwindcss".
   Dark mode is class-based: add ".dark" to <html>.
   Consumer-provided variables: --label (Badge variant="label" reads it; set it inline per badge). */

`;
  out += ":root {\n  color-scheme: light;\n";
  out += cssText("--radius", "0.5rem", "  ");
  for (const [k, v] of Object.entries(themeCssVars.light)) out += cssText(k, v, "  ");
  out += "\n  @variant dark {\n    color-scheme: dark;\n";
  for (const [k, v] of Object.entries(themeCssVars.dark)) out += cssText(k, v, "    ");
  out += "  }\n}\n\n";
  for (const [k, v] of Object.entries(themeCss)) out += cssText(k, v);
  return out;
}

fs.mkdirSync("registry/default/styles", { recursive: true });
fs.writeFileSync(
  "registry/default/styles/theme.css",
  renderThemeCss(),
);

// ---------------------------------------------------------------------------
// UI items
// ---------------------------------------------------------------------------

const libFiles = fs.readdirSync(LIB);
const uiFiles = fs.readdirSync(UI).filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"));

const npmDeps = new Map([
  ["class-variance-authority", "class-variance-authority"],
  ["tailwind-merge", "tailwind-merge"],
  ["lucide-react", "lucide-react"],
]);

function collectImports(content) {
  const imports = [];
  const re = /from\s+"([^"]+)"/g;
  let m;
  while ((m = re.exec(content))) {
    imports.push(m[1]);
  }
  return imports;
}

const items = [
  {
    name: "theme",
    type: "registry:theme",
    title: "t3-ui theme",
    description: "Design tokens, dark mode variant and glass utilities extracted from T3 Code. After installing, import it from your tailwind css: @import \"./components/theme.css\";",
    // registry:file, not registry:theme: the CLI re-serializes registry:theme css
    // files and mangles @custom-variant into an invalid form. registry:file copies
    // the css verbatim.
    files: [{ path: "registry/default/styles/theme.css", type: "registry:file", target: "@components/theme.css" }],
  },
];

for (const file of uiFiles.sort()) {
  const name = file.replace(/\.tsx?$/, "");
  const content = fs.readFileSync(path.join(UI, file), "utf8");
  const imports = collectImports(content);

  const dependencies = new Set();
  const registryDependencies = new Set();
  const includedLibs = new Set();

  for (const spec of imports) {
    if (spec.startsWith("@/registry/default/ui/")) {
      registryDependencies.add(`${REGISTRY_NS}/${spec.replace("@/registry/default/ui/", "")}`);
    } else if (spec.startsWith("@/registry/default/lib/")) {
      includedLibs.add(`${spec.replace("@/registry/default/lib/", "")}.ts`);
      if (spec.endsWith("/utils")) {
        dependencies.add("class-variance-authority");
        dependencies.add("tailwind-merge");
      }
    } else if (spec.startsWith("react")) {
      // peer dependency, not listed
    } else if (spec.startsWith("@base-ui/react")) {
      dependencies.add("@base-ui/react");
    } else if (spec.startsWith("@daypicker")) {
      dependencies.add("@daypicker/react");
    } else if (npmDeps.has(spec)) {
      dependencies.add(npmDeps.get(spec));
    } else {
      throw new Error(`${file}: unhandled import "${spec}"`);
    }
  }

  const files = [{ path: `${UI}/${file}`, type: "registry:ui" }];
  for (const lib of [...includedLibs].sort()) {
    if (!libFiles.includes(lib)) throw new Error(`${file}: missing lib file ${lib}`);
    files.push({ path: `${LIB}/${lib}`, type: "registry:lib" });
  }

  items.push({
    name,
    type: "registry:ui",
    dependencies: [...dependencies].sort(),
    registryDependencies: [...registryDependencies].sort(),
    files,
  });
}

fs.writeFileSync(
  "registry.json",
  `${JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "t3ui",
      homepage: "https://github.com/Neonity2020/t3-ui",
      items,
    },
    null,
    2,
  )}\n`,
);

console.log(`registry.json: ${items.length} items (${uiFiles.length} ui + theme); theme.css rendered`);
