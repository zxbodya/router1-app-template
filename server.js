require('dotenv').config({ silent: true });

if (process.env.SSR === '1') {
  // eslint-disable-next-line import/no-unresolved
  require('./build/server/ssr');
} else {
  // eslint-disable-next-line import/no-unresolved
  require('./build/server/nossr');
}
