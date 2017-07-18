import React from 'react';
import moment from 'moment-timezone';

const formatTime = (timestamp, timezone) => moment(timestamp)
      .tz(timezone).format('dddd, MMMM Do YYYY, h:mm a');



const PioneerInfo = ({ pioneer, nextCall, timezone }) => {
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
              <td>{nextCall && formatTime(nextCall.time_start, timezone)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  } else {
    return (<p>No pioneer data</p>);
  }
};

export default PioneerInfo;
