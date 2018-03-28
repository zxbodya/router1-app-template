const makeWebpackConfig = require('./make-webpack-config');

const config = [
  makeWebpackConfig({
    // commonsChunk: true,
    longTermCaching: true,
    separateStylesheet: true,
    mode: 'production',
    devtool: 'source-map',
  }),
  makeWebpackConfig({
    isServer: true,
    sourceMapSupport: true,
    mode: 'production',
    devtool: 'source-map',
  }),
];

module.exports = config;
