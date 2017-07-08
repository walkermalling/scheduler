const Fantasy = require('ramda-fantasy');
const ramda = require('ramda');
const db = require('./postgres');
const log = require('./log');

const compose = ramda.compose;
const map = ramda.map;
const join = ramda.join;
const tuplize = ramda.toPairs;
const reduce = ramda.reduce;
const head = ramda.head;
const tail = ramda.tail;
const append = ramda.append;
const any = ramda.any;

const Future = Fantasy.Future;

const expandWhereClause = compose(
  join(' AND '),
  map(join(' = ')),
  tuplize
);

const expandColumns = (columns) => {
  if (columns && columns.length > 0) {
    return join(', ', columns);
  }
  return '*';
};

const unzipKeyValueTuples = compose(
  reduce(
    (accum, tuple) => [
      append(head(accum), head(tuple)),
      append(tail(accum), tail(tuple))
    ],
    [[], []]
  ),
  tuplize
);

const zipKeyValueTuples = compose(
  join(', '),
  map(join(' = ')),
  tuplize
);

// mergeOptions :: Object -> Object -> Object
const mergeOptions = base => options => Object.assign({}, base, options);

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

// validateQueryOptions :: Object -> Bool
const validateQueryOptions = (options) => {
  // every query must have at least an action and a table
  if (!options || !options.action || !options.table) {
    return false;
  }

  const anyAreNullOrUndefined = compose(
    any(tuple => tail(tuple) === undefined || tail(tuple) === null),
    tuplize
  );
  if (anyAreNullOrUndefined(options.where)) {
    return false;
  }

  if (options.action === 'update') {
    if (!options.values) {
      return false;
    }
    // prevent accidentally updating every row in a table
    // to update every row, include { where: true }
    if (!options.where) {
      return false;
    }
  }

  return true;
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
    const insert = unzipKeyValueTuples(options.values);
    query = `INSERT INTO ${table} ${insert.keys} VALUES ${insert.values}`;
  }
  if (action === 'update') {
    const set = zipKeyValueTuples(options.values);
    query = `UPDATE ${table} SET ${set} WHERE ${where}`;
  }
  if (action === 'delete') {
    query = `DELETE FROM ${table} WHERE ${where}`;
  }

  const handler = getQueryHandler(action, reject, resolve);

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
const schedule = options => Future((reject, resolve) => {
  const query = `SELECT c.id as id, c.pioneer_id, c.coach_id, c.time_start
             FROM calls as c
             WHERE c.coach_id = (SELECT coach_id FROM pioneers ${expandWhereClause(options.where)})`;

  const handler = getQueryHandler('select', reject, resolve);
  db.query(query, [], handler);
});

module.exports = { pioneers, coaches, calls, schedule };
