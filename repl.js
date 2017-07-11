const repl = require('repl');
const api = require('./api');

module.exports.start = () => {
  const replServer = repl.start({
    prompt: 'scheduler > '
  });

  replServer.context.data = {};
  replServer.context.api = api;
  replServer.on('exit', process.exit);
};

