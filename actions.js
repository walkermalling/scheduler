const Fantasy = require('ramda-fantasy');
const ramda = require('ramda');
const db = require('./postgres');
const helpers = require('./helpers');
const log = require('./log');

const compose = ramda.compose;
const head = ramda.head;
const curry = ramda.curry;
const pathOr = ramda.pathOr;

const Future = Fantasy.Future;

const expandWhereClause = helpers.expandWhereClause;
const expandColumns = helpers.expandColumns;
const unzipTuples = helpers.unzipTuples;
const makePredicates = helpers.makePredicates;
const mergeOptions = helpers.mergeOptions;
const validateQueryOptions = helpers.validateQueryOptions;

// getQueryHandler :: String a -> (e -> ()), (b -> ()) -> (e -> b) -> ()  
const getQueryHandler = (tag, reject, resolve) => (error, results) => {
  if (error) {
    log.error({ message: 'error', error, tag });
    reject(error);
  } else if (results) {
    log.verbose({ message: 'success', tag });
    resolve(results);
  } else {
    log.error({ message: 'no results', tag });
    reject({ message: 'no results', tag });
  }
};

// queryBuilder :: Object -> Future Error Object
const queryBuilder = options => Future((reject, resolve) => {
  if (!validateQueryOptions(options)) {
    log.warn({ message: 'invalid query options', options });
    reject({ message: 'invalid query options' });
    return;
  }

  const action = options.action;
  const table = options.table;
  const where = expandWhereClause(options.where);

  let query;

  if (action === 'select') {
    const columns = expandColumns(options.columns);
    query = `SELECT ${columns} FROM ${table} WHERE ${where}`;
  }

  if (action === 'insert') {
    const insert = unzipTuples(options.values);
    query = `INSERT INTO ${table} (${insert.keys.join(', ')}) VALUES (${insert.values.join(', ')})`;
  }

  if (action === 'update') {
    const set = makePredicates(options.values);
    query = `UPDATE ${table} SET ${set} WHERE ${where}`;
  }

  if (action === 'delete') {
    query = `DELETE FROM ${table} WHERE ${where}`;
  }

  const handler = getQueryHandler(action, reject, resolve);
  log.verbose({ query });
  db.query(query, [], handler);
});

// pioneers :: Object -> Future Error Object
const pioneers = compose(
  queryBuilder,
  mergeOptions({
    columns: ['id', 'name', 'tz', 'coach_id'],
    table: 'pioneers',
  })
);

// coaches :: Object -> Future Error Object
const coaches = compose(
  queryBuilder,
  mergeOptions({
    columns: ['id', 'name', 'tz'],
    table: 'coaches',
  })
);

// calls :: Object -> Future Error Object
const calls = compose(
  queryBuilder,
  mergeOptions({
    columns: ['id', 'pioneer_id', 'coach_id', 'time_start', 'duration'],
    table: 'calls',
  })
);

// schedule :: Object -> Future Error Object
// given a Pioneer Id, lookup the coach, and get the coache's schedule
const schedule = options => Future((reject, resolve) => {
  const query = `SELECT c.id as id, c.pioneer_id, c.coach_id, c.time_start
             FROM calls as c
             WHERE c.coach_id = (SELECT coach_id FROM pioneers ${expandWhereClause(options.where)})`;

  const handler = getQueryHandler('select', reject, resolve);
  db.query(query, [], handler);
});

// :: Object -> Object -> Future Error ()
const validateCoach = options => result => Future((reject, resolve) => {
  const coachIsMatch = curry((pioneerId, coachId, pioneerRecord) =>
    pioneerRecord.id === pioneerId && pioneerRecord.coach_id === coachId);

  const isMatch = compose(
    coachIsMatch(
      options.values.pioneer_id,
      options.values.coach_id
    ),
    head,
    pathOr([], ['rows'])
  );

  if (isMatch(result)) {
    resolve(options);
  } else {
    reject(false);
  }
});

module.exports = { pioneers, coaches, calls, schedule, validateCoach };
