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

const history = createBrowserHistory();

const sm = new ScrollManager();

const router = new Router({
  history,
  routes,
  render: (routingResult) => {
    sm.cancelScrollAnimation();

    const handler = routingResult.handlers[0] || notFoundHandler;

    const onRendered = () => {
      const locationSource = routingResult.location.source;
      const locationHash = routingResult.location.hash;

      if (routingResult.location.state.noscroll) return;
      // should scroll only on this location sources
      if (locationSource === 'push' || locationSource === 'replace') {
        let target;
        if (locationHash !== '' && locationHash !== '#') {
          target = document.getElementById(locationHash.substr(1));
        }

        if (target) {
          sm.scrollToElement(target, false);
        } else {
          sm.scrollTo(0, 0, false);
        }
      }
    };

    return toObservable(handler(routingResult.params))
      .flatMap(({ view, meta, redirect }) => {
        if (redirect) {
          history.replace(redirect);
          return Observable.empty();
        }

        document.title = meta.title || '';

        // $('meta[name=description]').text(meta.description || '');

        return view.flatMap(renderApp =>
          renderObservable(
            <RouterContext
              router={router}
              render={renderApp}
            />,
            appElement
          )
        );
      })
      .do(onRendered);
  },
});


router.hashChange.forEach(({ hash, source }) => {
  sm.cancelScrollAnimation();
  if (source !== 'push' && source !== 'replace') return;
  sm.scrollToAnchor(hash, true);
});

export { router };
