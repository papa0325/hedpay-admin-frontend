export default {
  async getPairs({ commit }) {
    const response = await this.$api.getPairs();
    response.result.data.map((item) => {
      item.name = item.name.toUpperCase().replace('_', ' / ');
      return item;
    });
    commit('setPairs', response.result.data);
    return response.result.data;
  },
  async getBigChartData({ commit }, id) {
    const response = await this.$api.getBigChartData(id);
    return response.result.data;
  },
};
