//const moment = require('moment');
//const momentTz = require('moment-timezone');
const React = require('react');
const createReactClass = require('create-react-class');
const title = 'Calendar';

const Week = createReactClass({
  render () {
    return <div>Week #{this.props.value}</div>;
  }
});

const Calendar = createReactClass({
  render () {
    const weeks = [];
    for (let n = 0; n < this.props.data; n++) {
      weeks.push(n);
    };
    return <div id="calendar">
      <h2>{title}</h2>
      {weeks.map(number => <Week key={number.toString()} value={number}/>)}
      </div>;
  }
});

module.exports = {
  Calendar,
  Week,
};
