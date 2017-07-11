const ramda = require('ramda');
const actions = require('./actions');
const log = require('./log');

const pick = ramda.pick;

const getRows = pick(['rows']);

const api = {
  getPioneer: (options) => {
    actions.pioneers({ action: 'select', where: options.where })
      .fork(log.error, log.info);
  },
  getCoach: (options) => {
    actions.coaches({ action: 'select', where: options.where })
      .map(getRows)
      .fork(log.error, log.info);
  },
  getCalls: (options) => {
    actions.calls({ action: 'select', where: options.where })
      .map(getRows)
      .fork(log.error, log.info);
  },
  getSchedule: (options) => {
    actions.schedule({ action: 'select', where: options.where })
      .map(getRows)
      .fork(log.error, log.info);
  },
  scheduleCall: (options) => {
    actions.pioneers({
      where: {
        id: options.values.pioneer_id,
      },
      action: 'select'
    })
      .chain(actions.validateCoach(options))
      .chain(actions.calls)
      .fork(log.error, log.info);
  },
};

module.exports = api;
