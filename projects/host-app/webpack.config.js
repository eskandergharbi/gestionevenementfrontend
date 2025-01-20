const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
  output: {
    publicPath: "http://localhost:4200/",
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
        collaboration: "collaboration@http://localhost:3003/remoteEntry.js",
        project: "project@http://localhost:2000/remoteEntry.js",
        task: "task@http://localhost:3005/remoteEntry.js",
        member: "member@http://localhost:5300/remoteEntry.js",
        comment: "comment@http://localhost:3007/remoteEntry.js",
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "rxjs": { singleton: true, strictVersion: true },
      },
    }),
  ],
};