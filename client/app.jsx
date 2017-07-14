import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Home from './containers/home.jsx';

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
    </div>
  </Router>
);

export default App;
