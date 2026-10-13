import { mkdir, copyFile, readdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const output = resolve(root, "dist");
// Explicit publication list: reviews, source code, prompts and secrets stay private.
export const files = [
  "index.html",
  "styles.css",
  "app.js",
  "inquiry.js",
  "favicon.svg",
  "videos/hero-poster.jpg",
  "assets/fonts/inter-regular.ttf",
  "assets/fonts/inter-medium.ttf",
  "assets/fonts/OFL.txt",
  "assets/offer/web-studio.webp",
  "assets/offer/merch-studio.webp",
  "assets/projects/becool-square.jpg",
  "assets/projects/becool-shop-square.jpg",
  ...(await readdir(resolve(root, "assets/icons")))
    .filter((name) => name.endsWith(".svg") || name === "LICENSE")
    .map((name) => "assets/icons/" + name),
];
export async function build() {
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
  return files.length;
}
if (resolve(process.argv[1] || "") === fileURLToPath(import.meta.url))
  console.log("Built " + (await build()) + " public files to " + output);
