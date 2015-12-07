import React from 'react';
import Link from 'router1-react/lib/Link';

function NotFound() {
  return (
    <div>
      <h1>Oops, not found :(</h1>

      <p>Sorry, but the page you were trying to view does not exist.</p>

      <p>It looks like this was the result of either:</p>
      <ul>
        <li>a mistyped address</li>
        <li>an out-of-date link</li>
      </ul>
    </div>
  );
}

export default NotFound;
