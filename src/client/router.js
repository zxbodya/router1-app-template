import React from 'react';

import ReactDOM from 'react-dom';

import { Observable } from 'rx';

import { createBrowserHistory, Router } from 'router1';
import { RouterContext } from 'router1-react';

import toObservable from '../utils/toObservable';

import routes from '../routes';
import notFoundHandler from '../notFoundPage/notFoundHandler';

import { ScrollManager } from './ScrollManager';

const renderObservable = Observable.fromCallback(ReactDOM.render);
const appElement = document.getElementById('app');

const sm = new ScrollManager();

const onRendered = (routingResult) => {
  // side effects after state was rendered
  const locationSource = routingResult.location.source;
  const locationHash = routingResult.location.hash;

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

function handlerFromDef(handler, transition) {
  return toObservable(handler(transition.params))
    .map(renderable => ({
      hashChange,
      onBeforeUnload() {
        return '';
      },
      render() {
        if (!renderable) {
          throw new Error('Route handler is not loaded');
        }
        const { redirect, view, meta } = renderable;
        if (redirect) {
          transition.forward(redirect);
          return Observable.empty();
        }

        document.title = meta.title || '';

        // $('meta[name=description]').text(meta.description || '');

        return view.flatMap(
          renderApp =>
            renderObservable(
              <RouterContext
                router={transition.router}
                render={renderApp}
              />,
              appElement
            )
        )
          .do(() => {
            if (renderable.onBeforeUnload) {
              this.onBeforeUnload = renderable.onBeforeUnload;
            }
            onRendered(transition);
          });
      },
    }));
}

const router = new Router({
  history: createBrowserHistory(),
  routes,
  createHandler(transition) {
    if (transition.route.handlers.length) {
      return handlerFromDef(
        combineHandlersChain(transition.route.handlers),
        transition);
    }

    return handlerFromDef(
      notFoundHandler,
      transition);
  },
});


window.onbeforeunload = (e) => {
  const returnValue = router.onBeforeUnload();
  if (returnValue) {
    e.returnValue = returnValue;
    return returnValue;
  }
};

export { router };
