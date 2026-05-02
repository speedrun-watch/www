// Prerender public routes after `vite build` so crawlers (Google, Bing,
// Discord/Twitter previews, LLM scrapers) get fully-rendered HTML.
//
// Spawns `vite preview` against ./dist, drives it with Puppeteer, and writes
// the rendered HTML for each route over the SPA shell. Output:
//   dist/index.html                    (homepage, overwrites SPA shell)
//   dist/terms-of-service/index.html
//   dist/privacy-policy/index.html
//
// CloudFront's 403/404 → /index.html fallback still serves the SPA shell for
// dashboard, login, etc., so no per-route handling is needed for auth pages.

import { preview } from "vite";
import puppeteer from "puppeteer";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROUTES = ["/", "/terms-of-service", "/privacy-policy"];
const PORT = 4173;
const OUT_DIR = path.resolve("dist");

const server = await preview({
  preview: { port: PORT, strictPort: true },
  build: { outDir: OUT_DIR },
});

const baseURL = `http://localhost:${PORT}`;
// --no-sandbox is required on GitHub Actions' Ubuntu 24+ runners, which
// disable unprivileged user namespaces — the sandbox is unnecessary here
// because we're driving a trusted local preview, not arbitrary URLs.
const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

try {
  for (const route of ROUTES) {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000);

    const url = baseURL + route;
    await page.goto(url, { waitUntil: "networkidle0" });

    // Strip Vite client-only artifacts (none in production builds, but defensive).
    const html = await page.content();

    const dirSegment = route === "/" ? "" : route;
    const outDir = path.join(OUT_DIR, dirSegment);
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, "index.html"), html, "utf8");

    console.log(`prerendered ${route} → ${path.relative(process.cwd(), path.join(outDir, "index.html"))}`);
    await page.close();
  }
} finally {
  await browser.close();
  await server.httpServer.close();
}
