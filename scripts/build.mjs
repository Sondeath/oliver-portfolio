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
export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const output = resolve(root, "dist");
const productionOrigin = "https://oliverlibic.dev";
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
export const files = [
  "index.html",
  "styles.css",
  "app.js",
  "motion.js",
  "favicon.svg",
  "assets/fonts/anton-regular.ttf",
  "assets/fonts/ANTON-OFL.txt",
  "assets/fonts/inter-regular.ttf",
  "assets/fonts/inter-medium.ttf",
  "assets/fonts/OFL.txt",
  "assets/hero-purple/monitor.webp",
  "assets/hero-purple/shirt.webp",
  "assets/hero-purple/social-preview.jpg",
  "assets/projects/becool-square.jpg",
  "assets/projects/becool-shop-square.jpg",
  ...(await readdir(resolve(root, "assets/icons")))
    .filter((name) => name.endsWith(".svg") || name === "LICENSE")
    .map((name) => "assets/icons/" + name),
];
export async function build() {
  const origin = publicationOrigin();
  // Verify the resolved absolute deletion target; never carry removed assets forward.
  if (output !== resolve(root, "dist")) throw new Error("Unsafe build output");
  await rm(output, { recursive: true, force: true });
  for (const file of files) {
    const destination = resolve(output, file);
    if (
      !destination.startsWith(output + "/") &&
      !destination.startsWith(output + "\\")
    )
      throw new Error("Invalid output path");
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(resolve(root, file), destination);
  }
  const index = resolve(output, "index.html");
  let html = (await readFile(index, "utf8")).replaceAll(
    productionOrigin,
    origin,
  );
  if (origin !== productionOrigin)
    html = html.replace(
      "</head>",
      '<meta name="robots" content="noindex, nofollow">\n</head>',
    );
  await writeFile(index, html);
  return files.length;
}
if (resolve(process.argv[1] || "") === fileURLToPath(import.meta.url))
  console.log("Built " + (await build()) + " public files to " + output);
