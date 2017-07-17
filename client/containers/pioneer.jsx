import React from 'react';
import { connect } from 'react-redux';
import { setPioneer } from '../actions';
// import { Link } from 'react-router-dom';
import 'whatwg-fetch';

const mapStateToProps = state => ({
  pioneer: state.pioneer,
  timezone: state.timezone,
});

const mapDispatchToProps = dispatch => ({
  setPioneer: p => dispatch(setPioneer(p)),
  fetchPioneer: (id) => {
    fetch(`http://localhost:4000/api/pioneers/${id}`)
      .then(data => data.json())
      .then((data) => {
        if (Array.isArray(data) && data.length === 1) {
          dispatch(setPioneer(data[0]));
        }
        // dispatch error notice
      })
      .catch((error) => {
        console.log(error);
      });
  },
});

class Pioneers extends React.Component {
  componentDidMount() {
    const { setPioneer, fetchPioneer } = this.props;
    setPioneer({});
    fetchPioneer(this.props.match.params.id);
  }

  render() {
    const { pioneer = null } = this.props;
    if (pioneer) {
      return (
        <div>
          <h2>Pioneer</h2>
          <p>{pioneer.name} ({pioneer.id})</p>
          <p>Timezone: {pioneer.tz}</p>
        </div>
      );
    } else {
      return (
        <div>
          <p>No pioneer with id {this.props.match.params.id}</p>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pioneers);
