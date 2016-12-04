import server from './app';

server({
  render(requestPath, cb) {
    cb(null, { html: '', meta: { title: '', description: '' } });
  },
});
