import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { bindCallback, EMPTY } from 'rxjs';

import {
  createBrowserHistory,
  RouteCollection,
  Router,
  RouteTransition,
  ScrollBehavior,
  ScrollManager,
} from 'router1';
import { RouterContext } from 'router1-react';

import './env';
import './index.scss';

import routes from '../routes';

import { loadState } from '../loadState';
import { RouteState } from '../types';
import { updatePageMeta } from '../utils/updatePageMeta';

let renderObservable: any;
if (process.env.SSR === '1') {
  // hydrate on first render instead of render of next
  renderObservable = (vdom: any, element: any) => {
    renderObservable = bindCallback(ReactDOM.render);
    // @ts-ignore
    return bindCallback(ReactDOM.hydrate)(vdom, element);
  };
} else {
  renderObservable = bindCallback(ReactDOM.render);
}

const appElement = document.getElementById('app');

const renderState = (
  state: RouteState,
  transition: RouteTransition<RouteState, any, any>
) => {
  const { view, redirect, meta } = state;

  if (redirect) {
    // forward to new location on same transition
    transition.forward(redirect);
    // since nothing needs to be rendered - return empty observable
    return EMPTY;
  }

  updatePageMeta(meta || {});

  return renderObservable(
    <RouterContext.Provider value={transition.router}>
      {view}
    </RouterContext.Provider>,
    appElement
  );
};

const routeCollection = new RouteCollection(routes);

const history = createBrowserHistory();

const router: Router<RouteState, any, any> = new Router({
  history,
  routeCollection,
  loadState,
  renderState,
  scrollBehavior: new ScrollBehavior(new ScrollManager()),
});

window.onbeforeunload = router.onBeforeUnload;

router.renderResult().forEach(() => {
  // pageview
});

router.start();
