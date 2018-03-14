import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FarmPage from './FarmPage';

export function FarmPageContainer(props) {
  return (
    <FarmPage/>
  );
}
export default connect()(FarmPageContainer);
