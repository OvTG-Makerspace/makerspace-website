const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const exphbs = require("express-handlebars");

const app = express();
const OUTPUT_DIR = path.join(__dirname, "docs");

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

const pages = [
  { template: "home", out: "index.html" },
  { template: "about", outDir: "about" },
  { template: "contact", outDir: "contact" },
  { template: "courses", outDir: "courses" },
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
      app.render(page.template, { title: page.template }, async (err, html) => {
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
