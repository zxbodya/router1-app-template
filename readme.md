React + RxJS + Router1 Application template
========================

Application starter template.

Intended to be used for implementing single page applications with possibility to have server side rendering. 
 
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

But there is one thing that makes it different - there is helper script(`dev-server.js`),
to keep server side and client side parts reloads in sync. 

It a wrapper around webpack compiler, webpack-serve and a nodemon,
it adds proxy into webpack-serve that ensures that all reloads from browser are loading data from recent
server-side bundle - it will wait before request processing if new build is in progress or when server is not ready yet.       

In result it removes some frustration, especially when changing code shared between server and client parts.

## Development environment setup

0. Check your Node.js version - it should be version 8 or later
1. Install dependencies using npm (or yarn)
2. start server app, with automatic recompile and reload when something changes
    - `npm run dev`
3. open this url in your browser: `http://localhost:8080/`

To customize host and ports used by application - use environment variables:

- `DEV_SERVER_PORT` - port used by dev server, `8080` by default
- `DEV_SERVER_WS_PORT` - port used for webpack notifications websocket, `8081` by default
- `DEV_SERVER_HOST` - host where dev server is running, `localhost` by default 
- `APP_SERVER_PORT` - port user by application, `8082` by default. Is passed as `PORT` environment variable into application.   

**if you have different application host and port different than above - be sure to specify them in environment**

Also you can enable some other things for dev-server by environment variables
 
- `HOT=1` to enable hot reload for client side  
- `SSR=1` to enable server-side rendering in dev environment(disabled by default because typically you need test things on client side first)

For setting those variables - you can create `.env` file at project root.

## React Hot Loader

Configuration is not complete, and right now is not in usable state by default.

To fix it you need to add `module.hot.accept` code. See https://github.com/gaearon/react-hot-loader#getting-started for details(step 4). 
 
## Production compilation and server

Build sources:

- `npm run build`

Start server:

- `node server`

Set env variable `SSR=1` to enable server side rendering.
As for dev-server - you can create `.env` file at project root.

## Project folder structure

 - `build` build stats, server
 - `public` static assets
 - `public/_assets` webpack build results
 - `src` application sources
 - `src/client` browser specific sources
 - `src/server` server specific sources
 - `tools` tooling and config scripts (webpack, dev server)

### Build visualization

After a production build you may want to visualize your modules and chunks tree.

Use the [webpack.github.io/analyse](http://webpack.github.io/analyse/) with the file at `build/stats.json`.

Also I like using [webpack-bundle-analyzer](https://github.com/th0r/webpack-bundle-analyzer) - recommend trying it too.


### Loaders and file types

Many file types are preconfigured, but not every loader is installed. If you get an error like `Cannot find module "xxx-loader"`, you'll need to install the loader with `npm install xxx-loader --save` and restart the compilation.
