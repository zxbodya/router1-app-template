/* eslint-disable no-console */
require('dotenv').config({ silent: true });
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const nodemon = require('nodemon');

const { combineLatest, Subject } = require('rxjs');

const {
  first,
  filter,
  switchMap,
  mergeMap,
  tap,
  map,
  distinctUntilChanged,
  scan,
} = require('rxjs/operators');

const { waitForPort } = require('./waitForPort');

// configure

const protocol = 'http';
const devHost = process.env.DEV_SERVER_HOST || 'localhost';
const devPort = process.env.DEV_SERVER_PORT || 2992;

const appHost = process.env.APP_SERVER_HOST || 'localhost';
const appPort = process.env.APP_SERVER_PORT || 8080;

const isHot = process.env.HOT === '1';
const isSSR = process.env.SSR === '1';

const frontendConfig = isHot
  ? require('./webpack-hot-dev-server.config.js')
  : require('./webpack-dev-server.config.js');

const devServerConfig = {
  hot: isHot,
  compress: false,
  watchOptions: {
    aggregateTimeout: 300,
  },
  headers: { 'Access-Control-Allow-Origin': '*' },
  publicPath: '/_assets/',
  stats: Object.assign({ colors: true }, frontendConfig.devServer.stats),
};

const devClient = [
  `${require.resolve(
    'webpack-dev-server/client/'
  )}?${protocol}://${devHost}:${devPort}`,
];

if (devServerConfig.hot) {
  devClient.push(require.resolve('webpack/hot/dev-server'));
}

// append webpack dev server client to fronend entrypoints
if (
  typeof frontendConfig.entry === 'object' &&
  !Array.isArray(frontendConfig.entry)
) {
  Object.keys(frontendConfig.entry).forEach(key => {
    frontendConfig.entry[key] = devClient.concat(frontendConfig.entry[key]);
  });
} else {
  frontendConfig.entry = devClient.concat(frontendConfig.entry);
}

const backendConfig = require('./webpack-watch-server.config.js');
// remove not used entry point to minimize build time
delete backendConfig.entry[isSSR ? 'nossr' : 'ssr'];

const backendWatchOptions = {
  aggregateTimeout: 300,
};

const nodemonConfig = {
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
};

// Start dev server

console.log('Starting development server…');

const frontEndCompiler = webpack(frontendConfig);

function observeStatus(compiler) {
  const status = new Subject();
  compiler.plugin('compile', () => {
    status.next({ status: 'compile' });
  });
  compiler.plugin('invalid', () => {
    status.next({ status: 'invalid' });
  });
  compiler.plugin('done', stats => {
    status.next({ status: 'done', stats });
  });
  return status;
}

const frontStatus$ = observeStatus(frontEndCompiler);

const devServer = new WebpackDevServer(frontEndCompiler, devServerConfig);

const notifications$ = new Subject();

const sockWrite = devServer.sockWrite;

devServer.sockWrite = (sockets, type, data) => {
  notifications$.next({ sockets, type, data });
};

devServer.listen(devPort, devHost, () => {});

const backendCompiler = webpack(backendConfig);

backendCompiler.watch(backendWatchOptions, (err, stats) => {
  if (err) {
    console.log('Error', err);
  } else {
    console.log(
      stats.toString(
        Object.assign({ colors: true }, backendConfig.devServer.stats)
      )
    );
  }
});

const backendStatus$ = observeStatus(backendCompiler);

const nodemonStart$ = new Subject();

function startServer() {
  nodemon(nodemonConfig).on('start', () => {
    nodemonStart$.next('start');
  });
}

combineLatest(
  frontStatus$.pipe(filter(({ status }) => status === 'done'), first()),
  backendStatus$.pipe(filter(({ status }) => status === 'done'), first()),
  startServer
).forEach(() => {
  console.log('Starting server');
  nodemonStart$
    .pipe(first(), mergeMap(() => waitForPort(appPort, appHost)))
    .forEach(() => {
      console.log('Server is ready');
    });
});

const isReady$ = backendStatus$.pipe(
  switchMap(({ status }) => {
    if (status === 'done') {
      nodemon.restart();
      console.log('Restarting server');
      return nodemonStart$.pipe(
        first(),
        mergeMap(() => waitForPort(appPort, appHost)),
        tap(() => {
          console.log('Server is ready');
        }),
        map(() => true)
      );
    }
    return [false];
  }),
  distinctUntilChanged()
);

combineLatest(notifications$, isReady$, (notification, isReady) => ({
  notification,
  isReady,
}))
  .pipe(
    scan(
      ({ buffer, prev }, { notification, isReady }) => {
        const nextBuffer =
          notification !== prev ? [...buffer, notification] : buffer;
        if (isReady) {
          return { emit: nextBuffer, buffer: [], prev: notification };
        }
        return { buffer: nextBuffer, prev: notification };
      },
      { buffer: [] }
    ),
    filter(({ emit }) => !!emit)
  )
  .forEach(({ emit }) =>
    emit.forEach(v => {
      try {
        const { sockets, type, data } = v;
        sockWrite(sockets, type, data);
        console.log('websocket notification, type:', type);
      } catch (e) {
        console.log('skip, websocket notification');
      }
    })
  );

// workaround for nodemon
process.once('SIGINT', () => {
  process.exit(0);
});
