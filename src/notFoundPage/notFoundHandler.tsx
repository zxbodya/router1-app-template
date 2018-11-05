import React from 'react';
import NotFound from './NotFound';

export default function() {
  return {
    status: 404,
    meta: {
      title: 'Whoops! Page not found',
      description:
        'Sorry, but the page you were trying to view does not exist.',
    },
    view: <NotFound />,
  };
}
