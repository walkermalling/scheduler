import React from 'react';

class Timezone extends React.component {
  componentDidMount() {
    const { dispatch, detectTimezone } = this.props;
    dispatch(detectTimezone());
  }
  render() {
    return (
      <div>{this.props.timezone}</div>
    );
  }
}

export default Timezone;

