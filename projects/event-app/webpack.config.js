const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
  output: {
    publicPath: "http://localhost:3007/",
  },
  resolve: {
    extensions: [".js", ".json", ".ts", ".html"],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "collaboration",
      filename: "remoteEntry.js",
      exposes: {
        './Module': './projects/event-app/src/app/components/event.module.ts',
      },
      shared: {
    "@angular/core": { singleton: true, strictVersion: true, requiredVersion: '^19.2.8' },
    "@angular/common": { singleton: true, strictVersion: true, requiredVersion: '^19.2.8' },
    "@angular/router": { singleton: true, strictVersion: true, requiredVersion: '^19.2.8' },
    'primeng': { singleton: true, strictVersion: true, requiredVersion: '^19.1.1' },
    'primeng/icons': { singleton: true, strictVersion: true, requiredVersion: '^19.1.1' },
    'primeicons': { singleton: true, strictVersion: true, requiredVersion: '^7.0.0' },
    'primeng/icons/filter': {
      singleton: true,
      eager: true, // 👈 allow eager loading
      strictVersion: false,
    },
      }
    }),
  ],
};
