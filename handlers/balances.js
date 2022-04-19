import BigNumber from 'bignumber.js';
// Look at the msg type
// If order.new push a new entry
// if order.delete delete this entry
export default {
  prepareArray(array) {
    if (!array.length) return array;
    const balances = array.map((balance) => this.prepareOrder(balance));
    return this.defineDiff(balances);
  },
  prepareOrder(balanceData) {
    try {
      const balance = balanceData;
      const currentBalance = new BigNumber(balance.balance).shiftedBy(-balance.currency.decimals);
      balance.balance = currentBalance.toNumber();
      return balance;
    } catch (e) {
      return {
        price: 0,
        quantity: 0,
        amount: 0,
      };
    }
  },
  defineDiff(array) {
    if (!array.length) return array;
    const lastIndex = array.length - 1;
    const minValue = array[0].balance;
    const maxValue = array[lastIndex].balance;
    return array.map((item) => {
      const order = item;
      order.diff = maxValue === minValue ? 0 : Math.abs(((order.balance - Math.min(minValue, maxValue)) / (maxValue - minValue))) * 100;
      return order;
    });
  },
};
