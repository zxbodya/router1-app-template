import './env';
import './ga';
import './index.scss';
import { router } from './router';

router
  .renderResult()
  .forEach(() => {
    window.ga('send', 'pageview', window.location.pathname);
  });

router.start();
