import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './shared/Header';
import HomePage from './home/HomePageContainer';
import LoginPage from './account/LoginPage';
import ProfilePage from './account/ProfilePage';

export default function Template(props) {
  return (
    <Router>
      <div className="wrapper">
        <Header username="anonymous" />
        <p>{props.progress}</p>
        <div className="content">
        <section className="page-content container-fluid">
          <Route exact path="/account/login" component={LoginPage} />
          <Route exact path="/" component={HomePage} />
          <Route path="/account/profile/:id" component={ProfilePage} />
        </section>
        </div>
      </div>
    </Router>
  );
}
