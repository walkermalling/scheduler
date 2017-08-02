import React from 'react';
import moment from 'moment-timezone';
import { find } from 'ramda';

// :: Hour -> Date -> Timezone -> [Call] -> Boolean
const checkAvailable = (hour, date, timezone, schedule) => {
  const timeSlot = moment(date).hour(hour).tz(timezone);
  const matchSlot = find((call) => {
    const m = moment(call.time_start);
    return m.dayOfYear() === timeSlot.dayOfYear() && m.hour() === timeSlot.hour();
  });
  return matchSlot(schedule);
};

// :: Object | undefined -> Boolean -> String
const getButtonClass = (match, own) => {
  if (match) {
    if (own) {
      return 'pure-button pure-button-primary';
    }
    return 'pure-button pure-button-disabled';
  }
  return 'pure-button';
};

const TimePicker = ({ date, schedule, timezone, setTime, pioneer, cancelExistingCall }) => {
  if (date && schedule && timezone && pioneer) {
    return (
      <div style={{ float: 'left', margin: '0 0 0 1em' }}>
        <h3 style={{ margin: 'none' }}>Available Times</h3>
        {[9, 10, 11, 12, 13, 14, 15, 16, 17].map((hour) => {
          const match = checkAvailable(hour, date, timezone, schedule);
          const isOwn = match && match.pioneer_id === pioneer.id;
          return (
            <button
              key={`hour_${hour}}`}
              onClick={() => {
                if (isOwn) {
                  cancelExistingCall(match);
                } else {
                  setTime(hour);
                }
              }}
              style={{ clear: 'both', display: 'block', margin: '0 0 .1em 0' }}
              className={getButtonClass(match, isOwn)}
            >{hour}:00</button>);
        })
        }
      </div>
    );
  }
  return (<p />);
};

export default TimePicker;
