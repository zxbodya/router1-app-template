require('dotenv').config({ silent: true });
const { createServer } = require('./build/server/server');

if (process.env.SSR === '1') {
  const { render } = require('./build/server/render');
  createServer({
    render,
  });
} else {
  createServer({
    render(requestPath, cb) {
      cb(null, { html: '', meta: { title: '', description: '' } });
    },
  });
}
