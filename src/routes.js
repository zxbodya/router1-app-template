import homeHandler from './homePage/homeHandler';
import contactHandler from './contactPage/contactHandler';

export default [
  {
    name: 'home',
    url: '/',
    handler: homeHandler,
  },
  {
    name: 'contact',
    url: '/contact',
    handler: contactHandler,
  },
  //  redirect example
  // {
  //   name: 'cases-redirect',
  //   url: '/case/',
  //   handler() {
  //     return {
  //       redirect: '/case',
  //       status: 302,
  //     };
  //   },
  // },
];
