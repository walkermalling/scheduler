const helpers = require('./helpers');

const queryBuilder = (action, table, values, where) => {
  if (action === 'select') {
    const columns = helpers.expandColumns(values);
    const whereClause = helpers.expandWhereClause(where);
    return `SELECT ${columns} FROM ${table} ${whereClause ? 'WHERE' : ''} ${whereClause}`;
  }

  if (action === 'insert') {
    const insert = helpers.unzipTuples(values);
    return `INSERT INTO ${table} (${insert.keys.join(', ')}) VALUES (${insert.values.join(', ')})`;
  }

  if (action === 'update') {
    const set = helpers.makePredicates(values);
    return `UPDATE ${table} SET ${set} WHERE ${where}`;
  }

  if (action === 'delete') {
    return `DELETE FROM ${table} WHERE ${where}`;
  }

  return false;
};

module.exports = queryBuilder;
