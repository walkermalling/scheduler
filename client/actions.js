export const addPioneer = text => ({
  type: 'ADD_PIONEER',
  payload: text,
});

export const detectTimezone = timezone => ({
  type: 'DETECT_TIMEZONE',
  payload: timezone
});
