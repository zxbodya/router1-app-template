const makeWebpackConfig = require('./make-webpack-config');

const config = makeWebpackConfig({
  devServer: true,
  devtool: 'eval-source-map',
  debug: true,
});

module.exports = config;
