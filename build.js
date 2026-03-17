const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const exphbs = require("express-handlebars");

const app = express();
const OUTPUT_DIR = path.join(__dirname, "docs");
const DATA_PATH = path.join(__dirname, "data", "carousel.csv");
const CONTENT_DIR = path.join(__dirname, "content");

app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

function parseCsv(text) {
  const rows = [];
  let row = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === "\"" && next === "\"") {
        current += "\"";
        i++;
      } else if (char === "\"") {
        inQuotes = false;
      } else {
        current += char;
      }
      continue;
    }

    if (char === "\"") {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(current);
      current = "";
      continue;
    }

    if (char === "\n") {
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      continue;
    }

    if (char === "\r") {
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => String(cell).trim().length > 0));
}

function normalizeRoute(route) {
  if (!route) return "";
  const withSlash = route.startsWith("/") ? route : `/${route}`;
  return withSlash.replace(/\/+$/, "") || "/";
}

function resolveContentPath(mainFile) {
  const resolved = path.resolve(CONTENT_DIR, mainFile);
  if (!resolved.startsWith(CONTENT_DIR + path.sep)) {
    throw new Error(`Invalid main path: ${mainFile}`);
  }
  return resolved;
}

function loadCarouselEntries() {
  if (!fs.existsSync(DATA_PATH)) {
    return [];
  }

  const raw = fs.readFileSync(DATA_PATH, "utf8");
  const rows = parseCsv(raw);
  if (rows.length === 0) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = {
    image: header.indexOf("image"),
    title: header.indexOf("title"),
    subtitle: header.indexOf("subtitle"),
    main: header.indexOf("main"),
    route: header.indexOf("route"),
  };

  return rows.slice(1).map((row) => ({
    image: row[idx.image] ? row[idx.image].trim() : "",
    title: row[idx.title] ? row[idx.title].trim() : "",
    subtitle: row[idx.subtitle] ? row[idx.subtitle].trim() : "",
    main: row[idx.main] ? row[idx.main].trim() : "",
    route: normalizeRoute(row[idx.route] ? row[idx.route].trim() : ""),
  }));
}

const carouselEntries = loadCarouselEntries();
const slidesJson = JSON.stringify(
  carouselEntries.map((entry) => ({
    image: entry.image,
    title: entry.title,
    subtitle: entry.subtitle,
    route: entry.route,
  }))
);

const pages = [
  { template: "home", out: "index.html", data: { title: "Home", slidesJson } },
  { template: "about", outDir: "about" },
  { template: "contact", outDir: "contact" },
  { template: "courses", outDir: "courses" },
  ...carouselEntries
    .filter((entry) => entry.route && entry.main)
    .map((entry) => ({
      template: "entry",
      outDir: entry.route.replace(/^\//, ""),
      data: {
        title: entry.title || "Details",
        content: fs.readFileSync(resolveContentPath(entry.main), "utf8"),
      },
    })),
  { template: "404", out: "404.html" },
];

function repoBasePath() {
  try {
    const pkg = require(path.join(__dirname, 'package.json'));
    if (pkg && pkg.repository && pkg.repository.url) {
      const m = String(pkg.repository.url).match(/[:\/]([^\/]+)\/([^\/]+)(?:\.git)?$/);
      if (m) return `/${m[2].replace(/\.git$/, '')}/`;
    }
  } catch (e) {}
  return '/';
}

(async () => {
  const basePath = process.env.BASE_PATH || repoBasePath();

  await fs.emptyDir(OUTPUT_DIR);
  // copy public files to docs root (so css is at docs/css/...)
  if (await fs.pathExists(path.join(__dirname, 'public'))) {
    await fs.copy(path.join(__dirname, 'public'), OUTPUT_DIR);
  }

  for (const page of pages) {
    await new Promise((resolve, reject) => {
      const renderData = Object.assign({ title: page.template }, page.data || {});
      app.render(page.template, renderData, async (err, html) => {
        if (err) return reject(err);

        // rewrite absolute href/src to point to basePath when not '/'
        if (basePath && basePath !== '/') {
          html = html.replace(/(href|src)="\/(?!http)([^"]*)"/g, (m, attr, p1) => `${attr}="${basePath}${p1}"`);
        }

        if (page.out) {
          await fs.outputFile(path.join(OUTPUT_DIR, page.out), html);
          console.log('Written', path.join(OUTPUT_DIR, page.out));
        } else if (page.outDir) {
          const outDir = path.join(OUTPUT_DIR, page.outDir);
          await fs.ensureDir(outDir);
          await fs.outputFile(path.join(outDir, 'index.html'), html);
          console.log('Written', path.join(outDir, 'index.html'));
        }

        resolve();
      });
    });
  }

  console.log('Static site generated in', OUTPUT_DIR);
})();
