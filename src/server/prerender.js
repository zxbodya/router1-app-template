import React from 'react';
import ReactDOM from 'react-dom/server';

import { createServerHistory, Router } from 'router1';

import notFoundHandler from '../notFoundPage/notFoundHandler';

import routes from '../routes';

import { RouterContext } from 'router1-react';

import toObservable from '../utils/toObservable';
import { config, Observable } from 'rx';

if (process.env.NODE_ENV !== 'production') {
  config.longStackSupport = true;
}

function combineHandlersChain(handlers) {
  return handlers[0];
}

function handlerFromDef(handler, transition) {
  let renderable = null;
  return {
    load() {
      return toObservable(handler(transition.params))
        .take(1)
        .do(l => {
          renderable = l;
        })
        .toPromise();
    },
    hashChange() {
    },
    onBeforeUnload() {
      return '';
    },
    render() {
      if (!renderable) {
        throw new Error('Route handler is not loaded');
      }
      const { view, redirect, status, meta } = renderable;

      if (redirect) {
        return Observable.return({ redirect, status });
      }

      return view.map(
        renderApp => {
          const html = ReactDOM.renderToString(
            <RouterContext router={transition.router} render={renderApp} />
          );
          return {
            view: html,
            meta,
            status,
          };
        });
    },
  };
}

export default function prerender(requestPath, cb) {
  const history = createServerHistory(requestPath);

  const router = new Router({
    history,
    routes,
    createHandler(transition, route, params) {
      if (transition.route.handlers.length) {
        return handlerFromDef(
          combineHandlersChain(transition.route.handlers),
          transition);
      }

      return handlerFromDef(
        notFoundHandler,
        transition);
    },
  });

  router
    .renderResult()
    .first()
    .forEach((data) => {
      cb(null, data);
    }, error => cb(error), router.stop());

  router.start();
}
