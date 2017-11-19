import React from 'react';
import ReactDOM from 'react-dom';

import { bindCallback } from 'rxjs/observable/bindCallback';
import { empty } from 'rxjs/observable/empty';

import { createBrowserHistory, Router, RouteCollection } from 'router1';
import { RouterContext } from 'router1-react';

import toObservable from '../utils/toObservable';

import routes from '../routes';
import notFoundHandler from '../notFoundPage/notFoundHandler';

import { onHashChange, scrollAfterRendered } from './scrollHelpers';

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

// helper to update page meta information after transition
function updateMetaData(meta) {
  document.title = meta.title || '';
  const descList = document.getElementsByName('description');
  for (let i = 0; i < descList.length; i += 1) {
    const e = descList[i];
    if (e.tagName === 'META') {
      e.setAttribute('content', meta.description || '');
    }
  }
}

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
  const { view, redirect, meta } = state;

  if (redirect) {
    // forward to new location on same transition
    transition.forward(redirect);
    return empty();
  }

  updateMetaData(meta);

  return renderObservable(
    <RouterContext router={transition.router}>{view}</RouterContext>,
    appElement
  );
}

function afterRender(stateHandler, { state, transition }) {
  // after state was rendered
  if (state.onBeforeUnload) {
    stateHandler.onBeforeUnload = state.onBeforeUnload;
  }
  if (state.onHashChange) {
    stateHandler.onHashChange = state.onHashChange;
  }
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

export { router };
