import React from 'react';
import moment from 'moment-timezone';

const formatTime = (timestamp, timezone) => moment(timestamp)
  .tz(timezone).format('dddd, MMMM Do YYYY, h:mm a');

const CoachSchedule = ({ schedule, timezone, display }) => {
  if (display && schedule) {
    return (
      <table className="pure-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Pioneer ID</th>
          </tr>
        </thead>
        <tbody>
          {schedule && schedule.map((call) => {
            if (call && call.time_start && call.pioneer_id) {
              return (
                <tr key={`${call.id}`}>
                  <td>{formatTime(call.time_start, timezone)}</td>
                  <td>{call.pioneer_id}</td>
                </tr>);
            }
            return (<tr/>);
          })}
        </tbody>
      </table>
    );
  }
  return (</div>);
};

export default CoachSchedule;
