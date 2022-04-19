export default {
  isAuth: (state) => !!(state.tokens.access && state.tokens.refresh),
  accessToken: (state) => state.tokens.access,
  refreshToken: (state) => state.tokens.refresh,
  getProfile: (state) => state.profile,
  getAccessToken: (state) => state.tokens.access,
  getUserStatus: (state) => state.status,
  errorStatus: (state) => state.error,
  userRole: (state) => state.userRole,
};
