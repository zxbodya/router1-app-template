/* eslint-disable no-console */
require('dotenv').config({ silent: true });
const path = require('path');
const webpack = require('webpack');
const serve = require('webpack-serve');
const convert = require('koa-connect');
const proxy = require('http-proxy-middleware');
const nodemon = require('nodemon');

const { combineLatest, Subject, BehaviorSubject } = require('rxjs');

const {
  first,
  filter,
  switchMap,
  mergeMap,
  tap,
  map,
  distinctUntilChanged,
} = require('rxjs/operators');

const { waitForPort } = require('./waitForPort');

// configure

const devHost = process.env.DEV_SERVER_HOST || 'localhost';
const devPort = process.env.DEV_SERVER_PORT || 8080;
const devWsPort = process.env.DEV_SERVER_WS_PORT || 8081;

const appHost = 'localhost';
const appPort = process.env.APP_SERVER_PORT || 8082;

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
  env: {
    PORT: appPort,
  },
};

// Start dev server

console.log('Starting development server…');

const frontEndCompiler = webpack(frontendConfig);

function observeStatus(compiler, name) {
  const status = new Subject();
  compiler.hooks.compile.tap(name, () => {
    status.next({ status: 'compile' });
  });
  compiler.hooks.invalid.tap(name, () => {
    status.next({ status: 'invalid' });
  });
  compiler.hooks.done.tap(name, stats => {
    status.next({ status: 'done', stats });
  });
  return status;
}

const frontStatus$ = observeStatus(frontEndCompiler, 'dev-server-sync');
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

const backendStatus$ = observeStatus(backendCompiler, 'dev-server-sync');

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
).subscribe(() => {
  console.log('Starting server');
  nodemonStart$
    .pipe(first(), mergeMap(() => waitForPort(appPort, appHost)))
    .subscribe(() => {
      console.log('Server is ready');
    });
});

const isReady$ = new BehaviorSubject(false);

backendStatus$
  .pipe(
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
  )
  .subscribe(isReady$);

serve({
  compiler: frontEndCompiler,
  dev: devServerConfig,
  port: devPort,
  host: devHost,
  clipboard: false,
  hot: {
    hot: isHot,
    port: devWsPort,
  },
  add: (app, middleware) => {
    const p = convert(proxy('/', { target: `http://${appHost}:${appPort}` }));
    // since we're manipulating the order of middleware added, we need to handle
    // adding these two internal middleware functions.
    middleware.webpack();
    middleware.content();

    app.use(async (ctx, next) => {
      await isReady$.pipe(filter(v => v), first()).toPromise();
      return p(ctx, next);
    });
  },
});

// workaround for nodemon
process.once('SIGINT', () => {
  process.exit(0);
});
