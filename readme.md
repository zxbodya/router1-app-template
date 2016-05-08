React + RxJS + Router1 Application template
========================

Application starter template.
Can be used for both: single page and isomorphic applications.
 
Following libraries are used:

1. ReactJS
2. RxJS
3. ExpressJS
4. Router1  + Router1 React

And tools:

1. Webpack - to bundle all resources
2. BabelJS - to support es2015 syntax 
3. Node SASS - to compile 
4. PostCSS
5. Nodemon
 
## Development environment setup

0. check your nodejs version - it should be version 6 or later
1. install dependencies using npm
2. start server app, with automatic recompile and reload when something changes
    - `npm run watch-dev`
    - `npm run watch-prod`, if you need server-side rendering
3. open this url in your browser: `http://localhost:8080/`

(there is alternative options, to start everything separately - check `package.json` for more details)

## Production compilation and server

Build sources:

- `npm run build`

Start server:

- `node ./build/server/prod` (isomorphic rendering)
- `node ./build/server/dev` (SPA)


## Project structure

### Legacy static assets

Asserts in `public` are also served.

### Build visualization

After a production build you may want to visualize your modules and chunks tree.

Use the [analyse tool](http://webpack.github.io/analyse/) with the file at `build/stats.json`.


### Loaders and file types

Many file types are preconfigured, but not every loader is installed. If you get an error like `Cannot find module "xxx-loader"`, you'll need to install the loader with `npm install xxx-loader --save` and restart the compilation.


### Common changes to the configuration

#### Switch devtool to SourceMaps

Change `devtool` property in `webpack-dev-server.config.js` and `webpack-hot-dev-server.config.js` to `"source-map"` (better module names) or `"eval-source-map"` (faster compilation).

SourceMaps have a performance impact on compilation.

#### Enable SourceMaps in production

1. Uncomment the `devtool` line in `webpack-production.config.js`.
2. Make sure that the folder `build\public\debugging` is access controlled, i. e. by password.

SourceMaps have a performance impact on compilation.

SourceMaps contains your unminimized source code, so you need to restrict access to `build\public\debugging`.
