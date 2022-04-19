/* eslint-disable no-param-reassign */

export default {
  setRegisteredUsers(state, data) {
    state.registeredUsers = data.result.count;
  },
  setUsersOnline(state, data) {
    state.usersOnline = data.result.count;
  },
  setUsersByPeriod(state, data) {
    state.usersByPeriod = data.result.count;
  },
  setPairs(state, pairs) {
    state.pairs = pairs;
  },
};
