import React from 'react';
import moment from 'moment-timezone';
import { find, compose, map, } from 'ramda';

// :: Hour -> Date -> Timezone -> [Call] -> Boolean
const checkAvailable = (hour, date, timezone, schedule) => {
  const timeSlot = moment(date).hour(hour).tz(timezone);
  const matchSlot = find((call) => {
    const m = moment(call.time_start);
    return m.dayOfYear() === timeSlot.dayOfYear() && m.hour() === timeSlot.hour();
  });
  return matchSlot(schedule);
};

const getButtonClass = (hour, date, timezone, schedule, pioneer) => {
  const matchingCall = checkAvailable(hour, date, timezone, schedule);
  if (!matchingCall) {
    return 'pure-button';
  } else if (matchingCall && matchingCall.pioneer_id === pioneer.id) {
    return 'pure-button pure-button-primary';
  }
  return 'pure-button pure-button-disabled';
};

const TimePicker = ({ date, schedule, timezone, setTime, pioneer }) => {
  if (date && schedule && timezone && pioneer) {
    return (
      <div className="pure-u-1-2" style={{ margin: '1em' }}>
        <h3 style={{ margin: 0}}>Available Times</h3>
        {[9, 10, 11, 12, 13, 14, 15, 16, 17].map(hour => (
          <button
            key={`hour_${hour}}`}
            onClick={() => setTime(hour)}
            style={{ clear: 'both', display: 'block' }}
            className={getButtonClass(hour, date, timezone, schedule, pioneer)}
          >
            {hour}:00
          </button>))
        }
      </div>
    );
  }
  return (<p/>);
};

export default TimePicker;
