import React from 'react';

import ReactDOM from 'react-dom';

import { Observable } from 'rx';
import raf from 'raf';

import { createBrowserHistory, Router } from 'router1';
import { RouterContext } from 'router1-react';

const history = createBrowserHistory();

import notFoundHandler from '../notFoundPage/notFoundHandler';

import routes from '../routes';

import toObservable from '../utils/toObservable';

const renderObservable = Observable.fromCallback(ReactDOM.render);
const appElement = document.getElementById('app');

let scrollAnimationDispose = null;

const cancelScrollAnimation = () => {
  if (scrollAnimationDispose) {
    scrollAnimationDispose.dispose();
  }
};


const router = new Router({
  history,
  routes,
  render: (routingResult) => {
    cancelScrollAnimation();

    const handler = routingResult.handlers[0] || notFoundHandler;

    const locationSource = routingResult.location.source;
    const locationHash = routingResult.location.hash;

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
      .do(() => {
        if (routingResult.location.state.noscroll) return;
        // should scroll only on this location sources
        if (locationSource === 'push' || locationSource === 'replace') {
          let target;
          if (locationHash !== '' && locationHash !== '#') {
            target = document.getElementById(locationHash.substr(1));
          }

          if (target) {
            // scrollto anchor position
            setTimeout(() => {
              window.scrollTo(0, window.pageYOffset + target.getBoundingClientRect().top);
            });
          } else {
            setTimeout(() => {
              window.scrollTo(0, 0);
            });
          }
        }
      });
  },
});

/*eslint-disable */
const easing = (t, b, c, d) => {
  // t: current time, b: begInnIng value, c: change In value, d: duration
  // Robert Penner's easeInOutQuad - http://robertpenner.com/easing/
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};
/*eslint-enable */

function animateScroll(top) {
  const duration = 400;
  const startTime = Date.now();
  const startTop = window.pageYOffset;
  let cancel = false;

  return Observable.create((observer) => {
    let id;
    const animate = () => {
      if (cancel) return;
      const elapsed = Date.now() - startTime;
      if (duration <= elapsed) {
        window.scrollTo(0, top);
        observer.onCompleted();
      } else {
        window.scrollTo(0, easing(elapsed, startTop, top - startTop, duration));
        // linear scroll speed
        // const ratio = elapsed / duration;
        // window.scrollTo(0, startTop * (1 - ratio) + top * ratio);
        id = raf(animate);
      }
    };

    animate();
    return () => {
      cancel = true;
      raf.cancel(id);
    };
  });
}

router.hashChange.forEach(({ hash, source }) => {
  cancelScrollAnimation();
  if (source !== 'push' && source !== 'replace') return;
  const target = document.getElementById(hash.substr(1));
  if (target) {
    scrollAnimationDispose = animateScroll(window.pageYOffset + target.getBoundingClientRect().top)
      .takeUntil(Observable.fromEvent(window, 'wheel'))
      .subscribe();
  }
});

export { router };
