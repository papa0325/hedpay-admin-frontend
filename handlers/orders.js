import BigNumber from 'bignumber.js';
// Look at the msg type
// If order.new push a new entry
// if order.delete delete this entry
export default {
  prepareArray(array) {
    if (!array.length) return array;
    const orders = array.map((order) => this.prepareOrder(order));
    return this.defineDiff(orders);
  },
  prepareOrder(orderData) {
    try {
      const order = orderData;
      const initialQuantity = order.quantity || 0;
      const initialExecuted = order.executed || 0;
      const price = new BigNumber(+order.price).shiftedBy(-order.quoteDecimals);
      const quantity = new BigNumber(initialQuantity).minus(initialExecuted).shiftedBy(-order.baseDecimals).abs();
      const amount = price.multipliedBy(quantity);
      if (order.executed) {
        order.executed = new BigNumber(initialExecuted).shiftedBy(-order.baseDecimals).toNumber();
      }
      // order.initialPrice = order.price;
      order.price = price.toNumber();
      order.quantity = quantity.toNumber();
      order.amount = amount.toNumber();
      return order;
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
    const minValue = array[0].price;
    const maxValue = array[lastIndex].price;
    return array.map((item) => {
      const order = item;
      order.diff = maxValue === minValue ? 0 : Math.abs(((order.price - Math.min(minValue, maxValue)) / (maxValue - minValue))) * 100;
      return order;
    });
  },
  deleteOrder(ordersArray, order) {
    return ordersArray.filter((item) => item.price !== order.price);
  },
  sumOrders(oldOrder, newOrder) {
    const order = oldOrder;
    order.quantity = new BigNumber(oldOrder.quantity).plus(newOrder.quantity).toNumber();
    order.amount = new BigNumber(oldOrder.amount).plus(newOrder.amount).toNumber();
    return order;
  },
};
