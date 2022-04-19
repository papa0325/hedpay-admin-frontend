/* eslint-disable no-param-reassign */

// temp

export default function ({
  $axios, store, redirect, app,
}) {
  $axios.onRequest((config) => {
    if (store.getters['user/isAuth']) {
      if (config.url.split('/').pop() === 'refresh-token') {
        config.headers.authorization = `Bearer ${store.getters['user/refreshToken']}`;
      } else {
        config.headers.authorization = `Bearer ${store.getters['user/accessToken']}`;
      }
    }
  });
  $axios.onError(async (error) => {
    const originalRequest = error.config;
    if (error) {
      if (error.response) {
        if (error.response.status === 500) {
          // store.commit('user/logOut');
          // redirect('/login');
          throw error;
        }
      }
    }
    if (app.$cookies.get('refresh')) {
      if (!error.response) {
        throw error;
      }
      if ((error.response.status === 401 && originalRequest.url.split('/').pop() === 'refresh-token')) {
        store.commit('user/logOut');
        redirect('/login');
        throw error;
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        await store.dispatch('user/refreshTokens');
        await store.dispatch('user/getRole');
        return $axios(originalRequest);
      }
    }

    if (!originalRequest._retry) {
      if (process.client && error.response.data && error.response.data.msg !== 'Totp required') {
        // store.commit('user/logOut');
        // redirect('/login');
      }
      if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        redirect('/');
        return $axios(originalRequest);
      }
    }
    throw error;
  });

  const access = app.$cookies.get('access');
  const refresh = app.$cookies.get('refresh');

  if (access && refresh) {
    store.commit('user/setOldTokens', { access, refresh });
    // store.commit('user/logOut');
    // redirect('/login');
  }

  // if (store.getters['user/accessToken']) {
  //   store.dispatch('user/authRequest');
  // }
}
