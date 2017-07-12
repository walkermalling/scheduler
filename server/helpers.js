const ramda = require('ramda');
// const log = require('./log');

const compose = ramda.compose;
const map = ramda.map;
const join = ramda.join;
const tuplize = ramda.toPairs;
const reduce = ramda.reduce;
const append = ramda.append;
const any = ramda.any;
const last = ramda.last;

const coachAndPioneerMatch = pioneerId => coachId => pioneerRecord =>
  pioneerRecord.id === pioneerId && pioneerRecord.coach_id === coachId;

// makePredicates :: Object -> String
const makePredicates = compose(
  join(', '),
  map(join(' = ')),
  tuplize
);

// expandWhereClause :: Object -> String
// NOTE this assumes every key value should be joined by an equals sign
const expandWhereClause = compose(
  join(' AND '),
  map(join(' = ')),
  tuplize
);

// unzipTuples :: Object -> Object
// create two arrays, one for keys, one for values, but strictly ordered
const unzipTuples = compose(
  reduce(
    (accum, tuple) => ({
      keys: append(tuple[0], accum.keys),
      values: append(tuple[1], accum.values),
    }),
    { keys: [], values: [] }
  ),
  tuplize
);

// expandColumns :: Array -> String
// NOTE assume if no columns are requsted that we return all columns
const expandColumns = (columns) => {
  if (columns && columns.length > 0) {
    return join(', ', columns);
  }
  return '*';
};

// mergeOptions :: Object -> Object -> Object
const mergeOptions = base => options => Object.assign({}, base, options);

// :: Object -> Bool
const anyAreNullOrUndefined = compose(
  any(tuple => last(tuple) === undefined || last(tuple) === null),
  tuplize
);

// hasEnumberableKeys :: Object -> Bool
const hasEnumerableKeys = obj => Object.keys(obj).length > 0;

// validateQueryOptions :: Object -> Bool
const validateQueryOptions = (options) => {
  const nonos = [];

  // for this basic type check, exit early
  if (!options || typeof options !== 'object') {
    // log.warn('options was not an object');
    return false;
  }

  if (!options.action) nonos.push('no action specified');

  if (!options.table) nonos.push('no table specified');

  if (anyAreNullOrUndefined(options.where)) nonos.push('where clause included null/undefined values');

  if (options.action === 'insert') {
    if (!options.values || !hasEnumerableKeys(options.values)) nonos.push('INSERT did not specify values');

    if (anyAreNullOrUndefined(options.values)) nonos.push('INSERT had undefined/null values');
  }

  if (options.action === 'update') {
    // prevent accidentally updating every row in a table
    // to update every row, include { where: true }
    if (!options.where || !hasEnumerableKeys(options.where)) nonos.push('UPDATE was not restricted by a WHERE');
  }

  if (nonos.length > 0) {
    if (process.env.NODE_ENV !== 'production') {
      // nonos.forEach(log.warn);
    }
    return false;
  }
  return true;
};

module.exports = {
  expandWhereClause,
  expandColumns,
  unzipTuples,
  makePredicates,
  mergeOptions,
  validateQueryOptions,
  coachAndPioneerMatch,
};
