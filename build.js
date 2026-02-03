const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const exphbs = require("express-handlebars");

const app = express();
const OUTPUT_DIR = path.join(__dirname, "dist");

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
  { route: "/", template: "home", file: "index.html" },
  { route: "/about", template: "about", file: "about.html" },
  { route: "/contact", template: "contact", file: "contact.html" },
];

(async () => {
  await fs.emptyDir(OUTPUT_DIR);
  await fs.copy("public", path.join(OUTPUT_DIR, "public"));

  for (const page of pages) {
    app.render(page.template, { title: page.template }, async (err, html) => {
      if (err) throw err;
      await fs.outputFile(path.join(OUTPUT_DIR, page.file), html);
    });
  }

  console.log("Static site generated in /dist");
})();
