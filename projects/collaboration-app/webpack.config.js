const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
  output: {
    publicPath: "http://localhost:3000/",
  },
  resolve: {
    extensions: [".js", ".json", ".ts", ".html"],
  },
  plugins: [
    
    new ModuleFederationPlugin({
      name: "collaboration",
      filename: "remoteEntry.js",
      exposes: {
        './Module': './projects/collaboration-app/src/app/collaboration.module.ts', // Adjust the path to your module
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "rxjs": { singleton: true, strictVersion: true },
      },
    }),
  ],
};