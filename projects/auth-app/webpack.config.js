const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    publicPath: "http://localhost:1000/",
  },
  resolve: {
    extensions: [".js", ".json", ".ts", ".html"],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "auth",
      filename: "remoteEntry.js",
      exposes: {
        './KeycloakService': './src/app/services/keycloak.service.ts',

      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "@angular/router": { singleton: true },
        "rxjs": { singleton: true, strictVersion: true },
      },
    }),
  ],
};