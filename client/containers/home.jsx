import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import Timezone from '../components/timezone.jsx';
import { detectTimezone } from '../dispatch';

const mapStateToProps = state => ({
  pioneers: state.pioneers,
  timezone: state.timezone,
});

const mapDispatchToProps = dispatch => ({
  getTimezone: tz => dispatch(detectTimezone(tz)),
});

class Home extends React.Component {
  componentDidMount() {
    const { getTimezone } = this.props;
    getTimezone(moment.tz.guess());
  }

  render() {
    const { timezone } = this.props;
    return (
      <div>
        <h2>Home</h2>
        <h3>Welcome to our Scheduler!</h3>
        <Timezone timezone={timezone} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
