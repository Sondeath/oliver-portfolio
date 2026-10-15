// Local-only viewer. Audit files are deliberately excluded from the public build.
import http from "node:http";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { routes } from "../content/routes.mjs";
const root = resolve("qa-production-seo");
const allowed = new Set(["index.html", "summary.json", ...Object.keys(routes).flatMap(page =>
  ["sk", "en"].flatMap(language => [`${page}-${language}.report.html`, `${page}-${language}.report.json`]))]);
http.createServer(async (request, response) => {
  const name = new URL(request.url, "http://127.0.0.1").pathname.slice(1) || "index.html";
  if (!["GET", "HEAD"].includes(request.method) || !allowed.has(name)) {
    response.writeHead(404); response.end("Not found"); return;
  }
  try {
    const body = await readFile(resolve(root, name));
    response.writeHead(200, { "Content-Type": name.endsWith(".html") ? "text/html; charset=utf-8" : "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch { response.writeHead(404); response.end("Not found"); }
}).listen(8792, "127.0.0.1", () => console.log("Production SEO reports: http://127.0.0.1:8792/"));
