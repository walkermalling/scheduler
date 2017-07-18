import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import 'whatwg-fetch';

import { setPioneer, setCoachSchedule } from '../dispatch';
import actions from '../actions';
import CoachSchedule from '../components/coach-schedule.jsx';
import PioneerInfo from '../components/pioneer-info.jsx';
import TimePicker from '../components/time-picker.jsx';

const constructTime = (date, hour, minute) =>
  moment(date).hour(hour).minute(minute);

const displayFormat = (date, hour = 0, minute = 0) =>
  constructTime(date, hour, minute)
    .format('dddd, MMMM Do YYYY, h:mm a');

const mapStateToProps = state => ({
  pioneer: state.pioneer,
  coachSchedule: state.coachSchedule,
  timezone: state.timezone,
});

const mapDispatchToProps = dispatch => ({
  getPioneer: (pioneerId) => {
    actions.fetchPioneer(pioneerId)
      .then((pioneer) => {
        dispatch(setPioneer(pioneer));
        actions.fetchSchedule(pioneer.coach_id)
          .then(schedule => dispatch(setCoachSchedule(schedule)))
          .catch(console.log)
      })
      .catch(console.log)
  },
  getSchedule: (coachId) => {
    actions.fetchSchedule(coachId)
      .then(schedule => dispatch(setCoachSchedule(schedule)))
      .catch(console.log)
  },
  scheduleCall: (pioneer, state) => {
    actions.postCall(pioneer, state)
      .then((data) => {
        console.log('Response ok, call created');
        actions.fetchSchedule(pioneer.coach_id)
          .then(schedule => dispatch(setCoachSchedule(schedule)))
          .catch(console.log);
      })
      .catch(error => console.log('Error scheduling call', error))
  },
  cancelCall: call =>
    actions.deleteCall(call)
      .then(() => {
        actions.fetchSchedule(call.coach_id)
          .then(schedule => dispatch(setCoachSchedule(schedule)))
          .catch(console.log);
      })
        .catch(error => console.log('Error scheduling call', error))
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
    this.cancelExistingCall = this.cancelExistingCall.bind(this);
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
    console.log(`date change ${date}`);
    this.setState({
      startDate: date,
    });
  }

  handleTimeChange(time = 0) {
    this.setState({
      startTime: time,
      cancelExisting: null,
    });
  }

  cancelExistingCall(call = null) {
    this.setState({
      startTime: null,
      cancelExisting: call,
    });
  }

  render() {
    const {
      pioneer = null,
      coachSchedule = null,
      timezone,
      scheduleCall,
      cancelCall,
    } = this.props;

    if (pioneer) {
      return (
        <div>
          <PioneerInfo pioneer={pioneer} schedule={coachSchedule} timezone={timezone} />

          { this.state.cancelExisting &&
            <div>
              <h3>Cancel Call</h3>
              <button
                onClick={() => cancelCall(this.state.cancelExisting)}
                className="pure-button button-warning"
              >
                Cancel Call on {displayFormat(this.state.cancelExisting.start_time)}
              </button>
            </div>
          }
          { this.state.startDate && this.state.startTime && timezone && pioneer &&
            <div>
              <h3>Schedule Call</h3>
              <button
                onClick={() => scheduleCall(pioneer, this.state, timezone)}
                className="pure-button button-secondary"
              >
                  Schedule Call for {displayFormat(this.state.startDate.format('YYYY-MM-DD'), this.state.startTime, 0, timezone)}
              </button>
            </div>
          }

          <div>
            <div style={{ float: 'left', clear: 'left' }}>
              <h3>Available Dates</h3>
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
              cancelExistingCall={this.cancelExistingCall}
              pioneer={pioneer}
            />
          </div>

          <div style={{ width: '100%', clear: 'both' }} />
          <hr/>
          <button onClick={this.scheduleToggle} style={{ margin: '.3em 0 .3em 0'}}>
            {this.state.displaySchedule ? 'Hide Coach\'s Schedule' : 'Show Coach\'s Schedule'}
          </button>
          <CoachSchedule
            schedule={coachSchedule}
            timezone={timezone}
            display={this.state.displaySchedule}
          />
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
