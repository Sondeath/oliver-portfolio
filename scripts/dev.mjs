import http from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import worker from "../worker.js";
import { build, output, files } from "./build.mjs";
import { routes } from "../content/routes.mjs";
await build();
const arg = (name) => {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1];
};
const port = Number(arg("--port") || 8787),
  host = arg("--host") || "127.0.0.1";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};
const allowed = new Set(files);
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://" + req.headers.host);
    if (url.pathname.startsWith("/api/")) {
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 24000) {
          res.writeHead(413);
          res.end();
          return;
        }
        chunks.push(chunk);
      }
      const request = new Request(url, {
        method: req.method,
        headers: req.headers,
        ...(req.method === "GET" || req.method === "HEAD"
          ? {}
          : { body: Buffer.concat(chunks) }),
      });
      // Local preview never reads deployment secrets and never sends external mail.
      const response = await worker.fetch(request, {});
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
      return;
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405);
      res.end();
      return;
    }
    const slashDestination = Object.values(routes).flatMap(Object.values).find(path => path !== "/" && path.slice(0, -1) === url.pathname);
    if (slashDestination) {
      res.writeHead(308, { Location: slashDestination + url.search });
      res.end();
      return;
    }
    let name =
      decodeURIComponent(url.pathname).replace(/^\/+/, "") || "index.html";
    if (name.endsWith("/")) name += "index.html";
    if (!allowed.has(name)) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const body = await readFile(resolve(output, name));
    res.writeHead(200, {
      "Content-Type": mime[extname(name)] || "application/octet-stream",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch {
    if (!res.headersSent) res.writeHead(500);
    res.end("Preview error");
  }
});
server.on("error", (error) => {
  console.error(
    error.code === "EADDRINUSE"
      ? "Preview port is already in use."
      : error.message,
  );
  process.exitCode = 1;
});
server.listen(port, host, () =>
  console.log("Portfolio preview: http://" + host + ":" + port),
);
