import React from 'react';
import { Card, CardBlock, CardText } from 'reactstrap';

export default function Sidebar() {
  return (
    <div className="col-sm-12 col-md-3 col-lg-3 col-xl-2 menu-container">
      <div className="menu">
        <div className="sidelogo">

        </div>
      	<ul>
      		<li>Farm 1</li>
      		<li>Farm 2</li>
      		<li>Fish</li>
      	</ul>

      </div>
    </div>
  );
}
