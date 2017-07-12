import React from 'react';
import { connect } from 'react-redux';
import { addPioneer } from '../actions';

const mapStateToProps = (state) => ({
  pioneers: state
})

const mapDispatchToProps = {
  add: addPioneer
}

const Pioneer = ({ pioneers, add }) => (
  <div>
    <h2>Pioneer</h2>
    <ul>
      {pioneers.map((p, index) => <li key={index}>{p.toString()}</li>)}
    </ul>
    <form onSubmit={e => {
        e.preventDefault()
        add('Semily')
      }}>
      <button type="Submit">Add Pioneer</button>
    </form>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Pioneer);
