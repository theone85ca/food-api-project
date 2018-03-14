import React from 'react';
import Sidebar from '../shared/Sidebar';
import { Button } from 'reactstrap';

export default function FarmPage(props) {
  return (
    <div className="row">
      <Sidebar />
        <div className="col-sm-12 col-md-9 col-lg-9 col-xl-10">

          <div className="row">
            <div className="col-sm-12">
              <div className="card stats-line-graph">
                Something here
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 xs-break">
              <div className="card">
                Something here
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 xs-break">
              <div className="card">
                Something here
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 xs-break">
              <div className="card">
                Something here
              </div>
            </div>
          </div>

        </div>
      </div>
  );
}
