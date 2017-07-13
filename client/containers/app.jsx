import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Home, Pioneer, Coach } from '../components/index';

const App = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/pioneer">Pioneer</Link></li>
        <li><Link to="/coach">Coach</Link></li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/pioneer" component={Pioneer} />
      <Route path="/coach" component={Coach} />
    </div>
  </Router>
);

export default App;
