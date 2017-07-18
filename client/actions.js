import { head, map, sortBy, filter, compose, prop } from 'ramda';
import moment from 'moment-timezone';
import 'whatwg-fetch';

const convertTimeStart = call => Object.assign({}, call, {
  time_start: moment(call.time_start).format()
});

const timeIsInFuture = (timeStamp) => {
  const time = moment(timeStamp);
  // NOTE in order to diplay a call that should be happening now,
  // we might optionally add the duration of the meeting here
  return time.isAfter(moment(Date.now()));
};

const sortByDate = sortBy(prop('time_start'));
const isFutureCall = compose(timeIsInFuture, prop('time_start'));

const validateResponseType = (response) => {
  if (!Array.isArray(response) || response.length !== 1) {
    throw new Error('Problem with request for pioneer');
  }
  return head(response);
};

const constructTime = (date, hour, minute) => moment(date).hour(hour).minute(minute);

const persistFormat = (date, hour = 0, minute = 0) => constructTime(date, hour, minute).format();

const postCall = (pioneer, state) => {
  const payload = {
    table: 'calls',
    pioneer_id: pioneer.id,
    coach_id: pioneer.coach_id,
    pioneer_tz: pioneer.tz,
    time_start: persistFormat(state.startDate.format('YYYY-MM-DD'), state.startTime, 0),
  };
  return fetch('http://localhost:4000/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(data => Promise.resolve(data))
};

const deleteCall = (call) => {
  return fetch('http://localhost:4000/api', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      table: 'calls',
      id: call.id,
      pioneer_id: call.pioneer_id,
      coach_id: call.coach_id,
    })
  })
    .then(data => Promise.resolve(data));
};

const fetchSchedule = coachId =>
  fetch(`http://localhost:4000/api/calls?coach_id=${coachId}`)
    .then(calls => calls.json())
    .then(map(convertTimeStart))
    .then(sortByDate)
    .then(filter(isFutureCall))
    .then(schedule => Promise.resolve(schedule));

const fetchPioneer = pioneerId =>
  fetch(`http://localhost:4000/api/pioneers/${pioneerId}`)
    .then(data => data.json())
    .then(validateResponseType)
    .then(pioneer => Promise.resolve(pioneer));

export default { fetchSchedule, fetchPioneer, postCall, deleteCall };
