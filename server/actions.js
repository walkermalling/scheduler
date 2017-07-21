const Fantasy = require('ramda-fantasy');
const ramda = require('ramda');
const db = require('./postgres');
const queryBuilder = require('./query-builder');
const validateQuery = require('./query-validator').validateQuery;
const log = require('./log');

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

module.exports = { query };
