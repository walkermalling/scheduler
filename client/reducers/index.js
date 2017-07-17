export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_PIONEER':
      return Object.assign({}, state, {
        pioneer: action.payload
      });
    case 'SET_PIONEERS':
      return Object.assign({}, state, {
        pioneers: action.payload
      });
    case 'DETECT_TIMEZONE':
      return Object.assign({}, state, {
        timezone: action.payload
      });
    default:
      return state;
  }
};

