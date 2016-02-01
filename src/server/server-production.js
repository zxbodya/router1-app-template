import server from './server';
import prerender from './prerender';

server({
  defaultPort: 8080,
  prerender,
});
