export default ({ $axios }, inject) => {
  const api = {
    // Pairs and currencies
    async getDiscounts() {
      const response = await $axios.$get('/fee/discount');
      return response.result;
    },
    async discountAction(row, action) {
      const model = {
        volume: row.bttAmount,
        fee: row.discount,
        action,
      };
      const response = await $axios.$post('/fee/discount', model);
      return response.result;
    },
    async addPair(model) {
      const response = await $axios.$post('/pair/add', model);
      return response;
    },
    async editPair(model) {
      const response = await $axios.$post('/pair/edit', model);
      return response;
    },
    async addCurrency(model) {
      const response = await $axios.$post('/currency/add', model);
      return response;
    },
    async getCurrencies(currentPage, total, searchedData) {
      return searchedData.length >= 2
        ? $axios.$get(`/currency/all?limit=${total}&offset=${currentPage}&symbol=${searchedData}`)
        : $axios.$get(`/currency/all?limit=${total}&offset=${currentPage}`);
    },
    async getAllCurrencies() {
      return $axios.$get('/currency/all?limit=1024&offset=0');
    },
    async currencyEdit(model) {
      const response = await $axios.$post('/currency/edit', model);
      return response;
    },
    // Statistics
    async getStatistics(from, to, symbol) {
      const response = await $axios.$get(`/stats/currency?from=${from}&to=${to}&symbol=${symbol}`);
      return response.result;
    },
    // Chat
    async getAllChats() {
      const response = await $axios.$get('/admin/chats');
      return response.result;
    },
    async getChatById(id) {
      const response = await $axios.$get(`/admin/chats/${id}`);
      return response.result;
    },
    async closeChat(id) {
      const response = await $axios.$post('/admin/chats/close', id);
      return response.result;
    },
    async sendMessage(message) {
      const response = await $axios.$post('/admin/chats', message);
      return response.result;
    },
    async uploadFile(id, fileName) {
      const response = await $axios.$get(`/upload/${id}/${fileName}`, { responseType: 'blob' });
      return response;
    },
    // Management
    async getLocks(id, currentPage, total) {
      return $axios.$get(`/user/ban-records?userId=${id}&limit=${total}&offset=${currentPage}`);
    },
    async getLogs(id, currentPage, total) {
      return $axios.$get(`/user/logs?userId=${id}&limit=${total}&offset=${currentPage}`);
    },
    async holdUser(model) {
      return $axios.$post('/user/deactivate/temp', model);
    },
    async addAdmin(admin) {
      return $axios.$post('/admin/add', admin);
    },
    async getAdminList(currentPage, total, searchedData) {
      return searchedData.length >= 2
        ? $axios.$get(`/stats/admins/list?limit=${total}&offset=${currentPage}&search=${searchedData}`)
        : $axios.$get(`/stats/admins/list?limit=${total}&offset=${currentPage}`);
    },
    async getUserList(model) {
      let URLing = `/stats/users/list?limit=${model.perPage}&offset=${model.currentPage}`;
      if (model.searchQuery) {
        if (model.searchQuery.length >= 2) {
          URLing += `&search=${model.searchQuery}`;
        }
      }
      if (model.banned) {
        if (model.banned !== 'All users') {
          URLing += `&status=${model.banned}`;
        }
      }
      return $axios.$get(URLing);
      // if (banned && banned !== 'All users') {
      //   return searchedData.length >= 2
      //     ? $axios.$get(`/stats/users/list?limit=${total}&offset=${currentPage}&search=${searchedData}&status=${banned}`)
      //     : $axios.$get(`/stats/users/list?limit=${total}&offset=${currentPage}&status=${banned}`);
      // } if (!banned) {
      //   return searchedData.length >= 2
      //     ? $axios.$get(`/stats/users/list?limit=${total}&offset=${currentPage}&search=${searchedData}`)
      //     : $axios.$get(`/stats/users/list?limit=${total}&offset=${currentPage}`);
      // }
    },
    async getOrderList(model) {
      let URLing = `/user/orders?limit=${model.perPage}&offset=${model.currentPage}`;
      if (model.from && model.to) {
        URLing += `&from=${model.from}&to=${model.to}`;
      }
      if (model.whichPair) {
        if (model.whichPair !== 'All pairs' && model.whichPair !== 'Все пары') {
          URLing += `&pairID=${model.whichPair}`;
        }
      }
      if (model.sortedMethod) {
        URLing += `&order[timestamp]=${model.sortedMethod}`;
      }
      if (model.status) {
        if (model.status !== 'Status') {
          URLing += `&status=${model.status}`;
        }
      }
      if (model.side) {
        if (model.side !== 'Side') {
          URLing += `&side=${model.side}`;
        }
      }
      if (model.userId) {
        URLing += `&userID=${model.userId}`;
      }
      return $axios.$get(URLing);
    },
    async closeOrder(orderId) {
      const model = {
        orderId,
      };
      return $axios.$post('/order/cancel', model);
    },
    async getOrders(model) {
      let URLing = `/orders?limit=${model.perPage}&offset=${model.currentPage}`;
      if (model.from && model.to) {
        URLing += `&from=${model.from}&to=${model.to}`;
      }
      if (model.whichPair) {
        if (model.whichPair !== 'All pairs' && model.whichPair !== 'Все пары') {
          URLing += `&pairId=${model.whichPair}`;
        }
      }
      if (model.sortedMethod) {
        URLing += `&order[timestamp]=${model.sortedMethod}`;
      }
      if (model.status) {
        if (model.status !== 'Status') {
          URLing += `&status=${model.status}`;
        }
      }
      if (model.side) {
        if (model.side !== 'Side') {
          URLing += `&side=${model.side}`;
        }
      }
      if (model.userId) {
        URLing += `&userID=${model.userId}`;
      }
      return $axios.$get(URLing);
    },
    async getBalances(model) {
      let URLing = `/wallets?limit=${model.perPage}&offset=${model.currentPage}`;
      if (model.searchQuery) {
        if (model.searchQuery.length >= 1) {
          URLing += `&currency=${model.searchQuery}`;
        }
      }
      if (model.userId) {
        URLing += `&userId=${model.userId}`;
      }
      if (model.currentType) {
        if (model.currentType !== 'All types' && model.currentType !== 'Все типы') {
          URLing += `&type=${model.currentType}`;
        }
      }
      if (model.whichSorted) {
        URLing += `&order[${model.whichSorted}]=${model.sortedMethod}`;
      }
      return $axios.$get(URLing);
      // return whichSorted
      //   ? $axios.$get(`/wallets?userId=${id}&limit=${total}&offset=${currentPage}&order[${whichSorted}]=${method}`)
      //   : $axios.$get(`/wallets?userId=${id}&limit=${total}&offset=${currentPage}`);
    },
    // Transactions
    async getTransactions(model) {
      let URLing = `/transactions/${model.type}?limit=${model.limit}&offset=${model.offset}`;
      if (model.from && model.to) {
        URLing += `&from=${model.from}&to=${model.to}`;
      }
      if (model.symbol) {
        if (model.symbol !== 'All currencies' && model.symbol !== 'Все валюты') {
          URLing += `&symbol=${model.symbol}`;
        }
      }
      if (model.reasonOf) {
        if (model.reasonOf !== 'All reasons' && model.reasonOf !== 'Все ризоны') {
          URLing += `&reason=${model.reasonOf}`;
        }
      }
      if (model.userId) {
        URLing += `&userId=${model.userId}`;
      }
      if (model.username) {
        URLing += `&username=${model.username}`;
      }
      if (model.reason !== 'all' && model.reason) {
        URLing += `&status=${model.reason}`;
      }
      return $axios.$get(URLing);
    },
    async askTransaction(orderId) {
      const model = {
        orderId,
      };
      return $axios.$post('/withdraw/confirmation/ask', model);
    },
    async confirmTransaction(code) {
      const model = {
        code,
      };
      return $axios.$post('/withdraw/confirmation/confirm', model);
    },
    async rejectTransaction(orderId, message) {
      const model = {
        orderId,
        message,
      };
      return $axios.$post('/withdraw/confirmation/reject', model);
    },
    // Chat
    async startChat(id) {
      const model = {
        userId: id,
      };
      return $axios.$post('/admin/chats/start', model);
    },
    async getUserData(id) {
      return $axios.$get(`/user/${id}`);
    },
    async deactivateUser(email) {
      return $axios.$post('/user/deactivate', email);
    },
    async activateUser(email) {
      return $axios.$post('/user/activate', email);
    },
    async deactivateAdmin(email) {
      return $axios.$post('/admin/deactivate', email);
    },
    async activateAdmin(email) {
      return $axios.$post('/admin/activate', email);
    },
    async changeRole(model) {
      return $axios.$post('/admin/change-role', model);
    },
    // Authorization
    async signIn(user) {
      return $axios.$post('/admin/login', user);
    },
    async getRole() {
      return $axios.get('/admin/role');
    },
    // Registration
    async registrationVerify(verifyToken) {
      return $axios.$post(`/admin/verify?token=${verifyToken}`);
    },
    async registrationBasic(user) {
      return $axios.$post('/admin/register/basic', user);
    },
    async registrationFinal(user) {
      return $axios.$post('/admin/register/final', user);
    },
    // Dashboard
    async getRegisteredUsers() {
      return $axios.$get('/stats/users/');
    },
    async getUsersOnline() {
      return $axios.$get('/stats/users/online');
    },
    async getUsersByPeriod() {
      return $axios.$get('/stats/users/day');
    },
    async getPairs() {
      return $axios.$get('/pairs');
    },
    async getAllPairs(currentPage, total, searchedData) {
      return searchedData.length >= 2
        ? $axios.$get(`/pairs?limit=${total}&offset=${currentPage}&search=${searchedData}`)
        : $axios.$get(`/pairs?limit=${total}&offset=${currentPage}`);
    },
    async getBigChartData(id) {
      return $axios.$get(`/stats/volume?pairId=${id}`);
    },
    // Markdown
    async listMarkdown() {
      return $axios.$get('/markdown');
    },
    async retrieveMarkdown(name) {
      return $axios.$get(`/markdown/${name}`);
    },
    async createMarkdown(payload) {
      return $axios.$post('/markdown', payload);
    },
    async updateMarkdown(name, payload) {
      return $axios.$put(`/markdown/${name}`, payload);
    },
    async deleteMarkdown(name) {
      return $axios.$delete(`/markdown/${name}`);
    },
  };
  inject('api', api);
};
