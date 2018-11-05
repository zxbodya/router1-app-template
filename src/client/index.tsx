import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { bindCallback, EMPTY } from 'rxjs';

import { createBrowserHistory, RouteCollection, Router } from 'router1';
import { RouterContext } from 'router1-react';

import './env';
import './index.scss';

import routes from '../routes';

import { loadState } from '../loadState';
import { updatePageMeta } from '../utils/updatePageMeta';
import { onHashChange, scrollAfterRendered } from './scrollHelpers';

let renderObservable;
if (process.env.SSR === '1') {
  // hydrate on first render instead of render of next
  renderObservable = (vdom, element) => {
    renderObservable = bindCallback(ReactDOM.render);
    // @ts-ignore
    return bindCallback(ReactDOM.hydrate)(vdom, element);
  };
} else {
  renderObservable = bindCallback(ReactDOM.render);
}

const appElement = document.getElementById('app');

function renderState(state, transition) {
  const { view, redirect, meta } = state;

  if (redirect) {
    // forward to new location on same transition
    transition.forward(redirect);
    // since nothing needs to be rendered - return empty observable
    return EMPTY;
  }

  updatePageMeta(meta);

  return renderObservable(
    <RouterContext.Provider value={transition.router}>
      {view}
    </RouterContext.Provider>,
    appElement
  );
}

function afterRender(stateHandler, { state, transition }) {
  // after state was rendered
  if (state.onBeforeUnload) {
    // if state provides before unload hook - replace default with it
    // eslint-disable-next-line no-param-reassign
    stateHandler.onBeforeUnload = state.onBeforeUnload;
  }
  if (state.onHashChange) {
    // if state provides hash change handler - replace default with it
    // eslint-disable-next-line no-param-reassign
    stateHandler.onHashChange = state.onHashChange;
  }
  // do required scrolling after rendering
  scrollAfterRendered(transition);
}

const routeCollection = new RouteCollection(routes);

const history = createBrowserHistory();

const router = new Router({
  history,
  routeCollection,
  loadState,
  onHashChange,
  renderState,
  afterRender,
});

window.onbeforeunload = router.onBeforeUnload;

router.renderResult().forEach(() => {
  // pageview
});

router.start();
