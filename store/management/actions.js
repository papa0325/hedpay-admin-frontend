export default {
  async adminStatusChange({ commit }, model) {
    const adminId = {
      adminId: model.adminId,
    };
    if (model.status === 0) {
      return this.$api.deactivateAdmin(adminId);
    }
    if (model.status === 1) {
      return this.$api.activateAdmin(adminId);
    }
  },
  async userStatusChange({ commit }, model) {
    const banned = {
      userId: model.userId,
      banComment: model.banComment,
    };
    const noBanned = {
      userId: model.userId,
    };
    if (model.isBlocked === false) {
      return this.$api.deactivateUser(banned);
    }
    if (model.isBlocked === true) {
      return this.$api.activateUser(noBanned);
    }
  },
  async getUserData({ commit }, id) {
    const response = await this.$api.getUserData(id);
    commit('setUserData', response.result.data);
  },
};
