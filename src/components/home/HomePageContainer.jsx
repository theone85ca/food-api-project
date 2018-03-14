import React from 'react';
import { connect } from 'react-redux';

import HomePage from './HomePage';
import { passwordSaveClear, savePassword } from '../../actions/authentication';

export class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);

    // bound functions

}




  render() {
    const { authentication } = this.props;
    return (

      <HomePage
        authentication={authentication}
        sendPasswordFunction={this.sendPassword}
      />
    );
  }
}

const mapStateToProps = state => ({ authentication: state.authentication });
export default connect(mapStateToProps)(HomePageContainer);
