const pg = require('pg');
const log = require('./log');

const config = {
  max: 10,
  database: 'arivale',
  idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);

pool.on('error', (err, client) => {
  log.error('client error', err.message, err.stack, client);
});

const query = (queryText, paramArray, callback) => {
  pool.query(queryText, paramArray, callback);
};

const connect = (callback) => {
  pool.connect(callback);
};

module.exports = { query, connect };
