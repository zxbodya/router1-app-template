import Contact from './Contact';
import createContainer from 'rx-react-container';

export default function(params) {
  return {
    meta: {
      title: 'Contact us',
      description: 'Don\'t hesitate to email us today',
    },
    view: createContainer(Contact),
  };
}
