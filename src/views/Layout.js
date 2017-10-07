import { Link } from 'router1-react';
import React from 'react';

import PropTypes from 'prop-types';

function Layout(props) {
  return (
    <div>
      <ul>
        <li>
          <Link route="home" activeClassName="active">
            Home
          </Link>
        </li>

        <li>
          <Link route="contact" activeClassName="active">
            Contact
          </Link>
        </li>
      </ul>
      {props.children}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.any.isRequired,
};

export default Layout;
