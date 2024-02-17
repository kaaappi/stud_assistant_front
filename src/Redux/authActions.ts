export const SET_ADMIN = 'SET_ADMIN';

export const setAdmin = (isAdmin: boolean) => ({
  type: SET_ADMIN,
  payload: isAdmin,
});
