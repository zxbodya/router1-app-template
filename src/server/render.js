import React from 'react';

import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { first } from 'rxjs/operators/first';

import { createServerHistory, Router, RouteCollection } from 'router1';
import { RouterContext } from 'router1-react';

import toObservable from '../utils/toObservable';

import routes from '../routes';
import notFoundHandler from '../notFoundPage/notFoundHandler';

const hashChange = () => {};

function handlerFromDef(handler, transition) {
  return toObservable(handler(transition.params)).pipe(
    map(
      renderable =>
        renderable && {
          hashChange,
          onBeforeUnload() {
            // by default do not prevent transition
            return '';
          },
          render() {
            const { view, redirect, status, meta } = renderable;

            if (redirect) {
              // return redirect to be sent for user
              return of({ redirect, status });
            }

            return of({
              view: (
                <RouterContext router={transition.router}>{view}</RouterContext>
              ),
              meta,
              status,
            });
          },
        }
    )
  );
}

function combineHandlersChain(handlers) {
  return handlers[0];
}
function createHandler(transition) {
  if (transition.route.handlers.length) {
    return handlerFromDef(
      combineHandlersChain(transition.route.handlers),
      transition
    );
  }

  return handlerFromDef(notFoundHandler, transition);
}

const routeCollection = new RouteCollection(routes);

export function render(requestPath, cb) {
  const history = createServerHistory(requestPath);

  const router = new Router({
    history,
    routeCollection,
    createHandler,
  });

  router
    .renderResult()
    .pipe(first())
    .subscribe(
      data => {
        cb(null, data);
      },
      error => cb(error),
      () => router.stop()
    );

  router.start();
}
