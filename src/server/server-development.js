import server from './server';

server({
  defaultPort: 8080,
  prerender(requestPath, cb) {
    cb(null, { html: '', meta: { title: '', description: '' } });
  },
});
