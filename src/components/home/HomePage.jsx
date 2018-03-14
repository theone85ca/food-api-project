import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

const renderLogin = () => (
  <Redirect to="/account/login" />
);

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.renderGreeting = this.renderGreeting.bind(this);
  }

    renderGreeting(name) {
      return (
          <div>
            <p>Hi there, {name}.</p>
          </div>

      );
    }

    render() {
      const { isLoggedIn, firstName } = this.props.authentication;
      return (
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-sm-12 col-md-8">
              <h1>{ isLoggedIn ? this.renderGreeting(firstName) : renderLogin() }</h1>
            </div>
          </div>
        </div>
      );
    }
}
