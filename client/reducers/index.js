export default (state = {}, action) => {
  switch (action.type) {
    case 'ADD_PIONEER':
      return Object.assign({}, state, {
        pioneers: [...state.pioneers, action.payload]
      });
    case 'DETECT_TIMEZONE':
      return Object.assign({}, state, {
        timezone: action.payload
      });
    default:
      return state;
  }
};

