import Home from './Home';
import createContainer from 'rx-react-container';

export default function() {
  return {
    meta: {
      title: 'Home page',
      description: 'home page description',
    },
    view: createContainer(Home),
  };
}
