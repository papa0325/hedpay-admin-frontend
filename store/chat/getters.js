export default {
  currentChat: (state) => state.chat,
  getAllChats: (state) => state.chats,
  currentId: (state) => state.currentId,
  busyChatFetch: (state) => state.busyChatFetch,
  currentChatStatus: (state) => state.currentChatStatus,
};
