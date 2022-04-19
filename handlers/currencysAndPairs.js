import BigNumber from 'bignumber.js';
// Look at the msg type
// If order.new push a new entry
// if order.delete delete this entry
export default {
  prepareArrayCurrencies(array) {
    if (!array.length) return array;
    const orders = array.map((order) => this.prepareOrderCurrencies(order));
    return this.defineDiffCurrencies(orders);
  },
  prepareOrderCurrencies(orderData) {
    try {
      const order = orderData;
      const maxWithdraw = new BigNumber(+order.txLimits.maxWithdraw).shiftedBy(-order.decimals);
      const minWithdraw = new BigNumber(+order.txLimits.minWithdraw).shiftedBy(-order.decimals);
      const withdrawCommissionFixed = new BigNumber(+order.txLimits.withdrawCommissionFixed).shiftedBy(-order.decimals);
      const percentage = 4;
      const withdrawCommissionPercentage = new BigNumber(+order.txLimits.withdrawCommissionPercentage).shiftedBy(-percentage);
      order.txLimits.maxWithdraw = maxWithdraw.toNumber();
      order.txLimits.minWithdraw = minWithdraw.toNumber();
      order.txLimits.withdrawCommissionFixed = withdrawCommissionFixed.toNumber();
      order.txLimits.withdrawCommissionPercentage = withdrawCommissionPercentage.toNumber();
      return order;
    } catch (e) {
      return {
        price: 0,
        quantity: 0,
        amount: 0,
      };
    }
  },
  defineDiffCurrencies(array) {
    if (!array.length) return array;
    const lastIndex = array.length - 1;
    const minValue = array[0].price;
    const maxValue = array[lastIndex].price;
    return array.map((item) => {
      const order = item;
      order.diff = maxValue === minValue ? 0 : Math.abs(((order.price - Math.min(minValue, maxValue)) / (maxValue - minValue))) * 100;
      return order;
    });
  },
  prepareArrayPairs(array) {
    if (!array.length) return array;
    const orders = array.map((order) => this.prepareOrderPairs(order));
    return this.defineDiffPairs(orders);
  },
  prepareOrderPairs(orderData) {
    try {
      const order = orderData;
      const lot_size_max = new BigNumber(+order.settings.lot_size_max).shiftedBy(-order.baseCurrency.decimals);
      const lot_size_min = new BigNumber(+order.settings.lot_size_min).shiftedBy(-order.baseCurrency.decimals);
      const lot_size_tick = new BigNumber(+order.settings.lot_size_tick).shiftedBy(-order.baseCurrency.decimals);
      const price_max = new BigNumber(+order.settings.price_max).shiftedBy(-order.baseCurrency.decimals);
      const price_tick = new BigNumber(+order.settings.price_tick).shiftedBy(-order.baseCurrency.decimals);
      const price_min = new BigNumber(+order.settings.price_min).shiftedBy(-order.baseCurrency.decimals);
      order.settings.lot_size_max = lot_size_max.toNumber();
      order.settings.lot_size_min = lot_size_min.toNumber();
      order.settings.lot_size_tick = lot_size_tick.toNumber();
      order.settings.price_max = price_max.toNumber();
      order.settings.price_tick = price_tick.toNumber();
      order.settings.price_min = price_min.toNumber();
      return order;
    } catch (e) {
      return {
        price: 0,
        quantity: 0,
        amount: 0,
      };
    }
  },
  defineDiffPairs(array) {
    if (!array.length) return array;
    const lastIndex = array.length - 1;
    const minValue = array[0].price;
    const maxValue = array[lastIndex].price;
    return array.map((item) => {
      const order = item;
      order.diff = maxValue === minValue ? 0 : Math.abs(((order.price - Math.min(minValue, maxValue)) / (maxValue - minValue))) * 100;
      return order;
    });
  },
};
