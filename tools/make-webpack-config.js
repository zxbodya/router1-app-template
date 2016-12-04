const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoPrefixer = require('autoprefixer');

module.exports = function (options) {
  let entry;

  if (options.prerender) {
    entry = {
      server: './src/server/server',
      ssrServer: './src/server/ssrServer',
    };
  } else {
    entry = {
      main: './src/client/index',
      ie: './src/client/ie',
    };
  }

  const defaultLoaders = [
    { test: /\.coffee$/, loaders: ['coffee-redux-loader'] },
    { test: /\.json5$/, loaders: ['json5-loader'] },
    { test: /\.txt$/, loaders: ['raw-loader'] },
    { test: /\.(png|jpg|jpeg|gif|svg)$/, loaders: ['url-loader?limit=10000'] },
    // {test: /\.(woff|woff2)$/, loaders: ['url-loader?limit=100000']},
    // {test: /\.(ttf|eot)$/, loaders: ['file-loader']},
    { test: /\.(wav|mp3)$/, loaders: ['file-loader'] },
    { test: /\.html$/, loaders: ['html-loader'] },
    { test: /\.(md|markdown)$/, loaders: ['html-loader', 'markdown-loader'] },

    // font awesome
    {
      test: /\.woff(\?v=\d+\.\d+\.\d+|\?.*)?$/,
      loader: 'url?limit=10000&mimetype=application/font-woff',
    },
    {
      test: /\.woff2(\?v=\d+\.\d+\.\d+|\?.*)?$/,
      loader: 'url?limit=10000&mimetype=application/font-woff',
    },
    {
      test: /\.ttf(\?v=\d+\.\d+\.\d+|\?.*)?$/,
      loader: 'url?limit=10000&mimetype=application/octet-stream',
    },
    {
      test: /\.eot(\?v=\d+\.\d+\.\d+|\?.*)?$/,
      loader: 'file',
    },
    {
      test: /\.svg(\?v=\d+\.\d+\.\d+|\?.*)$/,
      loader: 'url?limit=10000&mimetype=image/svg+xml',
    },
  ];
  let stylesheetLoaders = [
    { test: /\.css$/, loaders: ['css-loader!postcss-loader'] },
    { test: /\.less$/, loaders: ['css-loader!postcss-loader!less-loader'] },
    { test: /\.styl$/, loaders: ['css-loader!postcss-loader!stylus-loader'] },
    { test: /\.scss$/, loaders: ['css-loader!postcss-loader!sass-loader?sourceMap'] },
    { test: /\.sass$/, loaders: ['css-loader!postcss-loader!sass-loader?sourceMap&indentedSyntax'] },
  ];

  const alias = {};
  const aliasLoader = {};
  const externals = [];
  const modulesDirectories = ['web_modules', 'node_modules'];
  const extensions = ['', '.web.js', '.js', '.jsx'];

  const host = process.env.HOST || 'localhost';
  const devPort = process.env.DEV_SERVER_PORT || 2992;

  const publicPath = options.devServer ?
    `http://${host}:${devPort}/_assets/` :
    '/_assets/';

  const output = {
    path: path.join(__dirname, '..', 'build', options.prerender ? 'server' : 'public'),
    publicPath,
    filename: `[name].js${options.longTermCaching && !options.prerender ? '?[chunkhash]' : ''}`,
    chunkFilename: (
      (options.devServer ? '[id].js' : '[name].js')
      + (options.longTermCaching && !options.prerender ? '?[chunkhash]' : '')
    ),
    sourceMapFilename: 'debugging/[file].map',
    libraryTarget: options.prerender ? 'commonjs2' : undefined,
    pathinfo: options.debug,
  };
  const excludeFromStats = [
    /node_modules[\\/]react(-router)?[\\/]/,
  ];
  const plugins = [
    function statsPlugin() {
      this.plugin('done', (stats) => {
        const jsonStats = stats.toJson({
          chunkModules: true,
          exclude: excludeFromStats,
        });
        jsonStats.publicPath = publicPath;
        if (!options.prerender) {
          fs.writeFileSync(path.join(__dirname, '..', 'build', 'stats.json'), JSON.stringify(jsonStats));
        } else {
          fs.writeFileSync(path.join(__dirname, '..', 'build', 'server', 'stats.json'), JSON.stringify(jsonStats));
        }
      });
    },
    new webpack.PrefetchPlugin('react'),
  ];
  if (options.prerender) {
    aliasLoader['react-proxy$'] = 'react-proxy/unavailable';
    const nodeModules = fs.readdirSync('node_modules').filter(x => x !== '.bin');

    externals.push(
      {
        '../build/stats.json': 'commonjs ../stats.json',
      },
      ...nodeModules
    );

    plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }));
    if (options.sourceMapSupport) {
      plugins.push(
        new webpack.BannerPlugin('require("source-map-support").install();',
          { raw: true, entryOnly: false })
      );
    }
  }
  if (options.commonsChunk) {
    plugins.push(
      new webpack.optimize.CommonsChunkPlugin(
        'commons',
        `commons.js${options.longTermCaching && !options.prerender ? '?[chunkhash]' : ''}`
      )
    );
  }


  stylesheetLoaders = stylesheetLoaders.map((loaderIn) => {
    const loader = Object.assign({}, loaderIn);
    if (Array.isArray(loader.loaders)) {
      loader.loaders = loader.loaders.join('!');
    }
    if (options.prerender) {
      loader.loaders = 'null-loader';
    } else if (options.separateStylesheet) {
      loader.loaders = ExtractTextPlugin.extract('style-loader', loader.loaders);
    } else {
      loader.loaders = `style-loader!${loader.loaders}`;
    }
    loader.loaders = loader.loaders.split('!');
    return loader;
  });

  if (options.separateStylesheet && !options.prerender) {
    plugins.push(new ExtractTextPlugin(`[name].css${options.longTermCaching ? '?[contenthash]' : ''}`));
  }
  const definitions = {
    'process.env.NODE_ENV': options.debug ? JSON.stringify('development') : JSON.stringify('production'),
  };

  if (options.minimize) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.NoErrorsPlugin()
    );
  }

  plugins.push(
    new webpack.DefinePlugin(definitions)
  );

  if (options.hotComponents) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return {
    entry,
    output,
    target: options.prerender ? 'node' : 'web',
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: options.hotComponents
            ? ['react-hot', 'babel?presets[]=react&presets[]=es2015&plugins[]=transform-runtime']
            : ['babel?presets[]=react&presets[]=es2015&plugins[]=transform-runtime'],
          exclude: /node_modules/,
        },
      ]
        .concat(defaultLoaders)
        .concat(stylesheetLoaders),
    },
    postcss() {
      return [autoPrefixer({ browsers: ['last 2 version'] })];
    },
    devtool: options.devtool,
    debug: options.debug,
    resolveLoader: {
      root: path.join(__dirname, '..', 'node_modules'),
      alias: aliasLoader,
    },
    externals,
    resolve: {
      modulesDirectories,
      extensions,
      alias,
    },
    plugins,
    devServer: {
      stats: {
        cached: false,
        exclude: excludeFromStats,
      },
    },
  };
};