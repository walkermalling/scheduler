const Fantasy = require('ramda-fantasy');
const ramda = require('ramda');
const db = require('./postgres');
const log = require('./log');

const compose = ramda.compose;
const map = ramda.map;
const join = ramda.join;
const tuplize = ramda.toPairs;
const concat = ramda.concat;

const Future = Fantasy.Future;

const whereClause = compose(
  concat('WHERE '),
  join(' AND '),
  map(join(' = ')),
  tuplize
);

// mergeOptions :: Object -> Object -> Object
const mergeOptions = base => options => Object.assign({}, base, options);

const getQueryHandler = (tag, reject, resolve) => (error, results) => {
  if (error) {
    log.error({ message: 'error', error, tag });
    reject(error);
  } else if (results && results.rowCount > 0) {
    log.verbose({ message: 'success', tag });
    resolve(results);
  } else {
    log.error({ message: 'no results', tag });
    reject({ message: 'no results', tag });
  }
};

// simpleSelect :: Object -> Future Error Object
const simpleSelect = options => Future((reject, resolve) => {
  const query = `SELECT ${join(', ', options.columns)} FROM ${options.table} ${whereClause(options.where)}`;
  const handler = getQueryHandler('simple select', reject, resolve);
  db.query(query, [], handler);
});

// pioneers :: Object -> Future Error Object
const pioneers = compose(
  simpleSelect,
  mergeOptions({
    columns: ['id', 'name', 'tz', 'coach_id'],
    table: 'pioneers',
  })
);

// coaches :: Object -> Future Error Object
const coaches = compose(
  simpleSelect,
  mergeOptions({
    columns: ['id', 'name', 'tz'],
    table: 'coaches',
  })
);

// calls :: Object -> Future Error Object
const calls = compose(
  simpleSelect,
  mergeOptions({
    columns: ['id', 'pioneer_id', 'coach_id', 'time_start', 'duration'],
    table: 'calls',
  })
);

// schedule :: Object -> Future Error Object
const schedule = options => Future((reject, resolve) => {
  const query = `SELECT c.id as id, c.pioneer_id, c.coach_id, c.time_start
             FROM calls as c
             WHERE c.coach_id = (SELECT coach_id FROM pioneers ${whereClause(options.where)})`;

  const handler = getQueryHandler('schedule select', reject, resolve);
  db.query(query, [], handler);
});

module.exports = { pioneers, coaches, calls, schedule };
