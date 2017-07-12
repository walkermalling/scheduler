require('dotenv').config({ silent: true });
const express = require('express');
const path = require('path');
// const repl = require('./repl');
const log = require('./log');

const app = express();

app.use(express.static('./dist'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve('./dist/index.html'));
});

app.listen(3000, () => {
  log.info('Listening on 3000');
});

if (process.env.NODE_ENV !== 'production' && process.env.NO_REPL !== 'true') {
  // repl.start();
}
