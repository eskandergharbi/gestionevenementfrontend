const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const path = require("path");

module.exports = {
  output: {
    publicPath: "http://localhost:5300/",
  },
  resolve: {
    extensions: [".js", ".json", ".ts", ".html"],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "member",
      filename: "remoteEntry.js",
      exposes: {
        './Module': './projects/member-app/src/app/components/member.module.ts', // Adjust the path to your module
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true},
        "@angular/common": { singleton: true, strictVersion: true},
        "rxjs": { singleton: true, strictVersion: true}
      },
    }),
  ],
};