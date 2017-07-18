import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { filter, prop, compose, find } from 'ramda';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import 'whatwg-fetch';

import { setPioneer, setCoachSchedule } from '../dispatch';
import CoachSchedule from '../components/coach-schedule.jsx';
import PioneerInfo from '../components/pioneer-info.jsx';
import TimePicker from '../components/time-picker.jsx';

const timeIsInFuture = (timeStamp) => {
  const time = moment(timeStamp);
  // NOTE in order to diplay a call that should be happening now,
  // we might optionally add the duration of the meeting here
  return time.isAfter(moment(Date.now()));
};

const isFutureCall = compose(timeIsInFuture, prop('time_start'));

// nextCall :: Integer -> [Calls] -> Call
const nextCall = pioneerId => compose(
  find(call => call.pioneer_id === pioneerId)
);

const roundTime = (date, hour = 0, timezone) => moment(date)
  .hour(hour)
  .minute(0)
  .tz(timezone)
  .format('dddd, MMMM Do YYYY, h:mm a');

const mapStateToProps = state => ({
  pioneer: state.pioneer,
  coachSchedule: state.coachSchedule,
  timezone: state.timezone,
});

const mapDispatchToProps = dispatch => ({
  getPioneer: pioneerId => fetch(`http://localhost:4000/api/pioneers/${pioneerId}`)
    .then(data => data.json())
    .then((result) => {
      if (!Array.isArray(result) || result.length !== 1) {
        throw new Error('Problem with request for pioneer');
      }
      const pioneer = result[0];
      dispatch(setPioneer(pioneer));
      if (pioneer.coach_id) {
        fetch(`http://localhost:4000/api/calls?coach_id=${pioneer.coach_id}`)
          .then(calls => calls.json())
          .then(filter(isFutureCall))
          .then(schedule => dispatch(setCoachSchedule(schedule)))
          .catch(console.log); // TODO present and error message
      } else {
        // TODO present a way to assign a coach
        console.log('No coachId');
      }
    })
});

class Pioneers extends React.Component {
  constructor() {
    super();
    this.state = {
      displaySchedule: false,
      startDate: moment(),
      startTime: null,
    };
    this.scheduleToggle = this.scheduleToggle.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }

  componentDidMount() {
    const { getPioneer } = this.props;
    getPioneer(this.props.match.params.id);
  }

  scheduleToggle() {
    this.setState({
      displaySchedule: !this.state.displaySchedule
    });
  }

  handleDateChange(date) {
    this.setState({
      startDate: date,
    });
  }

  handleTimeChange(time = 0) {
    this.setState({
      startTime: time,
    });
  }

  render() {
    const { pioneer = null, coachSchedule = null, timezone } = this.props;
    const next = pioneer && coachSchedule && coachSchedule.length ? nextCall(pioneer.id)(coachSchedule) : '';
    if (pioneer) {
      return (
        <div style={{ width: '100%' }}>
          <PioneerInfo pioneer={pioneer} nextCall={next} timezone={timezone} />
          <button onClick={this.scheduleToggle} >
            {this.state.displaySchedule ? 'Hide Schedule' : 'Show Schedule'}
          </button>
          <CoachSchedule
            schedule={coachSchedule}
            timezone={timezone}
            display={this.state.displaySchedule}
          />

          <h3>Schedule A Call</h3>
          <p>
            { this.state.startDate && this.state.startTime && timezone &&
              roundTime(this.state.startDate, this.state.startTime, timezone)
            }
          </p>
          <div className="pure-u-2-2">
            <div className="pure-u-1-2">
              <DatePicker
                inline
                selected={this.state.startDate}
                onChange={this.handleDateChange}
              />
            </div>
            <TimePicker
              date={this.state.startDate}
              schedule={coachSchedule}
              timezone={timezone}
              setTime={this.handleTimeChange}
              pioneer={pioneer}
            />
          </div>
        </div>
      );
    }
    return (
      <div>
        <p>No pioneer with id {this.props.match.params.id}</p>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pioneers);
