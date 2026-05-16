# Makerspace Website

The official website of the **OvTG Makerspace** – a creative space for makers, developers, and technology enthusiasts.

## 📌 About the Project

### What is the OvTG Makerspace?

The Makerspace at Otto-von-Taube-Gymnasium (OvTG) is an open workshop area where students and members have access to tools, machines, and technologies for their own projects. Here, ideas can be realized, prototypes built, and technical skills learned.

### This Website

This website serves as:

- **Information platform** for the Makerspace
- **Project gallery** for completed and ongoing projects
- **Contact point** for interested parties
- **Documentation hub** for tutorials and resources
- **Point of contact/advertising platform** for potential sponsors

### Technical Foundation

- **Node.js** + **Express** – Backend framework
- **Docker** – Containerization for easy deployment
- **Devenv** – Development environment

---

## ✨ Contributing

We welcome contributions of all kinds! Whether you're a developer, designer, author, or just have ideas – your contribution is valuable.

### How You Can Contribute


| Area                 | Tasks                                             | Requirements               |
| -------------------- | ------------------------------------------------- | -------------------------- |
| **Web Development**  | Improve frontend/backend, add new features        | Node.js, Express, HTML/CSS |
| **Content**          | Write project descriptions, tutorials, blog posts | Interest in the Makerspace |
| **Design**           | Improve UI/UX, adjust styles                      | CSS, design experience     |
| **Documentation**    | Write tutorials, maintain READMEs                 | Technical understanding    |
| **Ideas & Feedback** | Submit suggestions, report bugs                   | None – just get started!   |


### First Steps for Developers

1. **Clone the repository**
  ```sh
   git clone https://github.com/OvTG-Makerspace/makerspace-website
   cd makerspace-website
  ```
2. **Install dependencies**
  ```sh
   npm ci  # Installs all dependencies defined in package.json
  ```
  - **Download Node.js**: [https://nodejs.org/](https://nodejs.org/)
3. **Start local development**
  ```sh
   npm run dev  # Starts the development server with hot-reload
  ```
   The website will be available at `http://localhost:3000`.
4. **Submit changes**
  - Create a new branch: `git checkout -b feature/your-feature`
  - Commit your changes: `git commit -m "Description of changes"`
  - Push the branch: `git push origin feature/your-feature`
  - Create a Pull Request on GitHub

### Code Standards

- **Commits**: Clear, descriptive commit messages
- **Code Formatting**: Consistent indentation and naming
- **Pull Requests**: Describe your changes and link to relevant issues
- **Tests**: If available, ensure all tests pass

### Code of Conduct

We expect all contributors to:

- Treat each other with respect
- Provide constructive feedback
- Be open to different opinions and approaches

---

## 🚀 Development

### Local Development

#### Prerequisites

- Node.js (Version 18+ recommended)
- npm

### With Devenv (recommended)

This project uses [Devenv](https://devenv.sh/) for a reproducible development environment.

```sh
# Start development shell
devenv shell

# Inside the shell:
npm run dev
```

**Available Devenv Tasks:**


| Task                   | Description                             |
| ---------------------- | --------------------------------------- |
| `mksp:deploy_init`     | Initializes local deployment files      |
| `mksp:deploy_validate` | Validates that all required files exist |
| `mksp:deploy`          | Builds and starts the Docker stack      |


---

## 📁 Project Structure

```
makerspace-website/
├── content/               # Content (projects, pages)
├── css/                   # Stylesheets
├── data/                  # Data (e.g., JSON files)
├── views/                 # Express Views (EJS templates)
├── public/                # Static files (images, JS, CSS)
├── server.js              # Express server
├── build.js               # Build script
├── package.json           # Dependencies
├── Dockerfile             # Docker container
├── docker-compose.yml     # Docker Compose
├── devenv.nix             # Devenv packages
├── devenv.yaml            # Devenv configuration
└── .env.example            # Example environment variables
```

### Important Files


| File        | Purpose                                 |
| ----------- | --------------------------------------- |
| `server.js` | Main application (Express)              |
| `views/`    | EJS templates for pages                 |
| `content/`  | Markdown/content for projects and pages |
| `css/`      | Stylesheets                             |
| `public/`   | Static assets (images, client-side JS)  |


---

## 💬 Questions?

If you have any questions or issues, please contact the administrator:  
**Email**: [simon.korten@proton.me](mailto:simon.korten@proton.me)

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for the full license text.

Copyright (c) 2026 OvTG Makerspace