import { createServer } from './server';

createServer({
  render(requestPath, cb) {
    cb(null, { view: '', meta: { title: '', description: '' } });
  },
});
