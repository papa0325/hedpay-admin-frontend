import Connection from '~/util/Connection';

export default ({ store, app }, inject) => {
  class PrivateConnection extends Connection {
    async connect() {
      const access = store.getters['user/accessToken'];
      try {
        await super.connect(access);
      } catch (err) {
        if (err.statusCode === 401) {
          try {
            const tokens = await app.$tokensRefresher.refreshTokens();
            app.$tokensRefresher.reset();
            await super.connect(tokens.access);
          } catch (e) {
            console.log('ws.onError -> err', e);
            await super.connect(null);
          }
        } else {
          throw err;
        }
      }
    }

    onRequestError = (err) => new Promise((resolve, reject) => {
      if (err.statusCode === 401 && store.getters['user/isAuth']) {
        app.$tokensRefresher.refreshTokens()
          .then((tokens) => {
            this.reauthenticate(tokens.access)
              .then(() => {
                resolve();
              })
              .catch(() => {
                this.connect(null)
                  .then(() => {
                    resolve();
                  })
                  .catch(() => {
                    reject();
                  });
                reject();
              });
          })
          .catch(() => {
            reject();
          }).finally(() => {
            app.$tokensRefresher.reset();
          });
      } else {
        reject(err);
      }
    });

    request(params) {
      return new Promise((resolve, reject) => {
        super.request(params)
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            console.dir(err);
            this.onRequestError(err, this)
              .then(() => {
                console.log('Request error promise resolved');
                this.request(params).then((resp) => { resolve(resp); });
              })
              .catch(() => {
                reject(err);
              });
          });
      });
    }
  }
  inject('PrivateConnection', PrivateConnection);
};
