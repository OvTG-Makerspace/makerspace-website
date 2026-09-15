{
  pkgs,
  config,
  lib,
  ...
}:
{
  languages.javascript = {
    enable = true;
    npm.enable = true;
  };

  services.mailpit.enable = true;
  services.mailpit.smtpListenAddress = "127.0.0.1:1025";
  services.mailpit.uiListenAddress = "127.0.0.1:8025";

  dotenv.enable = true;

  env = {
    SMTP_HOST = "127.0.0.1";
    SMTP_PORT = "1025";
    SMTP_SECURE = "false";
    SMTP_USER = "";
    SMTP_PASS = "";
    ADMIN_EMAIL = "dobosk@dosbosk.aujawann";
    SMTP_FROM = "glasoderflasche@kasten.ds";
  };

  packages = [
    pkgs.nodejs_22
    pkgs.docker
    pkgs.docker-compose
  ];

  tasks = {
    "mksp:deploy_init" = {
      exec = ''
        set -eu

        if [ ! -f .env ]; then
          if [ -f .env.example ]; then
            cp .env.example .env
            echo "Created .env from .env.example"
          else
            echo "Missing .env.example; cannot create .env"
            exit 1
          fi
        else
          echo ".env already exists"
        fi

        mkdir -p secrets
        if [ ! -f secrets/relay_username ]; then
          printf '%s' 'user@example.com' > secrets/relay_username
          echo "Created secrets/relay_username"
        fi
        if [ ! -f secrets/relay_password ]; then
          printf '%s' 'replace-me' > secrets/relay_password
          echo "Created secrets/relay_password"
        fi
        chmod 600 secrets/relay_username secrets/relay_password
      '';
    };

    "mksp:deploy_validate" = {
      exec = ''
        set -eu
        test -f .env || { echo "Missing .env (copy from .env.example)"; exit 1; }
        test -f secrets/relay_username || { echo "Missing secrets/relay_username"; exit 1; }
        test -f secrets/relay_password || { echo "Missing secrets/relay_password"; exit 1; }
      '';
    };

    "mksp:deploy" = {
      after = [ "mksp:deploy_validate" ];
      exec = ''
        set -eu
        docker compose up -d --build
      '';
    };
  };

  enterShell = ''
    if [ ! -f package.json ]; then
      npm init -y
    fi

    if [ ! -d node_modules ]; then
      npm install \
        dotenv \
        express \
        express-handlebars \
        nodemailer \
        nodemailer-express-handlebars \
        node-ical
    fi
  '';
}
