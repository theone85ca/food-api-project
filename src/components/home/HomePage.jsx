import React from 'react';
import Sidebar from '../shared/Sidebar';
import { Button } from 'reactstrap';

export default function HomePage(props) {
  const { decrementFunction, incrementFunction } = props;
  return (
    <div className="row">
      <div className="col-sm-12 col-md-8">
        <Button onClick={incrementFunction}>Increment</Button>
        <Button onClick={decrementFunction}>Decrement</Button>
      </div>
      <Sidebar />
    </div>
  );
}
