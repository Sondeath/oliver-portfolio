import {
  mkdir,
  copyFile,
  readdir,
  rm,
  readFile,
  writeFile,
} from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { renderPage } from "./render-page.mjs";
import { productionOrigin, crawlerFiles } from "./seo.mjs";
import { routes } from "../content/routes.mjs";
import { renderServicePage } from "./render-service-page.mjs";
export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const output = resolve(root, "dist");
const branchPreviewOrigin =
  "https://codex-digital-merch-oliver-portfolio.oliver-6b1.workers.dev";

export function publicationOrigin(env = process.env) {
  const value =
    env.SITE_ORIGIN ||
    (env.WORKERS_CI_BRANCH === "codex/digital-merch"
      ? branchPreviewOrigin
      : productionOrigin);
  const url = new URL(value);
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new Error(
      "SITE_ORIGIN must be a public HTTP(S) origin without credentials or a path",
    );
  return url.origin;
}
// Explicit publication list: reviews, source code, prompts and secrets stay private.
const styleFiles = [
  "styles.css",
  "work.css",
  "flow.css",
  "services.css",
  "process.css",
  "contact.css",
  "locale.css",
];
const sourceFiles = [
  "index.html",
  "app.js",
  "service-page.js",
  "service-page.css",
  "motion.js",
  "liquid-aura.js",
  "favicon.svg",
  "assets/fonts/anton-regular.woff2",
  "assets/fonts/ANTON-OFL.txt",
  "assets/fonts/inter-regular.woff2",
  "assets/fonts/inter-medium.woff2",
  "assets/fonts/OFL.txt",
  "assets/hero-purple/monitor.webp",
  "assets/hero-purple/shirt.webp",
  ...["monitor", "shirt"].flatMap(name => [480, 800].map(width => `assets/hero-purple/${name}-${width}.webp`)),
  "assets/hero-purple/social-preview.jpg",
  ...(await readdir(resolve(root, "assets/projects/live")))
    .filter((name) => name.endsWith(".webp"))
    .map((name) => "assets/projects/live/" + name),
  "assets/work-liquid/liquid-aura-960.webp",
  "assets/work-liquid/odtlacok-o-640.webp",
  "assets/work-liquid/odtlacok-o-800.webp",
  "assets/work-liquid/odtlacok-o-1254.webp",
  ...(await readdir(resolve(root, "assets/icons")))
    .filter((name) => name.endsWith(".svg") || name === "LICENSE")
    .map((name) => "assets/icons/" + name),
];
const serviceFiles = Object.entries(routes).filter(([page]) => page !== "home").flatMap(([, languages]) => Object.values(languages).map(path => path.slice(1) + "index.html"));
export const files = [...sourceFiles, "site.css", "robots.txt", "sitemap.xml", "en/index.html", ...serviceFiles];
export async function build() {
  const origin = publicationOrigin();
  // Verify the resolved absolute deletion target; never carry removed assets forward.
  if (output !== resolve(root, "dist")) throw new Error("Unsafe build output");
  await rm(output, { recursive: true, force: true });
  for (const file of sourceFiles) {
    const destination = resolve(output, file);
    if (
      !destination.startsWith(output + "/") &&
      !destination.startsWith(output + "\\")
    )
      throw new Error("Invalid output path");
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(resolve(root, file), destination);
  }
  const template = await readFile(resolve(root, "index.html"), "utf8");
  await writeFile(resolve(output, "index.html"), renderPage(template, "sk", origin));
  await mkdir(resolve(output, "en"), { recursive: true });
  await writeFile(resolve(output, "en/index.html"), renderPage(template, "en", origin));
  for (const [page, languages] of Object.entries(routes)) {
    if (page === "home") continue;
    for (const [language, path] of Object.entries(languages)) {
      const destination = resolve(output, path.slice(1), "index.html");
      await mkdir(dirname(destination), { recursive: true });
      await writeFile(destination, renderServicePage(template, page, language, origin));
    }
  }
  // Keep authoring files separate; preserve their cascade in one network request.
  const styles = await Promise.all(styleFiles.map(file => readFile(resolve(root, file), "utf8")));
  await writeFile(resolve(output, "site.css"), styles.join("\n"));
  const { robots, sitemap } = crawlerFiles(origin);
  await writeFile(resolve(output, "robots.txt"), robots);
  await writeFile(resolve(output, "sitemap.xml"), sitemap);
  return files.length;
}
if (resolve(process.argv[1] || "") === fileURLToPath(import.meta.url))
  console.log("Built " + (await build()) + " public files to " + output);
