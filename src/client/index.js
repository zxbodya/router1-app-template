import React from 'react';
import ReactDOM from 'react-dom';

import { bindCallback, EMPTY } from 'rxjs';

import { createBrowserHistory, Router, RouteCollection } from 'router1';
import { RouterContext } from 'router1-react';

import './env';
import './index.scss';

import routes from '../routes';

import { onHashChange, scrollAfterRendered } from './scrollHelpers';
import { loadState } from '../loadState';
import { updatePageMeta } from '../utils/updatePageMeta';

let renderObservable;
if (process.env.SSR === '1') {
  // hydrate on first render instead of render of next
  renderObservable = (...agrs) => {
    renderObservable = bindCallback(ReactDOM.render);
    return bindCallback(ReactDOM.hydrate)(...agrs);
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
    <RouterContext router={transition.router}>{view}</RouterContext>,
    appElement
  );
}

function afterRender(stateHandler, { state, transition }) {
  // after state was rendered
  if (state.onBeforeUnload) {
    // if state provides before unload hook - replace default with it
    stateHandler.onBeforeUnload = state.onBeforeUnload;
  }
  if (state.onHashChange) {
    // if state provides hash change handler - replace default with it
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

window.onbeforeunload = e => {
  const returnValue = router.onBeforeUnload();
  if (returnValue) {
    e.returnValue = returnValue;
    return returnValue;
  }
  return undefined;
};

router.renderResult().forEach(() => {
  // pageview
});

router.start();
