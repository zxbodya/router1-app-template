const makeWebpackConfig = require('./make-webpack-config');

const config = [
  makeWebpackConfig({
    // commonsChunk: true,
    longTermCaching: true,
    separateStylesheet: true,
    minimize: true,
    devtool: 'source-map',
  }),
  makeWebpackConfig({
    isServer: true,
    sourceMapSupport: true,
    debug: true,
    devtool: 'source-map',
  }),
];

module.exports = config;
