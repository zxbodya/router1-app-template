import React, { Component } from 'react';
import { Link } from 'router1-react';

import PropTypes from 'prop-types';

class Layout extends Component {
  public static propTypes = {
    children: PropTypes.any.isRequired,
  };
  public render() {
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
        {this.props.children}
      </div>
    );
  }
}

export default Layout;
