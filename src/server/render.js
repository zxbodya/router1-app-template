import React from 'react';
import { createServerHistory, Router, RouteCollection } from 'router1';
import { RouterContext } from 'router1-react';
import { Observable } from 'rxjs';

import notFoundHandler from '../notFoundPage/notFoundHandler';
import routes from '../routes';
import toObservable from '../utils/toObservable';

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
          return Observable.of({ redirect, status });
        }

        return view.map(
          renderApp => ({
            view: (
              <RouterContext router={transition.router}>
                {renderApp()}
              </RouterContext>
            ),
            meta,
            status,
          })
        );
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
    .subscribe(
      (data) => {
        cb(null, data);
      },
      error => cb(error),
      () => router.stop()
    );

  router.start();
}
