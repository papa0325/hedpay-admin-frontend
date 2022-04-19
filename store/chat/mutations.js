/* eslint-disable no-param-reassign */

import es from 'element-ui/src/locale/lang/es';
import el from 'element-ui/src/locale/lang/el';

export default {
  busyChatFetch(state) {
    state.busyChatFetch = !state.busyChatFetch;
  },
  setChat(state, item) {
    state.currentChatStatus = item.status;
    state.chat = item.processedChats;
  },
  closeChat(state, id) {
    const index = state.chats.findIndex((el) => el.chatID === id);
    state.chats[index].active = false;
    state.chats[index].read = false;
    state.chat = [];
  },
  setCurrentId(state, id) {
    state.currentId = id;
  },
  updateChats(state, chats) {
    state.chats = chats;
  },
  updateChat(state, newMessage) {
    state.chat.push(newMessage);
    let isFound = false;
    state.chats = state.chats.map((_chat) => {
      const chat = _chat;
      if (chat.chatID === newMessage.chatID) {
        chat.isNew = false;
        chat.lastMessage = newMessage.message;
        isFound = true;
      }
      return chat;
    });
    if (!isFound) {
      state.chats.unshift({
        chatID: newMessage.chatID,
        lastMessage: newMessage.message,
        active: true,
        username: newMessage.sender.senderUsername,
        lastSender: newMessage.sender,
        isNew: false,
      });
    }
  },
  updateInactiveChat(state, message) {
    let isFound = false;
    state.chats = state.chats.map((_chat) => {
      const chat = _chat;
      if (chat.chatID === message.chatID) {
        chat.isNew = true;
        chat.lastMessage = message.message;
        isFound = true;
      }
      return chat;
    });
    if (!isFound) {
      state.chats.unshift({
        chatID: message.chatID,
        lastMessage: message.message,
        active: true,
        username: message.sender.senderUsername,
        lastSender: message.sender,
      });
    }
  },
};
