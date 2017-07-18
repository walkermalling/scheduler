import 'whatwg-fetch';

const fetchSchedule = coachId => fetch(`http://localhost:4000/api/calls?coach_id=${coachId}`)
  .then(data => data.json());

const fetchPioneers = () => fetch('http://localhost:4000/api/pioneers')
  .then(data => data.json());

const fetchPioneer = pioneerId => fetch(`http://localhost:4000/api/pioneers/${pioneerId}`)
  .then((data) => {
    const result = data.json();
    if (!Array.isArray(result) || result.length !== 1) {
      throw new Error('Problem with request for pioneer');
    }
    const pioneer = result[0];
    if (pioneer.coach_id) {
      return fetchSchedule(pioneer.coach_id)
        .then(schedule => schedule.json())
        .then(schedule => ({
          pioneer,
          schedule,
        }));
    }
    return {
      pioneer,
    };
  });


export default { fetchSchedule, fetchPioneers, fetchPioneer };
