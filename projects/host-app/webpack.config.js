const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
  output: {
    publicPath: "http://localhost:3002/",
  },
  resolve: {
    extensions: [".js", ".json", ".ts", ".html"],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
        report: "report@http://localhost:3001/remoteEntry.js",
        auth: "auth@http://localhost:1000/remoteEntry.js",
        collaboration: "collaboration@http://localhost:3000/remoteEntry.js",
        ressource: "ressource@http://localhost:2000/remoteEntry.js",
        task: "task@http://localhost:3002/remoteEntry.js",
        member: "member@http://localhost:5300/remoteEntry.js",
        event: "event@http://localhost:3007/remoteEntry.js",
      },
      shared: {
        // Angular core
        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "keycloak-js": { singleton: true, strictVersion: true, requiredVersion: false }
      },
    }),
  ],
};