import * as React from 'react';

import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';

import {
  createServerHistory,
  RouteCollection,
  Router,
  RouteTransition,
} from 'router1';
import { RouterContext } from 'router1-react';

import { ReactElement } from 'react';
import { loadState } from '../loadState';
import routes from '../routes';
import { RouteState } from '../types';

interface RenderResult {
  status?: number;
  meta?: object;
  redirect?: string;
  view?: ReactElement<any>;
}

function renderState(
  state: RouteState,
  transition: RouteTransition<RouteState, RenderResult, any>
): Observable<RenderResult> {
  const { view, redirect, status, meta } = state;

  if (redirect) {
    // return redirect to be sent for user
    return of<RenderResult>({ redirect, status });
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

  const router: Router<RouteState, RenderResult, any> = new Router({
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
