const ramda = require('ramda');
const log = require('./log');

const compose = ramda.compose;
const last = ramda.last;
const any = ramda.any;
const tuplize = ramda.toPairs;
const contains = ramda.contains;

// :: Object -> Bool
const anyAreNullOrUndefined = compose(
  any(tuple => last(tuple) === undefined || last(tuple) === null),
  tuplize
);

// hasEnumberableKeys :: Object -> Bool
const hasEnumerableKeys = obj => Object.keys(obj).length > 0;

// validateQueryOptions :: String -> String -> Object -> Object -> Boolean
const validateQuery = (action, table, values, where) => {
  const errors = [];

  if (!action) errors.push('no action specified');

  if (!table) errors.push('no table specified');

  const availableRecords = ['pioneers', 'coaches', 'calls'];

  if (!contains(table, availableRecords)) errors.push('invalid table specified');

  if (typeof where === 'object' && anyAreNullOrUndefined(where)) {
    errors.push('WHERE clause had undefined/null values');
  }

  if (action === 'insert') {
    if (!values || !hasEnumerableKeys(values)) errors.push('INSERT did not specify values');

    if (anyAreNullOrUndefined(values)) errors.push('INSERT had undefined/null values');
  }

  if (action === 'update') {
    if (!where || !hasEnumerableKeys(where)) errors.push('UPDATE needs valid WHERE clause');
  }

  if (errors.length > 0) {
    if (process.env.NODE_ENV !== 'production') {
      log.warn({
        message: 'there were problems with the query',
        problems: errors
      });
    }
    return false;
  }
  return true;
};

module.exports = {
  anyAreNullOrUndefined,
  hasEnumerableKeys,
  validateQuery,
};

