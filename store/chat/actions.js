export default {
  // Получает все чаты
  async fetchAllChats({ commit, dispatch }) {
    dispatch('initChatsSubscription');
    const chats = await this.$api.getAllChats();
    commit('updateChats', chats.data);
  },
  // Подключение по ws и подписка
  async initChatsSubscription({ dispatch }) {
    await this.$ws.connect();
    await this.$ws.subscribe('/admin/chats', (message) => {
      dispatch('handleChatUpdate', message);
    });
  },
  // Получение конкретного чата по нажатию (передаем chatID)
  async fetchChatById({ commit, dispatch }, item) {
    // currents id мне нужен для закрытия чата, или получения файлов, а также отправки сообщений
    commit('setCurrentId', item.id);
    const response = await this.$api.getChatById(item.id);
    const chat = response.data;
    const processedChats = await Promise.all(chat.map((item) => dispatch('processChat', item)));
    const { status } = item;
    commit('setChat', { processedChats, status });
  },
  async processChat({ dispatch }, message) {
    const processedMessages = message;
    // processedMessages.attachments = await Promise.all(message.attachments.files.map((item) => ({
    //   type: 'other',
    //   src: item,
    // })));
    return processedMessages;
  },
  // File upload
  // async processFile(store, { file, id }) {
  //   const fetchedFile = await this.$api.chat.getFile(id, file);
  //   const encoder = new TextEncoder();
  //   const fileEncoded = await fileToBase64(encoder.encode(fetchedFile));
  //   return {
  //     type: 'img',
  //     src: fileEncoded,
  //   };
  // },
  async sendMessage({ commit }, newMessage) {
    const message = await this.$api.sendMessage(newMessage);
  },
  handleChatUpdate({ state, commit }, message) {
    if (message.chatID === state.currentId) {
      commit('updateChat', message);
    } else {
      commit('updateInactiveChat', message);
    }
  },
};
