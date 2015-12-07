import React from 'react';
import ReactDOM from 'react-dom/server';

import createServerHistory from 'router1/lib/createServerHistory';

import notFoundHandler from '../notFoundPage/notFoundHandler';

import routes from '../routes';
import Router from 'router1/lib/Router';
import RouterContext from 'router1-react/lib/RouterContext';

import toObservable from '../utils/toObservable';
import {Observable} from 'rx';

export default function prerender(requestPath, cb) {
  const history = createServerHistory(requestPath);

  const router = new Router({
    history,
    routes,
    render: (routingResult)=> {
      const handler = routingResult.handler || notFoundHandler;

      return toObservable(handler(routingResult.params))
        .flatMap(({view, redirect, status, meta})=> {
          if (redirect) {
            return Observable.return({redirect, status});
          }
          return view.map(renderApp => {
            const html = ReactDOM.renderToString(
              <RouterContext router={router} render={renderApp}/>
            );
            return {
              view: html,
              meta,
              status,
            };
          });
        });
    },
  });

  router
    .renderResult()
    .first()
    .forEach((data)=> {
      cb(null, data);
    }, error=>cb(error));
}
