import React from 'react';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Button, Label } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class LoginPage extends React.Component{
  constructor(props) {
    super(props);

    // bind functions
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);

    // component state
    this.state = {
      email: '',
      password: '',
  };
}

// update state as email value changes
handleEmailChange(e) {
  this.setState({ email: e.target.value });
}

// Catch enter clicks
handleKeyPress(target) {
  if (target.charCode === 13) {
    this.complileFormData();
  }
}

// update state as password value changes
handlePasswordChange(e) {
  this.setState({ password: e.target.value });
}

// Handle submissoin once all the data is valid
handleValidSubmit() {
  const { loginFunction } = this.props;
  const formData = this.state;
  loginFunction(formData);
}

  render() {
    return (
      <div className="row">
      <div className="col-12">
      <div className="plant-logo"><img src={'/img/plant.png'} /></div>
        <div className="row justify-content-center">
          <div className="logo"><img src={'/img/logo.png'} /></div>
          <div className="col-10 col-sm-7 col-md-6 col-lg-4 login-form">
            <AvForm onValidSubmit={this.handleValidSubmit} className="">
              <AvGroup>
                <Label for="exampleEmail">Email</Label>
                <AvInput
                  type="email"
                  name="email"
                  id="exampleEmail"
                  placeholder="noreply@musiclist.com"
                  required
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                  onKeyPress={this.handleKeyPress}
                />
                <AvFeedback>A valid email is required to log in.</AvFeedback>
              </AvGroup>
              <AvGroup>
                <Label for="examplePassword">Password</Label>
                <AvInput
                  type="password"
                  name="password"
                  id="examplePassword"
                  placeholder="password"
                  required
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  onKeyPress={this.handleKeyPress}
                />
                 <AvFeedback>Password is required to log in.</AvFeedback>
              </AvGroup>
              <Button color="primary" className="btn-app">Log In</Button>
            </AvForm>
            <span><Link to="/account/reset-password">Forgot your password?</Link></span>
          </div>
        </div>
      </div>
      </div>
    );
  }
}
