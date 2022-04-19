import { REFRESH_TOKENS } from '~/store/user/consts';

export default ({ store }, inject) => {
  const tokensRefresher = {
    pendingRequest: null,
    async refreshTokens() {
      if (!this.pendingRequest) {
        this.pendingRequest = new Promise((resolve, reject) => {
          store.dispatch(`user/${REFRESH_TOKENS}`)
            .then((resp) => {
              store.commit('user/setNewTokens', resp.result);
              resolve(resp.result);
            })
            .catch((err) => reject(err));
        });
      }
      return this.pendingRequest;
    },
    reset() {
      this.pendingRequest = null;
    },
  };
  inject('tokensRefresher', tokensRefresher);
};
