import React from 'react';
import Contact from './Contact';

export default function() {
  return {
    meta: {
      title: 'Contact us',
      description: "Don't hesitate to email us today",
    },
    view: <Contact />,
  };
}
