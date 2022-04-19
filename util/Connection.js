/* eslint-disable class-methods-use-this */
// /* eslint-disable consistent-return */
import { Client } from '@hapi/nes/lib/client';

export default class extends Client {
  constructor(url, name, options = {}) {
    super(url);
    this.name = name;
    this.isPrivate = options.isPrivate;
  }

  onAuthError = () => {}

  onRequestError = () => {}

  // I'm profoundly sorry for doing this, but I couldn't have come with any better solution.
  connect(token) {
    return new Promise((resolve, reject) => {
      super.connect(this.formConfigObject(token))
        .then(() => { resolve(); })
        .catch((err) => {
          reject(err);
          // this.onError(err).then(() => { resolve(); }).catch(() => { reject(); }); // Dirty hack
        });
    });
  }

  reauthenticate(token) {
    return super.reauthenticate({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((err) => {
        this.onAuthError(err);
      });
  }

  async subscribe(path, handler) {
    if (this.subscriptions().includes(path)) {
      await this.unsubscribe(path, null);
    }
    return super.subscribe(path, handler);
  }

  //

  formConfigObject(token) {
    if (token) {
      return {
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      };
    }
    return null;
  }

  createQuery(params) {
    return `?${Object.keys(params).map((key) => `${key}=${params[key]}`).join('&')}`;
  }

  async $get(path, queries = null) {
    let qPath = path;
    if (queries) {
      qPath += this.createQuery(queries);
    }
    return this.request({ method: 'GET', path: qPath });
  }

  async $post(path, payload = null) {
    return this.request({ method: 'POST', path, payload });
  }
}
