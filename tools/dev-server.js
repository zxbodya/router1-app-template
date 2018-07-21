/* eslint-disable no-console */
require('dotenv').config({ silent: true });
const path = require('path');
const startDevServer = require('webpack-serve-ssr-helper');

const devHost = process.env.DEV_SERVER_HOST || 'localhost';
const devPort = process.env.DEV_SERVER_PORT || 8080;
const devWsPort = process.env.DEV_SERVER_WS_PORT || 8081;

const appHost = 'localhost';
const appPort = process.env.APP_SERVER_PORT || 8082;
const appUrl = `http://${appHost}:${appPort}`;

const isHot = process.env.HOT === '1';
const isSSR = process.env.SSR === '1';

const frontendConfig = isHot
  ? require('./webpack-hot-dev-server.config.js')
  : require('./webpack-dev-server.config.js');

const backendConfig = require('./webpack-watch-server.config.js');
// remove not used entry point to minimize build time
delete backendConfig.entry[isSSR ? 'nossr' : 'ssr'];

// Start dev server
startDevServer({
  appUrl,
  frontendConfig,
  backendConfig,
  backendWatchOptions: {
    aggregateTimeout: 300,
  },
  nodemonConfig: {
    restartable: false,
    execMap: {
      js: 'node',
    },
    script: path.join(__dirname, '..', 'server'),
    ignore: ['*'],
    watch: [],
    ext: 'noop',
    stdin: false,
    stdout: true,
    env: {
      PORT: appPort,
    },
  },
  // webpack-serve
  serveOptions: {
    devMiddleware: {
      hot: isHot,
      compress: false,
      watchOptions: {
        aggregateTimeout: 300,
      },
      headers: { 'Access-Control-Allow-Origin': '*' },
      publicPath: '/_assets/',
      stats: Object.assign({ colors: true }, frontendConfig.devServer.stats),
    },
    port: devPort,
    host: devHost,
    clipboard: false,
    hotClient: {
      // hot: isHot,
      // port: devWsPort,
    },
  },
});
