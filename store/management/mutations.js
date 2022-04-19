/* eslint-disable no-param-reassign */

export default {
  setUserData(state, userData) {
    state.userData = userData;
  },
  changeStatus(state) {
    state.userData.isBlocked = !state.userData.isBlocked;
  },
};
