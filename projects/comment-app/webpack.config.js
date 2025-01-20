const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'comment-app',

  exposes: {
    './Module': './projects/comment-app/src/app/components/comment.module.ts', // Adjust the path to your module
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
