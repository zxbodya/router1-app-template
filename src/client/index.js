import {} from './env';
import './ga';
import './index.scss';
import { router } from './router';

import { config } from 'rx';

if (process.env.NODE_ENV !== 'production') {
  config.longStackSupport = true;
}

router
  .renderResult()
  .forEach(() => {
    window.ga('send', 'pageview', window.location.pathname);
  });
