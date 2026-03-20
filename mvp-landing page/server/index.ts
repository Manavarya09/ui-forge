import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // In this project the Vite build output is `dist/` at the package root.
  // In production we must serve the built assets (e.g. dist/index.html, dist/assets/*).
  const clientDistPath = path.resolve(__dirname, "..", "dist");

  app.use(
    express.static(clientDistPath, {
      // Cache fingerprinted assets aggressively; keep HTML uncached.
      setHeaders(res, filePath) {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-store");
        } else {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    }),
  );

  // SPA fallback: only for non-asset GET requests.
  app.get("*", (req, res, next) => {
    if (req.method !== "GET") return next();
    if (path.extname(req.path)) return next(); // /assets/*.js, /favicon.ico, etc.

    res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
      if (err) next(err);
    });
  });

  // Basic error handler to avoid silent 500s in production.
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).send("Internal Server Error");
  });

  const port = Number(process.env.PORT) || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
