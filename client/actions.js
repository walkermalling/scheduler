export const setPioneer = pioneer => ({
  type: 'SET_PIONEER',
  payload: pioneer,
});

export const setPioneers = pioneers => ({
  type: 'SET_PIONEERS',
  payload: pioneers,
});

export const detectTimezone = timezone => ({
  type: 'DETECT_TIMEZONE',
  payload: timezone
});
