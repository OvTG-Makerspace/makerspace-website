// server.js

const express = require("express");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const exphbs = require("express-handlebars");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, "data", "carousel.csv");
const CONTENT_DIR = path.join(__dirname, "content");

const smtpPort = Number(process.env.SMTP_PORT || 1025);
const smtpSecure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "127.0.0.1",
  port: Number.isFinite(smtpPort) ? smtpPort : 1025,
  secure: smtpSecure,
  auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
});

class CarouselEntry {
  constructor({ image, title, subtitle, main, route }) {
    this.image = image;
    this.title = title;
    this.subtitle = subtitle;
    this.main = main;
    this.route = route;
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
  };

  return rows.slice(1).map((row, i) => {
    const entry = new CarouselEntry({
      image: row[idx.image] ? row[idx.image].trim() : "",
      title: row[idx.title] ? row[idx.title].trim() : "",
      subtitle: row[idx.subtitle] ? row[idx.subtitle].trim() : "",
      main: row[idx.main] ? row[idx.main].trim() : "",
      route: normalizeRoute(row[idx.route] ? row[idx.route].trim() : ""),
    });

    if (!entry.route) {
      console.warn(`Carousel entry ${i + 1} is missing a route.`);
    }
    if (!entry.main) {
      console.warn(`Carousel entry ${i + 1} is missing a main file.`);
    }

    return entry;
  });
}

const carouselEntries = loadCarouselEntries();

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
    }))
  );
  res.render("home", {
    title: "Home",
    slidesJson,
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact",
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
    });
  }

  try {
    await transporter.sendMail({
      to: process.env.ADMIN_EMAIL || "admin@example.com",
      from: process.env.SMTP_FROM || email,
      replyTo: email,
      subject: `Kontaktanfrage von ${name}`,
      text: `Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
    });

    return res.render("contact", {
      title: "Contact",
      success: "Vielen Dank! Ihre Nachricht wurde gesendet.",
    });
  } catch (err) {
    console.error("Contact form email failed:", err);
    return res.render("contact", {
      title: "Contact",
      error: "Es gab ein Problem beim Senden der Nachricht. Bitte versuchen Sie es erneut.",
      form: { name, email, message },
    });
  }
});

app.get("/courses", (req, res) => {
  res.render("courses", {
    title: "Courses",
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
