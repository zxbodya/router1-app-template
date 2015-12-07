import React from 'react';

import ReactDOM from 'react-dom';

import {Observable} from 'rx';

import './index.scss';

import './ga';

import raf from 'raf';

import createBrowserHistory from 'router1/lib/createBrowserHistory';

const history = createBrowserHistory();

import notFoundHandler from '../notFoundPage/notFoundHandler';

import routes from '../routes';
import Router from 'router1/lib/Router';
import RouterContext from 'router1-react/lib/RouterContext';

import toObservable from '../utils/toObservable';

const renderObservable = Observable.fromCallback(ReactDOM.render);
const appElement = document.getElementById('app');

let scrollAnimationDispose = null;

const cancelScrollAnimation = ()=> {
  if (scrollAnimationDispose) {
    scrollAnimationDispose.dispose();
  }
};


const router = new Router({
  history,
  routes,
  render: (routingResult)=> {
    cancelScrollAnimation();

    const handler = routingResult.handler || notFoundHandler;

    const locationSource = routingResult.location.source;
    const locationHash = routingResult.location.hash;

    return toObservable(handler(routingResult.params))
      .flatMap(({view, meta, redirect})=> {
        if (redirect) {
          history.replace(redirect);
          return Observable.empty();
        }

        document.title = meta.title || '';

        // $('meta[name=description]').text(meta.description || '');

        return view.map(renderApp=> {
          return renderObservable(
            <RouterContext
              router={router}
              render={renderApp}/>,
            appElement
          );
        });
      })
      .do(()=> {
        if (locationHash !== '' && locationHash !== '#') {
          if (locationSource === 'push' || locationSource === 'replace') {
            // scrollto anchor position
            const target = document.getElementById(locationHash.substr(1));
            if (target) {
              setTimeout(()=> {
                window.scrollTo(0, window.pageYOffset + target.getBoundingClientRect().top);
              });
            }
          }
        } else {
          if (locationSource === 'push' || locationSource === 'replace') {
            setTimeout(()=> {
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

  return Observable.create((observer)=> {
    let id;
    const animate = ()=> {
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
    return ()=> {
      cancel = true;
      raf.cancel(id);
    };
  });
}

router.hashChange.forEach(({hash, source})=> {
  cancelScrollAnimation();
  if (source !== 'push' && source !== 'replace') return;
  const target = document.getElementById(hash.substr(1));
  if (target) {
    scrollAnimationDispose = animateScroll(window.pageYOffset + target.getBoundingClientRect().top)
      .takeUntil(Observable.fromEvent(window, 'wheel'))
      .subscribe();
  }
});

router
  .renderResult()
  .forEach(()=> {
    window.ga('send', 'pageview', window.location.pathname);
  });
