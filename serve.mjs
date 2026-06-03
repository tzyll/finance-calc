// Minimal static file server for local preview. Zero dependencies.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { site } from "./src/config.mjs";

const DIST = join(fileURLToPath(new URL(".", import.meta.url)), "dist");
const PORT = process.env.PORT || 4321;
const BASE = site.basePath || ""; // strip this prefix so local preview matches production paths
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
};

createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(req.url.split("?")[0]);
    if (BASE && path.startsWith(BASE)) path = path.slice(BASE.length) || "/";
    if (path.endsWith("/")) path += "index.html";
    let file = join(DIST, path);
    let data;
    try {
      data = await readFile(file);
    } catch {
      data = await readFile(join(DIST, path, "index.html"));
      file = join(DIST, path, "index.html");
    }
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404, { "content-type": "text/html" });
    res.end("<h1>404</h1>");
  }
}).listen(PORT, () => console.log(`Preview: http://localhost:${PORT}`));
