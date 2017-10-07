import React from 'react';

import ReactDOM from 'react-dom';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { createBrowserHistory, Router, RouteCollection } from 'router1';
import { RouterContext } from 'router1-react';

import toObservable from '../utils/toObservable';

import routes from '../routes';
import notFoundHandler from '../notFoundPage/notFoundHandler';

import { ScrollManager } from './ScrollManager';

let renderObservable;
if (process.env.SSR === '1') {
  // hydrate on first render instead of render of next
  renderObservable = (...agrs) => {
    renderObservable = Observable.bindCallback(ReactDOM.render);
    return Observable.bindCallback(ReactDOM.hydrate)(...agrs);
  };
} else {
  renderObservable = Observable.bindCallback(ReactDOM.render);
}

const appElement = document.getElementById('app');

// helper for animated scrolling management
const sm = new ScrollManager();

const onRendered = routingResult => {
  // side effects after state was rendered
  const locationSource = routingResult.location.source;
  const locationHash = routingResult.location.hash;

  // case when scrolling was implicitly disabled in state params
  if (routingResult.location.state.noscroll) return;
  // should scroll only on this location sources
  if (locationSource === 'push' || locationSource === 'replace') {
    let target;
    if (locationHash !== '') {
      target = document.getElementById(locationHash);
    }

    if (target) {
      sm.scrollToElement(target, false);
    } else {
      sm.scrollTo(0, 0, false);
    }
  }
};

function combineHandlersChain(handlers) {
  return handlers[0];
}

const hashChange = ({ hash, source }) => {
  sm.cancelScrollAnimation();
  if (source !== 'push' && source !== 'replace') return;
  sm.scrollToAnchor(hash, true);
};

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
  return toObservable(handler(transition.params)).map(
    renderable =>
      renderable && {
        hashChange,
        onBeforeUnload() {
          // by default do not prevent transition
          return '';
        },
        render() {
          const { redirect, view, meta } = renderable;
          if (redirect) {
            transition.forward(redirect);
            return Observable.empty();
          }

          updateMetaData(meta);

          return view
            .flatMap(renderApp =>
              renderObservable(
                <RouterContext router={transition.router}>
                  {renderApp()}
                </RouterContext>,
                appElement
              )
            )
            .do(() => {
              // after state was rendered, set beforeUnload listener
              if (renderable.onBeforeUnload) {
                this.onBeforeUnload = renderable.onBeforeUnload;
              }
              // do scroll effects after rendering
              onRendered(transition);
            });
        },
      }
  );
}

const router = new Router({
  history: createBrowserHistory(),
  routeCollection: new RouteCollection(routes),
  createHandler(transition) {
    if (transition.route.handlers.length) {
      return handlerFromDef(
        combineHandlersChain(transition.route.handlers),
        transition
      );
    }

    return handlerFromDef(notFoundHandler, transition);
  },
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
