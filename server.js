require('dotenv').config({ silent: true });

if (process.env.SSR === '1') {
  require('./build/server/ssr');
} else {
  require('./build/server/nossr');
}
