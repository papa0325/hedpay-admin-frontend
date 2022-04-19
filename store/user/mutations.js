/* eslint-disable no-param-reassign */

export default {
  setOldTokens(state, { access, refresh, status }) {
    state.tokens.access = access;
    state.tokens.refresh = refresh;
    state.status = status;
  },
  setNewTokens(state, response) {
    state.tokens.access = response.result.access;
    state.tokens.refresh = response.result.refresh;
    state.userRole = response.result.role;
    // state.status = response.ok;
    this.$cookies.set('access', response.result.access, { path: '/' });
    this.$cookies.set('refresh', response.result.refresh, { path: '/' });
  },
  setNewRole(state, role) {
    state.userRole = role;
  },
  logOut(state) {
    this.$cookies.remove('access');
    this.$cookies.remove('refresh');

    state.tokens.access = '';
    state.tokens.refresh = '';
    state.userRole = null;
  },
  setUserInfo(state, user) {
    state.profile = {
      email: user.email,
      avatar: user.avatar,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    };

    state.id = user.id;
    state.wallets = user.wallets;
    state.status = user.status;
  },
  changeUserStatus(state, status) {
    state.status = status;
    window.$cookies.set('status', status, { path: '/' });
  },
};
