const Fantasy = require('ramda-fantasy');
const ramda = require('ramda');
const db = require('./postgres');
const queryBuilder = require('./query-builder');
const validateQuery = require('./query-validator').validateQuery;
const log = require('./log');

const compose = ramda.compose;
const head = ramda.head;
const pathOr = ramda.pathOr;

const Future = Fantasy.Future;

// query :: Object -> Future
const query = (action, table, values, where) => Future((reject, resolve) => {
  const isValid = validateQuery(action, table, values, where);
  if (!isValid) {
    reject({ message: 'query is invalid' });
    return;
  }

  const queryString = queryBuilder(action, table, values, where);
  log.verbose(queryString);
  db.query(queryString, [], (error, results) => {
    if (error) {
      reject(error);
    } else {
      resolve(results);
    }
  });
});

// schedule :: Integer -> Future
// given a Pioneer Id, lookup the coach, and get the coache's schedule
const getSchedule = pioneerId => Future((reject, resolve) => {
  const queryString = `SELECT c.id as id, c.pioneer_id, c.coach_id, c.time_start
                 FROM calls as c
                 WHERE c.coach_id = (SELECT coach_id 
                                     FROM pioneers
                                     WHERE id = ${pioneerId}
                                    )`;
  db.query(queryString, [], (error, results) => {
    if (error) {
      reject(error);
    } else {
      resolve(results);
    }
  });
});

// :: Integer -> Integer -> Object -> Future
const validateCoach = (pioneerId, coachId, result) => Future((reject, resolve) => {
  const pioneerRecord = compose(head, pathOr([], ['rows']))(result);
  const coachIsMatch = pioneerRecord.id === pioneerId && pioneerRecord.coach_id === coachId;

  if (coachIsMatch) {
    resolve(true);
  } else {
    reject(false);
  }
});

module.exports = { query, getSchedule, validateCoach };
