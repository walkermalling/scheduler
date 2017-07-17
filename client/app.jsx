import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Home from './containers/home.jsx';
import Pioneer from './containers/pioneer.jsx';
import Pioneers from './containers/pioneers.jsx';

const App = () => (
  <Router>
    <div className="pure-menu">
      <ul className="pure-menu-list">
        <li className="pure-menu-item"><Link className="pure-menu-link" to="/">Home</Link></li>
        <li className="pure-menu-item"><Link className="pure-menu-link" to="/pioneer">Pioneer</Link></li>
        <li className="pure-menu-item"><Link className="pure-menu-link" to="/coach">Coach</Link></li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Switch>
        <Route exact path="/pioneer/:id" component={Pioneer} />
        <Route exact path="/pioneer" component={Pioneers} />
      </Switch>
    </div>
  </Router>
);

export default App;
