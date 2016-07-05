import { Link } from 'router1-react';
import React from 'react';

function Layout(props) {
  return (
    <div className="container">
      <ul>
        <li>
          <Link route="home" activeClassName="active">Home</Link>
        </li>
        <li>
          <Link route="home" hash="p11" activeClassName="active">Home p11</Link>
        </li>

        <li>
          <Link route="contact" activeClassName="active">Contact</Link>
        </li>
      </ul>
         {props.children}
    </div>
  );
}

Layout.propTypes = {
  children: React.PropTypes.any.isRequired,
};

export default Layout;
