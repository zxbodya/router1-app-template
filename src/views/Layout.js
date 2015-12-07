import Link from 'router1-react/lib/Link';
import React from 'react';

function Layout(props) {
  return (
    <div>
      <ul>
        <li>
          <Link route="home" activeClassName="active">Home</Link>
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
