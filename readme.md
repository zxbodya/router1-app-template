React + RxJS + Router1 Application template
========================

Application starter template.

Intended to be used for implementing single page applications with possibility to implement server side rendering. 
 
Following libraries are used:

1. ReactJS
2. RxJS
3. ExpressJS
4. Router1 + Router1 React
5. rx-react-container

And tools:

1. Webpack - to bundle all the things
2. BabelJS - for es2015 syntax 
3. Node SASS 
4. PostCSS with autoprefixer
5. Nodemon
6. Jest

## How is it different?

Actually it is not much different from all other boilerplates - same tools and similar config.

But there is one thing that makes it a bit different - there is helper script(`dev-server.js`),
made to keep sync server side and client side parts reloads. 

When something was updated client side and needs to be reloaded, before sending reload command,
if server was also changed, it ensures that it is already up and running.

In result it removes some frustration, especially when changing code shared between server and client parts.
 
## Development environment setup

0. Check your Node.js version - it should be version 6 or later
1. Install dependencies using npm (or yarn)
2. start server app, with automatic recompile and reload when something changes
    - `npm run dev-server`
3. open this url in your browser: `http://localhost:8080/`

To customize host and ports used by application - use environment variables:

- `DEV_SERVER_PORT` - port used by dev server, `2992` by default
- `DEV_SERVER_HOST` - host where dev server is running, `localhost` by default

Same thing about app itself:

- `APP_SERVER_HOST` - host where application is running, `localhost` by default (address where app is accessible) 
- `APP_SERVER_PORT` - port user by application, `8080` by default

**if you have different application host and port different than above - be sure to specify them in environment**

Also you can enable some other things for dev-server by environment variables
 
- `HOT=1` to enable hot reload for client side  
- `SSR=1` to enable server-side rendering in dev environment(disabled by default because typically you need test things on client side first)

For setting those variavles - you can create `.env` file at project root 
## Production compilation and server

Build sources:

- `npm run build`

Start server:

- `node ./build/server/ssrServer` (isomorphic rendering)
- `node ./build/server/server` (typical SPA)


## Project folder structure

 - `build` folder with build results
 - `public` static assets
 - `src` application sources
 - `src/client` browser specific sources
 - `src/server` server specific sources
 - `tools` tooling and config scripts (webpack, dev server)

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
2. Make sure that the folder `build/public/debugging` is access controlled, i. e. by password.

SourceMaps have a performance impact on compilation.

SourceMaps contains your un-minimized source code, so you need to restrict access to `build/public/debugging`.
