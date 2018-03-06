import React from 'react';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Button, Label } from 'reactstrap';

export default class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);

    // component state
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      username: '',
  };
}

// Put everything together and send it up to the register function
// Handle submission once all form data is valid
handleValidSubmit() {
  const { registerFunction } = this.props;
  const formData = this.state;
  registerFunction(formData);
}

// Handle input changes
handleInputChange(e) {
  this.setState({ [e.currentTarget.id]: e.target.value });
}

// catch enter clicks
handleKeyPress(target) {
  if (target.charCode === 13) {
    target.preventDefault();
    this.handleValidSubmit();
  }
}

  render() {
    return (
      <div className="row justify-connect-center">
        <div className="col-10 col-sm-7 col-md-5 col-lg-4">
        <p>
        Want to get started saving your favorite bands to MusicList?
        Create an account!
      </p>
      <AvForm onValidSubmit={this.handleValidSubmit}>
        <AvGroup>
          <Label for="email">Email</Label>
          <AvInput
            id="email"
            name="email"
            onChange={this.handleInputChange}
            onKeyPress={this.handleKeyPress}
            placeholder="noreply@musiclist.com"
            type="email"
            required
            value={this.state.email}
          />
        </AvGroup>

        <AvGroup>
          <Label for="password">Password</Label>
          <AvInput
            id="password"
            name="password"
            minLength="8"
            onChange={this.handleInputChange}
            onKeyPress={this.handleKeyPress}
            placeholder="password"
            type="password"
            required
            value={this.state.password}
          />
        <AvFeedback>Passwords must be at least eight characters in length.</AvFeedback>
          <span>
            We recommend a password service like&nbsp;
            <a href="https://www.lastpass.com" target="_blank" rel="noopener noreferrer">LastPass</a>
          </span>
        </AvGroup>

        <AvGroup>
          <Label for="username">Username</Label>
          <AvInput
            id="username"
            name="username"
            onChange={this.handleInputChange}
            onKeyPress={this.handleKeyPress}
            placeholder="CaptainCode"
            type="text"
            required
            value={this.state.username}
          />
        </AvGroup>

        <AvGroup>
          <Label for="firstName">First Name</Label>
          <AvInput
            id="firstName"
            name="firstName"
            onChange={this.handleInputChange}
            onKeyPress={this.handleKeyPress}
            placeholder="Jamie"
            type="text"
            required
            value={this.state.firstName}
          />
        </AvGroup>

        <AvGroup>
          <Label for="lastName">Last Name</Label>
          <AvInput
            id="lastName"
            name="lastName"
            onChange={this.handleInputChange}
            onKeyPress={this.handleKeyPress}
            placeholder="Smith"
            type="text"
            required
            value={this.state.lastName}
          />
      </AvGroup>

        <Button color="primary">Register</Button>
      </AvForm>
        </div>
      </div>
    );
  }
}
