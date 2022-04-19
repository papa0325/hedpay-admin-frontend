export default (context) => {
  const hasAccess = context.app.$cookies.get('access');
  if (hasAccess) {
    return context.redirect('/');
  }
  return true;
};
