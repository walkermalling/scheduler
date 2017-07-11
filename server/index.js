require('dotenv').config({ silent: true });
const express = require('express');
const repl = require('./repl');
const log = require('./log');

const app = express();

app.listen(3000, () => {
  log.info('Listening on 3000');
});

if (process.env.NODE_ENV !== 'production' && process.env.NO_REPL !== 'true') {
  repl.start();
}
