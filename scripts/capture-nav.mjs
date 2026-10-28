/**
 * Captures real screenshots of the navigation from the running dev server.
 *
 *   npm run dev            # in one terminal
 *   npm run capture:nav    # in another
 *
 * Writes 2x PNGs to public/nav-intro/ in both light and dark.
 *
 * Uses playwright-core driving the Chrome already installed on this machine —
 * no browser download. Chrome's own --screenshot flag can't run JS first, and
 * every piece of state we need (docked sub-nav, colour mode, the intro modal
 * being dismissed) lives in localStorage, so we seed it before first paint.
 */
import { chromium } from "playwright-core";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "nav-intro");
const PORTS = [5173, 5174, 5175];
const VIEWPORT = { width: 1440, height: 900 };

/**
 * Each shot is the whole viewport or one element, clipped to its box.
 * `hover` names a nav row to hover first — the pin control is opacity-0 until
 * then, so without it the affordance simply is not in the picture.
 */
const SHOTS = [
  { name: "shell", selector: null },
  { name: "shell-pin", selector: null, hover: "Experimentation" },
  { name: "nav", selector: "nav" },
  { name: "breadcrumb", selector: "header" },
];

/** Keep the capture in step with the modal's version instead of hardcoding it. */
async function readIntroVersion() {
  const src = await readFile(path.join(ROOT, "src/config/navIntro.ts"), "utf8");
  const match = src.match(/NAV_INTRO_VERSION\s*=\s*(\d+)/);
  if (!match) throw new Error("Could not read NAV_INTRO_VERSION from src/config/navIntro.ts");
  return Number(match[1]);
}

async function findDevServer() {
  const fromArg = process.argv.find((a) => a.startsWith("--url="));
  if (fromArg) return fromArg.slice("--url=".length);
  if (process.env.NAV_CAPTURE_URL) return process.env.NAV_CAPTURE_URL;

  for (const port of PORTS) {
    const url = `http://localhost:${port}`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
      if (res.ok) return url;
    } catch {
      // try the next port
    }
  }
  throw new Error(
    `No dev server on ports ${PORTS.join(", ")}. Start one with \`npm run dev\`, ` +
      `or pass --url=http://localhost:PORT`
  );
}

/** Zustand persist payloads, written before any app code runs. */
function seedState({ introVersion, colorMode }) {
  const put = (key, state) =>
    localStorage.setItem(key, JSON.stringify({ state, version: 0 }));

  // Intro modal already seen, so it never covers the shot
  put("wingify-nav-intro-v1", { seenVersion: introVersion });
  // Docked sub-nav, otherwise the product menu is only a hover flyout
  put("wingify-ui-v3", { isDocked: true });
  put("wingify-theme", { colorMode, colorModePreference: colorMode });
  // Plain workspace: no playground / trial / cancellation banners
  put("wingify-workspace-v2", { workspaceId: "delhi", oldNavReturnWorkspaceId: null });
  put("wingify-chrome-extension-banner", { collapsed: true });
}

async function capture(browser, { colorMode, introVersion, baseUrl }) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    colorScheme: colorMode,
    reducedMotion: "reduce",
  });

  await context.addInitScript(seedState, { introVersion, colorMode });

  const page = await context.newPage();
  await page.goto(`${baseUrl}/home/dashboard`, { waitUntil: "networkidle" });

  // The shell is up once the nav has rendered; then let fonts and the boot
  // splash settle so nothing is captured mid-fade.
  await page.waitForSelector("nav", { state: "visible", timeout: 15_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  const written = [];
  for (const shot of SHOTS) {
    if (shot.hover) {
      await page
        .locator("nav")
        .getByText(shot.hover, { exact: true })
        .first()
        .hover();
      await page.waitForTimeout(250);
    } else {
      // Park the pointer off the nav so no row is left in a hover state.
      await page.mouse.move(1200, 700);
      await page.waitForTimeout(250);
    }

    const file = path.join(OUT_DIR, `${shot.name}-${colorMode}.png`);
    const target = shot.selector ? page.locator(shot.selector).first() : page;
    await target.screenshot({ path: file });
    written.push(file);
  }

  await context.close();
  return written;
}

async function main() {
  const baseUrl = await findDevServer();
  const introVersion = await readIntroVersion();
  await mkdir(OUT_DIR, { recursive: true });

  const chromePath =
    process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : null;
  const launchOptions =
    chromePath && existsSync(chromePath)
      ? { executablePath: chromePath }
      : { channel: "chrome" };

  const browser = await chromium.launch(launchOptions);
  const written = [];
  try {
    for (const colorMode of ["light", "dark"]) {
      written.push(...(await capture(browser, { colorMode, introVersion, baseUrl })));
    }
  } finally {
    await browser.close();
  }

  // A manifest so it is obvious which assets are generated, and from what.
  await writeFile(
    path.join(OUT_DIR, "README.md"),
    [
      "# Generated navigation screenshots",
      "",
      "Do not edit by hand. Regenerate with `npm run capture:nav` while `npm run dev` is running.",
      "",
      `Captured at ${VIEWPORT.width}x${VIEWPORT.height} @2x from \`${baseUrl}/home/dashboard\`.`,
      "",
      ...SHOTS.flatMap((s) =>
        ["light", "dark"].map((m) => `- \`${s.name}-${m}.png\` — ${s.selector ?? "full viewport"}`)
      ),
      "",
    ].join("\n"),
    "utf8"
  );

  console.log(`Captured ${written.length} screenshots into public/nav-intro/`);
  for (const file of written) console.log(`  ${path.relative(ROOT, file)}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
