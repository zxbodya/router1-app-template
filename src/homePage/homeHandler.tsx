import React from 'react';
import Home from './Home';

export default function() {
  return {
    meta: {
      title: 'Home page',
      description: 'home page description',
    },
    view: <Home />,
  };
}
