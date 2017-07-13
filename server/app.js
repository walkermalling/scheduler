const express = require('express');
const path = require('path');
const log = require('./log');

const app = express();

app.use(express.static('./dist'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve('./dist/index.html'));
});

app.listen(3000, () => { log.info('APP listening on 3000') });
