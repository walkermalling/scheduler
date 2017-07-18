require('dotenv').config({ silent: true });
const express = require('express');
const bodyParser = require('body-parser');
const ramda = require('ramda');
const cors = require('cors');
const actions = require('./actions');
const log = require('./log');

const pathOr = ramda.pathOr;
const getRows = pathOr([], ['rows']);
const omit = ramda.omit;
const pick = ramda.pick;

const app = express();

app.use(bodyParser.json());

app.options('/api', cors());

app.post('/api', cors(), (req, res) => {
  const where = {};
  const values = omit(['id', 'table'], req.body);
  actions.query('insert', req.body.table, values, where)
    .fork(
      err => res.status(500).send(err),
      result => res.json(result)
    );
});

app.delete('/api', cors(), (req, res) => {
  const where = pick(['id'], req.body);
  const values = {};
  actions.query('delete', req.body.table, values, where)
    .fork(
      err => res.status(500).send(err),
      result => res.json(result)
    );
});

app.get('/api/:table/:id?', cors(), (req, res) => {
  log.verbose(req.params);

  const values = {};

  let where = true;
  if (req.params.id) {
    where = { id: req.params.id };
  }

  if (req.query) {
    where = Object.assign({}, where, req.query);
  }

  log.verbose({ message: 'request', params: req.params });

  actions.query('select', req.params.table, values, where)
    .fork(
      err => res.status(500).send(err),
      result => res.json(getRows(result))
    );
});

app.listen(4000, () => log.info('API Service listening on 4000'));
