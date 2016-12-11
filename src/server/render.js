import React from 'react';
import ReactDOM from 'react-dom/server';
import { createServerHistory, Router, RouteCollection } from 'router1';
import { RouterContext } from 'router1-react';
import { config, Observable } from 'rx';

import notFoundHandler from '../notFoundPage/notFoundHandler';
import routes from '../routes';
import toObservable from '../utils/toObservable';

if (process.env.NODE_ENV !== 'production') {
  config.longStackSupport = true;
}

function combineHandlersChain(handlers) {
  return handlers[0];
}

function handlerFromDef(handler, transition) {
  return toObservable(handler(transition.params))
    .map(renderable => renderable && ({
      hashChange() {
      },
      onBeforeUnload() {
        return '';
      },
      render() {
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
    }));
}

const routeCollection = new RouteCollection(routes);

export function render(requestPath, cb) {
  const history = createServerHistory(requestPath);


  const router = new Router({
    history,
    routeCollection,
    createHandler(transition) {
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
    }, error => cb(error), () => router.stop());

  router.start();
}
