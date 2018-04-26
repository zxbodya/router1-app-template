import React from 'react';

import { of } from 'rxjs';
import { first } from 'rxjs/operators';

import { createServerHistory, Router, RouteCollection } from 'router1';
import { RouterContext } from 'router1-react';

import routes from '../routes';
import { loadState } from '../loadState';

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
