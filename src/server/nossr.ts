import { createServer } from './server';

createServer((_requestPath, cb) => {
  cb(null, { view: '', meta: { title: '', description: '' } });
});
