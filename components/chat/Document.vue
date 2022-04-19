<template>
  <div
    class="file"
  >
    <img
      class="file__icon"
      src="~/static/img/icons/doc.svg"
      alt="doc"
    >
    <!-- Здесь скорее всего надо будет на тег а поменять, когда с сервера будут приходить файлы -->
    <span class="file__name">{{ truncateName(file.name) }}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Document',
  props: {
    file: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      currentId: 'chat/currentId',
    }),
  },
  methods: {
    // обрезает имя файла
    truncateName(str) {
      const arr = str.split('.');
      return `${arr[0].slice(0, 10)}...${arr[1]}`;
    },
  },
};
</script>

<style lang="scss" scoped>
  .file {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #373950;
    border-radius: 4px;
    padding: 10px 16px;
    max-width: 200px;
    &__icon {
      margin-right: 16px;
    }
  }
</style>
