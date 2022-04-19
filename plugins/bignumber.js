import BigNumber from 'bignumber.js';

export default (context, inject) => {
  const bignumber = BigNumber;

  inject('bignumber', bignumber);
  context.$bignumber = bignumber;
};
