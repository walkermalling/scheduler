export const setPioneer = pioneer => ({
  type: 'SET_PIONEER',
  payload: pioneer,
});

export const setPioneers = pioneers => ({
  type: 'SET_PIONEERS',
  payload: pioneers,
});

export const setCoachSchedule = schedule => ({
  type: 'SET_COACH_SCHEDULE',
  payload: schedule,
});

export const detectTimezone = timezone => ({
  type: 'DETECT_TIMEZONE',
  payload: timezone
});
