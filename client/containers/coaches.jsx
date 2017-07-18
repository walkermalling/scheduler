import React from 'react';
import { connect } from 'react-redux';
import { setCoaches } from '../dispatch';
import 'whatwg-fetch';

const mapStateToProps = state => ({
  coaches: state.coaches || [],
  timezone: state.timezone,
});

const mapDispatchToProps = dispatch => ({
  setCoaches: coaches => dispatch(setCoaches(coaches)),
  fetchCoaches: () => {
    fetch('http://localhost:4000/api/coaches')
      .then(data => data.json())
      .then((data) => {
        dispatch(setCoaches(data));
      })
      .catch((error) => {
        console.log(error);
      });
  },
});

class Coaches extends React.Component {
  componentDidMount() {
    const { setCoaches, fetchCoaches } = this.props;
    setCoaches([]);
    fetchCoaches();
  }

  render() {
    const { coaches = [] } = this.props;
    return (
      <div>
        <h2>Coaches</h2>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Coach</th>
              <th>Timezone</th>
            </tr>
          </thead>
          <tbody>
            { coaches.map(coach => (
              <tr key={`id_${coach.id}`}>
                <td>{coach.id}</td>
                <td>{coach.name}</td>
                <td>{coach.coach_id}</td>
                <td>{coach.tz}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Coaches);
