import React from 'react';
import moment from 'moment-timezone';
import { compose, find } from 'ramda';

const formatTime = (timestamp, timezone) => moment(timestamp)
  .tz(timezone).format('dddd, MMMM Do YYYY, h:mm a');

// nextCall :: Integer -> [Calls] -> Call
// return pioneer's next scheduled call, assumes Calls are sorted chronologically
const findNextCall = pioneerId => compose(
  find(call => call.pioneer_id === pioneerId)
);

const PioneerInfo = ({ pioneer, schedule, timezone }) => {
  let nextCall = null;
  if (pioneer && schedule) {
    const match = findNextCall(pioneer.id)(schedule);
    if (match) {
      nextCall = formatTime(match.time_start, timezone);
    }
  }
  if (pioneer) {
    return (
      <div>
        <h2>Pioneer: {pioneer.name}</h2>
        <table className="pure-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Timezone</th>
              <th>Coach ID</th>
              <th>Next Call</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{pioneer.id}</td>
              <td>{pioneer.tz}</td>
              <td>{pioneer.coach_id}</td>
              <td>{nextCall}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  return (<p>No pioneer data</p>);
};

export default PioneerInfo;
