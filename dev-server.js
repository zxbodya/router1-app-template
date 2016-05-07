import path from 'path';
import webpack from 'webpack';
import nodemon from 'nodemon';
import backendConfig from './webpack-watch-server.config';

function onBuild(done) {
  return (err, stats) => {
    if (err) {
      console.log('Error', err);
    } else {
      console.log(stats.toString({ colors: true }));
    }
    if (done) {
      done(err);
    }
  };
}

const withPrerender = process.argv.indexOf('--with-prerender') !== -1;

delete backendConfig.entry[withPrerender ? 'dev' : 'prod'];

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
}).on('restart', () => {
  console.log('Restarted!');
});

webpack(backendConfig)
  .watch({
    aggregateTimeout: 300,
  }, (err, stats) => {
    onBuild()(err, stats);
    nodemon.restart();
  });
