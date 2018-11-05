import * as React from 'react';

import { of } from 'rxjs';
import { first } from 'rxjs/operators';

import {
  createServerHistory,
  RouteCollection,
  Router,
  RouteTransition,
} from 'router1';
import { RouterContext } from 'router1-react';

import { loadState } from '../loadState';
import routes from '../routes';

function renderState(state: any, transition: RouteTransition<any, any, any>) {
  const { view, redirect, status, meta } = state;

  if (redirect) {
    // return redirect to be sent for user
    return of({ redirect, status });
  }

  return of({
    view: (
      <RouterContext.Provider value={transition.router}>
        {view}
      </RouterContext.Provider>
    ),
    meta,
    status,
  });
}

const routeCollection = new RouteCollection(routes);

export function render(requestPath: string, cb: any) {
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
