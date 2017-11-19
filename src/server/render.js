import React from 'react';

import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators/first';

import { createServerHistory, Router, RouteCollection } from 'router1';
import { RouterContext } from 'router1-react';

import toObservable from '../utils/toObservable';

import routes from '../routes';
import notFoundHandler from '../notFoundPage/notFoundHandler';

function loadState(transition) {
  let handler;
  if (transition.route.handlers.length) {
    handler = transition.route.handlers[0];
  } else {
    handler = notFoundHandler;
  }

  return toObservable(handler(transition.params));
}

function renderState(state, transition) {
  const { view, redirect, status, meta } = state;

  if (redirect) {
    // return redirect to be sent for user
    return of({ redirect, status });
  }

  return of({
    view: <RouterContext router={transition.router}>{view}</RouterContext>,
    meta,
    status,
  });
}

const routeCollection = new RouteCollection(routes);

export function render(requestPath, cb) {
  const history = createServerHistory(requestPath);

  const router = new Router({
    history,
    routeCollection,
    loadState,
    renderState,
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
