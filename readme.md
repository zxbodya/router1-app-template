Router1 Application template
========================

Requirements:

1. nodejs
2. pm2

## Setup 

install dependencies: `npm i`

## Development server


#### 1. start the webpack-dev-server:

watch and recompile client-side part

`npm run dev-server` 

or with hot module reload:

`npm run hot-dev-server`
 

#### 2. watcher for server script

`npm run watch-server`


#### 3. start app server
 
- `npm run start-dev` (without server side rendering)
- `npm run start` (with server side rendering)

#### 4. open this url in your browser

http://localhost:8080/

It will automatically recompile and refresh the page when files are changed.

## Production compilation and server

build the client bundle and the prerendering bundle

`npm run build`

start the node.js server in production mode

`node ./build/server/prod` (isomorphic rendering)
`node ./build/server/dev` (SPA)

## Legacy static assets

Asserts in `public` are also served.


## Build visualization

After a production build you may want to visualize your modules and chunks tree.

Use the [analyse tool](http://webpack.github.io/analyse/) with the file at `build/stats.json`.


## Loaders and file types

Many file types are preconfigured, but not every loader is installed. If you get an error like `Cannot find module "xxx-loader"`, you'll need to install the loader with `npm install xxx-loader --save` and restart the compilation.


## Common changes to the configuration

### Switch devtool to SourceMaps

Change `devtool` property in `webpack-dev-server.config.js` and `webpack-hot-dev-server.config.js` to `"source-map"` (better module names) or `"eval-source-map"` (faster compilation).

SourceMaps have a performance impact on compilation.

### Enable SourceMaps in production

1. Uncomment the `devtool` line in `webpack-production.config.js`.
2. Make sure that the folder `build\public\debugging` is access controlled, i. e. by password.

SourceMaps have a performance impact on compilation.

SourceMaps contains your unminimized source code, so you need to restrict access to `build\public\debugging`.
