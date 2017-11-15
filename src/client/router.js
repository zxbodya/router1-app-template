import React from 'react';
import ReactDOM from 'react-dom';

import { bindCallback } from 'rxjs/observable/bindCallback';
import { empty } from 'rxjs/observable/empty';
import { map } from 'rxjs/operators/map';
import { tap } from 'rxjs/operators/tap';

import { createBrowserHistory, Router, RouteCollection } from 'router1';
import { RouterContext } from 'router1-react';

import toObservable from '../utils/toObservable';

import routes from '../routes';
import notFoundHandler from '../notFoundPage/notFoundHandler';

import { hashChange, scrollAfterRendered } from './scrollHelpers';

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
            const { view, redirect, meta } = renderable;

            if (redirect) {
              // forward to new location on same transition
              transition.forward(redirect);
              return empty();
            }

            updateMetaData(meta);

            return renderObservable(
              <RouterContext router={transition.router}>{view}</RouterContext>,
              appElement
            ).pipe(
              tap(() => {
                // after state was rendered, set beforeUnload listener
                if (renderable.onBeforeUnload) {
                  this.onBeforeUnload = renderable.onBeforeUnload;
                }
                scrollAfterRendered(transition);
              })
            );
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

const history = createBrowserHistory();

const router = new Router({
  history,
  routeCollection,
  createHandler,
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
