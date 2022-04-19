/* eslint-disable no-param-reassign */

export default {
  setMarkdownList(state, value) {
    state.markdownItems = [];
    state.markdownItems = value;
  },
  updateMarkdownItem(state, value) {
    // state.activeMarkdown = { ...state.activeMarkdown, ...mdData };
  },
  createMarkdownItem(state, mdData) {
    state.activeMarkdown = mdData;
  },
};
