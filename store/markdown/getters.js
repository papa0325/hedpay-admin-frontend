export default {
  getAllMarkdownItems: (state) => JSON.parse(JSON.stringify([...state.markdownItems.data].reverse().map((md) => ({ ...md, data: JSON.parse(md.data) })))),
  getCurrentItem: (state) => state.activeMarkdown,
};
