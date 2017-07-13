const ramda = require('ramda');

const compose = ramda.compose;
const map = ramda.map;
const join = ramda.join;
const tuplize = ramda.toPairs;
const reduce = ramda.reduce;
const append = ramda.append;
const last = ramda.last;
const filter = ramda.filter;

// makePredicates :: Object -> String
const makePredicates = compose(
  join(', '),
  map(join(' = ')),
  tuplize
);

// expandWhereClause :: Object -> String
// NOTE this removes undefined/null values
// NOTE this assumes every key value should be joined by an equals sign
const expandWhereClause = compose(
  join(' AND '),
  map(join(' = ')),
  filter(tuple => last(tuple) !== undefined && last(tuple) !== null),
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

// expandColumns :: Object -> String
// NOTE expect an object of key value pairs; ignore keys with falsy values
// NOTE assume if no columns are requsted that we return all columns
const expandColumns = (values) => {
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    return '*';
  }
  const columns = reduce(
    (accum, key) => {
      if (values[key]) {
        return append(key, accum);
      }
      return accum;
    },
    [],
    Object.keys(values)
  );
  if (columns.length > 0) {
    return join(', ', columns);
  }
  return '*';
};

module.exports = {
  expandWhereClause,
  expandColumns,
  unzipTuples,
  makePredicates,
};
