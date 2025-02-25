// const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

// module.exports = withModuleFederationPlugin({

//   name: 'comment-app',

//   exposes: {
//     './Module': './projects/comment-app/src/app/components/comment.module.ts', // Adjust the path to your module
//   },

//   shared: {
//     ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
//   },

// });
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
        './Module': './projects/comment-app/src/app/comment.module.ts', // Adjust the path to your module
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "rxjs": { singleton: true, strictVersion: true },
      },
    }),
  ],
};