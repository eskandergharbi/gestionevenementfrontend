const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    publicPath: "http://localhost:2000/",
  },
  resolve: {
    extensions: [".js", ".json", ".ts", ".html"],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "project",
      filename: "remoteEntry.js",

      exposes: {
        './Module': './projects/ressource-app/src/app/ressource.module.ts', // Adjust the path to your module
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "rxjs": { singleton: true, strictVersion: true },
      },
    }),
  ],
};