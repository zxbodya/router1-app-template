import createContainer from 'rx-react-container';
import Home from './Home';

export default function () {
  return {
    meta: {
      title: 'Home page',
      description: 'home page description',
    },
    view: createContainer(Home),
  };
}
