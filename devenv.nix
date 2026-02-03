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

  packages = [
    pkgs.nodejs
  ];

  enterShell = ''
    if [ ! -f package.json ]; then
      npm init -y
    fi

    if [ ! -d node_modules ]; then
      npm install \
        express \
        express-handlebars \
        nodemailer \
        nodemailer-express-handlebars \
        fs-extra
    fi
  '';
}
