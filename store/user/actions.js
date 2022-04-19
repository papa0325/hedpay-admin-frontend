export default {
  // Авторизация в системе
  async signUp({ commit }, user) {
    const resp = await this.$axios.$post('/auth/register', user);
    commit('setNewTokens', resp.result);
  },
  async refreshTokens({ commit }) {
    const resp = await this.$axios.$post('/refresh-token');
    commit('setNewTokens', resp);
  },
  async getRole({ commit }) {
    const response = await this.$api.getRole();
    commit('setNewRole', response.data.result.role);
  },
};
