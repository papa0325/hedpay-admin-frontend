export default {
  async fetchAllMarkdownItems({ commit }) {
    const responce = await this.$api.listMarkdown();
    commit('setMarkdownList', responce.result);
  },
  async retrieveMarkdownItem({ commit }, id) {
    const list = await this.$api.retrieveMarkdown(id);
  },
  async updateMarkdown(store, payload) {
    const { id, data } = payload;
    const response = await this.$api.updateMarkdown(id, { newData: data });
    return response;
  },
  async createMarkdown({ commit }, payload) {
    const sampleBody = '# Sample';
    const sampleData = {
      en: {
        body: sampleBody,
        title: payload.en,
      },
      ru: {
        body: sampleBody,
        title: payload.ru,
      },
    };
    this.$api.createMarkdown({ data: { ...sampleData } });
  },
  async deleteMarkdown({ commit }, payload) {
    const response = await this.$api.deleteMarkdown(payload);
    return response;
  },
};
