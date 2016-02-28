/*eslint-disable */
(function (i, s, o, g, r, a, m) {
  i.GoogleAnalyticsObject = r;
  i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments);
    };
  i[r].l = Date.now();
  a = s.createElement(o);
  m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
window.ga('create', 'xx-xxxxxxxx-x', 'auto');

window.gae = function (eventCategory, eventAction, eventLabel, eventValue, fieldsObject) {
  window.ga('send', 'event', eventCategory, eventAction, eventLabel, eventValue, fieldsObject);
};
