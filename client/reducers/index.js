const pioneers = ['Adam', 'Bambi', 'Caleb' , 'Donovan', 'Eli', 'Ferris'];

export default (state = [], action) => {
  switch (action.type) {
  case 'ADD_PIONEER':
    return [
      ...state,
      action.payload,
    ];
  default:
    return state;
  }
};
