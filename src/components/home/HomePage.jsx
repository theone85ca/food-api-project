import React from 'react';
import Sidebar from '../shared/Sidebar';
import { Button } from 'reactstrap';

export default function HomePage() {
  const showAlert = () => {
    alert('You clicked the button. Well done, Draco!');
  };
  return (
    <div className="row">
      <div className="col-sm-12 col-md-8">
        <p>
          This is the home page.
        </p>
        <p>
          Here for your enjoyment is a button:
        </p>
        <Button onClick={showAlert}>Click Me</Button>
      </div>
      <Sidebar />
    </div>
  );
}
