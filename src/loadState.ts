import notFoundHandler from './notFoundPage/notFoundHandler';
import toObservable from './utils/toObservable';

export function loadState(transition) {
  let handler;
  if (transition.route.handlers.length) {
    handler = transition.route.handlers[0];
  } else {
    handler = notFoundHandler;
  }

  return toObservable(
    handler(transition.params, { router: transition.router })
  );
}
