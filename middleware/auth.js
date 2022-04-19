export default async (context) => {
  const hasAccess = context.app.$cookies.get('access');
  const hasRefresh = context.app.$cookies.get('refresh');
  const hasRole = context.app.store.getters['user/userRole'];
  if (!hasAccess || !hasRefresh) {
    return context.redirect('/login');
  }
  if (!hasRole) {
    await context.app.store.dispatch('user/getRole');
  }
  return true;
};
