import React from 'react';
import { connect } from 'react-redux';
import { setPioneers } from '../dispatch';
import { Link } from 'react-router-dom';
import 'whatwg-fetch';

const mapStateToProps = state => ({
  pioneers: state.pioneers || [],
  timezone: state.timezone,
});

const mapDispatchToProps = dispatch => ({
  setPioneers: ps => dispatch(setPioneers(ps)),
  fetchPioneers: () => {
    fetch('http://localhost:4000/api/pioneers')
      .then(data => data.json())
      .then((data) => {
        dispatch(setPioneers(data));
      })
      .catch((error) => {
        console.log(error);
      });
  },
});

class Pioneers extends React.Component {
  componentDidMount() {
    const { setPioneers, fetchPioneers } = this.props;
    setPioneers([]);
    fetchPioneers();
  }

  render() {
    const { pioneers = [] } = this.props;
    return (
      <div>
        <h2>Pioneer</h2>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Coach</th>
              <th>Timezone</th>
              <th>Schedule</th>
            </tr>
          </thead>
          <tbody>
            { pioneers.map(p => (
              <tr key={`id_${p.id}`}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.coach_id}</td>
                <td>{p.tz}</td>
                <td><Link to={`/pioneer/${p.id}`} >Edit Schedule</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pioneers);
