import createContainer from 'rx-react-container';
import Contact from './Contact';

export default function () {
  return {
    meta: {
      title: 'Contact us',
      description: 'Don\'t hesitate to email us today',
    },
    view: createContainer(Contact),
  };
}
