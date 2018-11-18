import { createServer } from './server';

createServer((requestPath, cb) => {
  cb(null, { view: '', meta: { title: '', description: '' } });
});
