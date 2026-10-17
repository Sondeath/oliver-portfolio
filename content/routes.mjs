// Shared by page rendering, native language navigation and the sitemap.
export const routes = {
  home: { sk: "/", en: "/en/" },
};

// Existing links lead to the offer in the same language; these are not pages.
export const retiredPageRedirects = Object.fromEntries([
  ["/weby-a-eshopy", "/#services"],
  ["/textil-a-predmety", "/#services"],
  ["/en/websites-and-shops", "/en/#services"],
  ["/en/clothing-and-merch", "/en/#services"],
].flatMap(([path, destination]) =>
  ["", "/", "/index.html"].map(suffix => [path + suffix, destination])));
