// server.js

const express = require("express");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const exphbs = require("express-handlebars");
// const hbsMailerImport = require("nodemailer-express-handlebars");
// const hbsMailer = typeof hbsMailerImport === "function" ? hbsMailerImport : hbsMailerImport.default;

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, "data", "carousel.csv");
const CONTENT_DIR = path.join(__dirname, "content");

const smtpPort = Number(process.env.SMTP_PORT || 1025);
const smtpSecure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const smtpFrom = process.env.SMTP_FROM || "no-reply@makerspace.ovtg.de";
const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || "127.0.0.1",
//   port: Number.isFinite(smtpPort) ? smtpPort : 1025,
//   secure: smtpSecure,
//   auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
// });

// if (typeof hbsMailer !== "function") {
//   throw new Error("nodemailer-express-handlebars did not export a function (check module format/version).");
// }

// transporter.use("compile", hbsMailer({
//   viewEngine: {
//     extname: ".hbs",
//     layoutsDir: path.join(__dirname, "views"),
//     defaultLayout: false,
//     partialsDir: path.join(__dirname, "views/partials"),
//   },
//   viewPath: path.join(__dirname, "views/emails"),
//   extName: ".hbs",
// }));

function stripHeaderNewlines(value) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim();
}

function isLikelyEmail(value) {
  const v = String(value || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

class CarouselEntry {
  constructor({ image, title, subtitle, main, route, redirect }) {
    this.image = image;
    this.title = title;
    this.subtitle = subtitle;
    this.main = main;
    this.route = route;
    this.redirect = redirect;
  }
}

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
    console.warn(`Carousel CSV not found at ${DATA_PATH}`);
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
    redirect: header.indexOf("redirect"),
  };

  return rows.slice(1).map((row, i) => {
    const rawRoute = row[idx.route] ? String(row[idx.route]).trim() : "";
    const looksExternal = /^https?:\/\//i.test(rawRoute);
    const entry = new CarouselEntry({
      image: row[idx.image] ? row[idx.image].trim() : "",
      title: row[idx.title] ? row[idx.title].trim() : "",
      subtitle: row[idx.subtitle] ? row[idx.subtitle].trim() : "",
      main: row[idx.main] ? row[idx.main].trim() : "",
      route: looksExternal ? "" : normalizeRoute(rawRoute),
      redirect:
        idx.redirect >= 0 && row[idx.redirect]
          ? String(row[idx.redirect]).trim()
          : looksExternal
            ? rawRoute
            : "",
    });

    if (!entry.route && !entry.redirect) {
      console.warn(`Carousel entry ${i + 1} is missing a route (and no redirect).`);
    }
    if (!entry.main) {
      console.warn(`Carousel entry ${i + 1} is missing a main file.`);
    }

    return entry;
  });
}

const carouselEntries = loadCarouselEntries();

const helpArticles = [
  { href: "/help/join", title: "Mitmachen", desc: "So kannst du beitreten und loslegen." },
  { href: "/help/where-to-go", title: "Wo musst du hin?", desc: "Ort, Zugang und Zeiten." },
  { href: "/help/what-you-can-do", title: "Was kannst du machen?", desc: "Projekte, Ideen und Aktivitäten." },
  { href: "/help/how-it-works", title: "Wie läuft’s ab?", desc: "Ablauf, Regeln und Tipps." },
];

/* -----------------------------
   EXPRESS + HANDLEBARS SETUP
-------------------------------- */
app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

/* -----------------------------
   MIDDLEWARE
-------------------------------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Expose shared template data to all views.
app.use((req, res, next) => {
  res.locals.helpArticles = helpArticles;
  next();
});


/* =========================================================
   ROUTES — COPY / PASTE THIS SECTION TO ADD NEW PAGES
   Each route renders a different .hbs template
   ========================================================= */
app.get("/", (req, res) => {
  const slidesJson = JSON.stringify(
    carouselEntries.map((entry) => ({
      image: entry.image,
      title: entry.title,
      subtitle: entry.subtitle,
      route: entry.route,
      redirect: entry.redirect,
    }))
  );
  res.render("home", {
    title: "Startseite",
    slidesJson,
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "Über Uns",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Kontakt",
  });
});

app.get("/help", (req, res) => {
  res.render("help/index", {
    title: "Hilfe",
  });
});

app.get("/help/join", (req, res) => {
  res.render("help/join", {
    title: "Mitmachen",
  });
});

app.get("/help/where-to-go", (req, res) => {
  res.render("help/where-to-go", {
    title: "Wo musst du hin?",
  });
});

app.get("/help/what-you-can-do", (req, res) => {
  res.render("help/what-you-can-do", {
    title: "Was kannst du machen?",
  });
});

app.get("/help/how-it-works", (req, res) => {
  res.render("help/how-it-works", {
    title: "Wie läuft’s ab?",
  });
});

app.post("/contact", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const message = String(req.body.message || "").trim();

  if (!name || !email || !message) {
    return res.render("contact", {
      title: "Contact",
      error: "Bitte füllen Sie alle Felder aus.",
      form: { name, email, message },
      helpArticles,
    });
  }

  if (!isLikelyEmail(email)) {
    return res.render("contact", {
      title: "Contact",
      error: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      form: { name, email, message },
      helpArticles,
    });
  }

  try {
    // await transporter.sendMail({
    //   to: adminEmail,
    //   from: stripHeaderNewlines(smtpFrom),
    //   replyTo: stripHeaderNewlines(email),
    //   subject: stripHeaderNewlines(`Kontaktanfrage von ${name}`),
    //   template: "contact",
    //   context: {
    //     submittedAt: new Date().toISOString(),
    //     name,
    //     email,
    //     message,
    //     ip: req.ip,
    //     userAgent: req.get("user-agent") || "",
    //   },
    //   text: `Neue Kontaktanfrage\n\nName: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}\n\nIP: ${req.ip}\nUser-Agent: ${req.get("user-agent") || ""}\n`,
    // });

    return res.render("contact", {
      title: "Contact",
      success: "Vielen Dank! Ihre Nachricht wurde gesendet.",
      helpArticles,
    });
  } catch (err) {
    console.error("Contact form email failed:", err);
    return res.render("contact", {
      title: "Contact",
      error: "Es gab ein Problem beim Senden der Nachricht. Bitte versuchen Sie es erneut.",
      form: { name, email, message },
      helpArticles,
    });
  }
});

app.get("/courses", (req, res) => {
  res.render("courses", {
    title: "Kurse",
  });
});

carouselEntries.forEach((entry) => {
  if (!entry.route) return;

  app.get(entry.route, (req, res, next) => {
    try {
      const contentPath = resolveContentPath(entry.main);
      const content = fs.readFileSync(contentPath, "utf8");
      res.render("entry", {
        title: entry.title || "Details",
        content,
      });
    } catch (err) {
      next();
    }
  });
});
/* ========================================================= */

/* -----------------------------
   404 HANDLER
-------------------------------- */
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found",
  });
});

/* -----------------------------
   START SERVER
-------------------------------- */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
