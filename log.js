const ramda = require('ramda');
const chalk = require('chalk');

const compose = ramda.compose;

const NODE_ENV = process.env.NODE_ENV;

const ensureType = (payload) => {
  if (Array.isArray(payload)) {
    return { data: payload };
  }
  if (typeof payload === 'object') {
    return payload;
  }
  return { messsage: payload };
};

const addTime = (obj) => {
  if (NODE_ENV !== 'production') {
    return obj;
  }
  if (obj && obj.time) {
    return obj;
  }
  return Object.assign({ time: Date.now() }, obj);
};

const format = (obj) => {
  if (NODE_ENV === 'production') {
    return JSON.stringify(obj);
  }
  return JSON.stringify(obj);
};

const colorize = color => (str) => {
  if (NODE_ENV === 'production') {
    return str;
  }
  if (chalk && chalk[color]) {
    return chalk[color](str);
  }
  return str;
};

const log = color => compose(
  console.log, // eslint-disable-line no-console
  colorize(color),
  format,
  addTime,
  ensureType
);

module.exports = {
  error: log('red'),
  warn: log('orange'),
  info: log('white'),
  verbose: log('gray'),
};
