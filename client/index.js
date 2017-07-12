//const React = require('react');
//const ReactDOM = require('react-dom');
import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Home, Pioneer, Coach } from './components';

const store = createStore(reducer);

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

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
