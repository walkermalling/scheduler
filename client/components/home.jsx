import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import Timezone from './timezone.jsx';

const mapStateToProps = state => state;

const mapDispatchToProps = {
  detectTimezone: () => moment.tz.guess(),
};

const Home = () => (
  <div>
    <h2>Home</h2>
    <Timezone />
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
