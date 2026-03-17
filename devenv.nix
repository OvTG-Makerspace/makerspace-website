{
  pkgs,
  config,
  lib,
  ...
}: {
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
    pkgs.nodejs
  ];

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
        fs-extra
    fi
  '';
}
