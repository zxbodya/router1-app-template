import { RouteTransition } from 'router1/dist/Router';
import notFoundHandler from './notFoundPage/notFoundHandler';
import { RouteState } from './types';
import toObservable from './utils/toObservable';

export function loadState(transition: RouteTransition<RouteState, any, any>) {
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
