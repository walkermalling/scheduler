const express = require('express');
const ramda = require('ramda');
const actions = require('./actions');
const log = require('./log');

const pathOr = ramda.pathOr;
const getRows = pathOr([], ['rows']);

const app = express();

app.get('/:table/:id?', (req, res) => {
  const values = {};require('dotenv').config({ silent: true });

  let where = true;
  if (req.params.id) {
    where = { id: req.params.id };
  }
  
  log.verbose({ message: 'request', params: req.params });
  
  actions.query('select', req.params.table, values, where)
    .fork(
      err => res.status(500).send(err),
      result => res.json(getRows(result))
    );
});

app.listen(4000, () => { log.info('API Service listening on 4000') });


