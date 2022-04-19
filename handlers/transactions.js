import BigNumber from 'bignumber.js';
// Look at the msg type
// If order.new push a new entry
// if order.delete delete this entry
export default {
  prepareLink(item) {
    if (item.currency.blockChain === 'Bitcoin') {
      item.orderLink = `https://blockchair.com/ru/bitcoin/transaction/${item.params.tx_id}`;
    }
    if (item.currency.blockChain === 'Litecoin') {
      item.orderLink = `https://blockchair.com/ru/litecoin/transaction/${item.params.tx_id}`;
    }
    if (item.currency.blockChain === 'Ethereum') {
      item.orderLink = `https://etherscan.io/tx/${item.params.tx_id}`;
    }
    if (item.currency.blockChain === 'Omni Layer') {
      item.orderLink = `https://blockchair.com/search?q=${item.params.tx_id}`;
    }
    if (item.currency.blockChain === 'Decimal') {
      item.orderLink = `https://explorer.decimalchain.com/blocks/${item.params.tx_id}`;
    }
    if (item.currency.blockChain === 'PRIZM') {
      item.orderLink = `https://prizmexplorer.com/tx/${item.params.tx_id}`;
    }
  },
  prepareArray(array) {
    if (!array.length) return array;
    const transactions = array.map((transaction) => this.prepareOrder(transaction));
    return this.defineDiff(transactions);
  },
  prepareOrder(transactionData) {
    try {
      const transaction = transactionData;
      const currentTransactions = new BigNumber(transaction.amount).shiftedBy(-transaction.currency.decimals);
      transaction.amount = currentTransactions.toNumber();
      return transaction;
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
    const minValue = array[0].amount;
    const maxValue = array[lastIndex].amount;
    return array.map((item) => {
      const order = item;
      order.diff = maxValue === minValue ? 0 : Math.abs(((order.amount - Math.min(minValue, maxValue)) / (maxValue - minValue))) * 100;
      return order;
    });
  },
};
