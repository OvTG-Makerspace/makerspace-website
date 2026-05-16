# Makerspace-Website

Die offizielle Website des **OvTG Makerspace** – einem kreativen Raum für Maker, Entwickler und Technologie-Enthusiasten.

## 📌 Über das Projekt

### Was ist der OvTG Makerspace?

Der Makerspace am Otto-von-Taube-Gymnasium (OvTG) ist ein offener Werkstattbereich, in dem Schüler:innen und Mitgliedern Zugang zu Werkzeugen, Maschinen und Technologien für eigene Projekte geboten wird. Hier können Ideen verwirklicht, Prototypen gebaut und technische Fähigkeiten erlernt werden.

### Diese Website

Diese Website dient als:

- **Informationsplattform** für den Makerspace
- **Projektgalerie** für abgeschlossene und laufende Projekte
- **Kontaktpunkt** für Interessierte
- **Dokumentationshub** für Anleitungen und Ressourcen
- **Anlaufstelle/Werbestelle** für eventuelle Sponsoren

### Technische Basis

- **Node.js** + **Express** – Backend-Framework
- **Docker** – Containerisierung für einfache Bereitstellung
- **Devenv** – Entwicklungsumgebung

---

## ✨ Mitwirken

Wir freuen uns über Beiträge aller Art! Egal ob du Entwickler:in, Designer:in, Autor:in **bist** oder einfach nur Ideen hast – dein Beitrag ist willkommen.

### Wie du mitmachen kannst


| Bereich              | Aufgaben                                         | Voraussetzungen            |
| -------------------- | ------------------------------------------------ | -------------------------- |
| **Webentwicklung**   | Frontend/Backend verbessern, neue Features       | Node.js, Express, HTML/CSS |
| **Inhalte**          | Projektbeschreibungen, Anleitungen, Blogbeiträge | Interesse am Makerspace    |
| **Design**           | UI/UX verbessern, Styles anpassen                | CSS, Design-Erfahrung      |
| **Dokumentation**    | Anleitungen schreiben, READMEs pflegen           | Technisches Verständnis    |
| **Ideen & Feedback** | Vorschläge einreichen, Bugs melden               | Keine – einfach loslegen!  |


### Erste Schritte für Entwickler:innen

1. **Repository klonen**
  ```sh
   git clone https://github.com/OvTG-Makerspace/makerspace-website
   cd makerspace-website
  ```
2. **Abhängigkeiten installieren**
  ```sh
   npm ci  # Installiert alle in package.json definierten Abhängigkeiten
  ```
  - **Node.js herunterladen**: [https://nodejs.org/](https://nodejs.org/)
3. **Lokale Entwicklung starten**
  ```sh
   npm run dev  # Startet den Entwicklungsserver mit Hot-Reload
  ```
   Die Website ist dann unter `http://localhost:3000` erreichbar.
4. **Änderungen einreichen**
  - Erstelle einen neuen Branch: `git checkout -b feature/dein-feature`
  - Commite deine Änderungen: `git commit -m "Beschreibung der Änderung"`
  - Push den Branch: `git push origin feature/dein-feature`
  - Erstelle einen Pull Request auf GitHub

### Code-Standards

- **Commits**: Klare, beschreibende Commit-Messages
- **Code-Formatierung**: Konsistente Einrückung und Benennung
- **Pull Requests**: Beschreibe deine Änderungen und verlinke ggf. Issues
- **Tests**: Falls vorhanden, stelle sicher, dass alle Tests durchlaufen

### Code of Conduct

Wir erwarten von allen Mitwirkenden:

- Respektvoller Umgang miteinander
- Konstruktives Feedback
- Offenheit für verschiedene Meinungen und Ansätze

---

## 🚀 Entwicklung

### Lokale Entwicklung

#### Voraussetzungen

- Node.js (Version 18+ empfohlen)
- npm

### Mit Devenv (empfohlen)

Dieses Projekt nutzt [Devenv](https://devenv.sh/) für eine reproduzierbare Entwicklungsumgebung.

```sh
# Entwicklungs-Shell starten
devenv shell

# Innerhalb der Shell:
npm run dev
```

**Verfügbare Devenv-Tasks:**


| Task                   | Beschreibung                                     |
| ---------------------- | ------------------------------------------------ |
| `mksp:deploy_init`     | Initialisiert lokale Bereitstellungsdateien      |
| `mksp:deploy_validate` | Überprüft, ob alle benötigten Dateien existieren |
| `mksp:deploy`          | Build und startet den Docker-Stack               |


---

## 📁 Projektstruktur

```
makerspace-website/
├── content/               # Inhalte (Projekte, Seiten)
├── css/                   # Stylesheets
├── data/                  # Daten (z.B. JSON-Dateien)
├── views/                 # Express Views (EJS-Templates)
├── public/                # Statische Dateien (Bilder, JS, CSS)
├── server.js              # Express-Server
├── build.js               # Build-Skript
├── package.json           # Abhängigkeiten
├── Dockerfile             # Docker-Container
├── docker-compose.yml     # Docker Compose
├── devenv.nix             # Devenv Pakete
├── devenv.yaml            # Devenv Konfiguration
└── .env.example            # Beispiel-Umgebungsvariablen
```

### Wichtige Dateien


| Datei       | Zweck                                         |
| ----------- | --------------------------------------------- |
| `server.js` | Hauptanwendung (Express)                      |
| `views/`    | EJS-Templates für die Seiten                  |
| `content/`  | Markdown/Inhalte für Projekte und Seiten      |
| `css/`      | Stylesheets                                   |
| `public/`   | Statische Assets (Bilder, Client-seitiges JS) |


---

## 💬 Fragen?

Bei Fragen oder Problemen wende dich bitte an den Administrator:  
**E-Mail**: [simon.korten@proton.me](mailto:simon.korten@proton.me)

---

## 📄 Lizenz

Dieses Projekt steht unter der **MIT-Lizenz**. Siehe [LICENSE](LICENSE) für den vollständigen Lizenztext.

Copyright (c) 2026 OvTG Makerspace