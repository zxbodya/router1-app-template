import path from 'path';
import webpack from 'webpack';
import nodemon from 'nodemon';

import { Observable, ReplaySubject, Subject } from 'rx';

import backendConfig from './webpack-watch-server.config.js';

import net from 'net';

function waitForPort(port, address) {
  return Observable.create(observer => {
    let s;
    console.log(`waiting for "${address}:${port}"`);
    function connect() {
      process.stdout.write('.');
      s = new net.Socket();
      s.connect(port, address, () => {
        process.stdout.write('+');
        s.destroy();
        observer.onNext('ok');
        observer.onCompleted();
      });
      s.on('error', () => {
        process.stdout.write('x');
        s.destroy();
        setTimeout(connect, 100);
      });
      s.setTimeout(100, () => {
        process.stdout.write('-');
        s.destroy();
        setTimeout(connect, 1);
      });
    }

    connect();
    return () => {
      process.stdout.write('c');
      s.destroy();
    };
  });
}


import WebpackDevServer from 'webpack-dev-server';
import devServerConfig from './webpack-dev-server.config.js';
const protocol = 'http';
const host = 'localhost';
const port = 2992;

const devClient = [`${require.resolve('webpack-dev-server/client/')}?${protocol}://${host}:${port}`];

if (typeof devServerConfig.entry === 'object' && !Array.isArray(devServerConfig.entry)) {
  Object
    .keys(devServerConfig.entry)
    .forEach((key) => {
      devServerConfig.entry[key] = devClient.concat(devServerConfig.entry[key]);
    });
} else {
  devServerConfig.entry = devClient.concat(devServerConfig.entry);
}

const frontStatus$ = new ReplaySubject();
const frontEndCompiler = webpack(devServerConfig);
frontEndCompiler.plugin('compile', () => frontStatus$.onNext({ status: 'compile' }));
frontEndCompiler.plugin('invalid', () => frontStatus$.onNext({ status: 'invalid' }));
frontEndCompiler.plugin('done', (stats) => frontStatus$.onNext({ status: 'done', stats }));

const devServer = new WebpackDevServer(frontEndCompiler, {
  // --progress
  compress: true,
  watchOptions: {
    aggregateTimeout: 100,
  },
  publicPath: '/_assets/',
  stats: Object.assign({ colors: true }, devServerConfig.devServer.stats),
});

const notifications$ = new Subject();
/*eslint-disable */
const sendStats = devServer._sendStats;

devServer._sendStats = (socket, stats, force) => {
  sendStats.call(this, {
    emit(message) {
      notifications$.onNext({ socket, message });
    },
  }, stats, force);
};
/*eslint-enable */

devServer.listen(port, host, () => {
});


function onBuild(done) {
  return (err, stats) => {
    if (err) {
      console.log('Error', err);
    } else {
      console.log(stats.toString(Object.assign({ colors: true }, backendConfig.devServer.stats)));
    }
    if (done) {
      done(err);
    }
  };
}

const withPrerender = process.argv.indexOf('--with-prerender') !== -1;

delete backendConfig.entry[withPrerender ? 'dev' : 'prod'];

const nodemonStatus$ = new Subject();

function startServer() {
  nodemon({
    restartable: false,
    execMap: {
      js: 'node',
    },
    script: path.join(__dirname, withPrerender ? 'build/server/prod' : 'build/server/dev'),
    ignore: ['*'],
    watch: ['foo/'],
    ext: 'noop',
    stdin: false,
    stdout: false,
  })
    .on('start', () => {
      nodemonStatus$.onNext('ready');
    });
}

const backendStatus$ = new ReplaySubject();

const compiler = webpack(backendConfig);
compiler
  .watch({
    aggregateTimeout: 100,
  }, (err, stats) => {
    onBuild()(err, stats);
    nodemonStatus$.onNext('restart');
    nodemon.restart();
  });

compiler.plugin('compile', () => backendStatus$.onNext({ status: 'compile' }));
compiler.plugin('invalid', () => backendStatus$.onNext({ status: 'invalid' }));
compiler.plugin('done', (stats) => backendStatus$.onNext({ status: 'done', stats }));

backendStatus$.forEach(({ status }) => {
  if (status !== 'done') {
    nodemonStatus$.onNext('compile');
  }
});

Observable
  .combineLatest(
    frontStatus$.filter(({ status }) => status === 'done').first(),
    backendStatus$.filter(({ status }) => status === 'done').first(),
    startServer
  )
  .forEach(() => {
    console.log('Starting dev server');
    nodemonStatus$
      .filter(v => v === 'ready')
      .first()
      .flatMap(() => waitForPort(8080, 'localhost'))
      .forEach(() => {
        console.log('Dev server is ready');
      });
  });

const isReady$ = Observable
  .combineLatest(
    backendStatus$,
    nodemonStatus$,
    ({ status }, state) =>
    status === 'done' && state === 'ready'
  )
  .flatMap(v => {
    if (v) return waitForPort(8080, 'localhost').map(() => true);
    return [false];
  })
  .distinctUntilChanged();


notifications$
  .combineLatest(
    isReady$,
    (notification, isReady) => ({ notification, isReady })
  )
  .scan(({ buffer, prev }, { notification, isReady }) => {
    const nextBuffer = notification !== prev ? [...buffer, notification] : buffer;
    if (isReady) {
      return { emit: nextBuffer, buffer: [], prev: notification };
    }
    return { buffer: nextBuffer, prev: notification };
  }, { buffer: [] })
  .filter(({ emit }) => !!emit)
  .forEach(({ emit }) =>
    emit.forEach(
      v => {
        try {
          const { socket, message } = v;
          socket.emit(message);
          console.log('done, ', message);
        } catch (e) {
          console.log('skip, websocket notification');
        }
      }
    )
  );

// workaround for nodemon
process.once('SIGINT', () => {
  process.exit(0);
});
