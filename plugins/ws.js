export default async ({ $PrivateConnection }, inject) => {
  // TODO change socket link
  const ws = new $PrivateConnection('HedPay');
  inject('ws', ws);
};
