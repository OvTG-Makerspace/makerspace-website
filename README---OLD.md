# makerspace-website

Node/Express website with a Dockerized SMTP relay for outbound email (contact form).

## Local dev (Node)

- Install: `npm ci`
- Run: `npm run dev` (serves on `http://localhost:3000`)

The contact form sends email via SMTP configured in `.env`.

## Docker (app + SMTP relay)

This repo ships a `docker-compose.yml` with:

- `app`: the website (Express)
- `smtp-relay`: Postfix relay that accepts SMTP from `app` and relays outbound via an upstream SMTP provider

### Devenv tasks

HINT: If you use devenv, you can manage the Docker deploy workflow via tasks:

- Init local deploy files: `devenv tasks run mksp:deploy_init`
- Validate required files exist: `devenv tasks run mksp:deploy_validate`
- Build + start stack: `devenv tasks run mksp:deploy`

### Safe credential storage

Do **not** commit SMTP credentials to Git.

Use one of these approaches:

1) **Docker secrets (recommended)**: create secret files on the deploy host
2) **Environment variables**: acceptable for local testing, but avoid for production

### Deploy with Docker secrets (recommended)

On the deploy host (next to `docker-compose.yml`):

1. Create `.env` from `.env.example`:
   - `cp .env.example .env`
   - Edit values as needed (e.g. `ADMIN_EMAIL`, `SMTP_FROM`)

2. Create secret files (these must stay off Git):
   - `mkdir -p secrets`
   - `printf '%s' 'your-smtp-username' > secrets/relay_username`
   - `printf '%s' 'your-smtp-token-or-password' > secrets/relay_password`
   - `chmod 600 secrets/relay_username secrets/relay_password`

3. Start services:
   - `docker compose up -d --build`

### Proton SMTP

This stack is preconfigured to relay via Proton SMTP submission (`smtp.protonmail.ch:587`). Put the Proton SMTP username + SMTP token into the two secret files above.

HINT: If you use devenv, run `devenv tasks run mksp:deploy_init` to create `.env` and template secret files, then `devenv tasks run mksp:deploy`.

### App mail settings

The app uses:

- `ADMIN_EMAIL`: recipient for contact form mail
- `SMTP_FROM`: sender shown in the email `From:` header (default: `no-reply@makerspace.ovtg.de`)

The visitor’s email is placed into `Reply-To:` (so you can reply without spoofing `From:`).
