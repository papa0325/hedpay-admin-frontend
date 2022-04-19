<template>
  <div
    class="chat-message"
    :class="message.sender.type === 'admin' ? 'chat-message_right': 'chat-message_left'"
  >
    <div class="chat-messages">
      <p
        class="chat-message__username"
        :class="message.sender.type === 'admin' ? 'chat-message__username_admin': ''"
      >
        {{ upperFirstLetter }}
      </p>
      <span class="chat-message__time">
        {{ dateParser }}
      </span>
      <p
        class="chat-message__text"
        v-html="messageProcessing(message.message)"
      />
      <!--  Файлы  -->
      <div
        v-if="message.attachments.length"
        class="chat-message__files"
      >
        <div
          v-for="(item, indx) in message.attachments"
          :key="indx"
          class="chat-form__file-wrapper"
        >
          <div
            class="file"
            @click="downloadFile(item)"
          >
            <img
              class="file__icon"
              src="~/static/img/icons/doc.svg"
              alt="doc"
            >
            <!-- Здесь скорее всего надо будет на тег а поменять, когда с сервера будут приходить файлы -->
            <span class="file__name">{{ truncateName(item) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ChatMessage',
  props: {
    message: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      currentId: 'chat/currentId',
    }),
    upperFirstLetter() {
      return this.message.sender.type[0].toUpperCase() + this.message.sender.type.slice(1);
    },
    // eslint-disable-next-line vue/return-in-computed-property
    dateParser() {
      if (this.message.timestamp && this.$i18n.locale) {
        if (this.$i18n.locale === 'en') {
          return this.$d(new Date(this.message.timestamp * 1000), 'long', 'en-US');
        }
        if (this.$i18n.locale === 'ru') {
          return this.$d(new Date(this.message.timestamp * 1000), 'long', 'ru-RU');
        }
      }
    },
  },
  mounted() {
    this.loader = false;
  },
  methods: {
    async downloadFile(file) {
      await this.$api.uploadFile(this.currentId, file).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file); // or any other extension
        document.body.appendChild(link);
        link.click();
      });
    },
    messageProcessing(message) {
      return message.replace(/\n/g, '<br>');
    },
    truncateName(str) {
      if (str) {
        const arr = str.split('.');
        return `${arr[0].slice(0, 10)}...${arr[1]}`;
      }
      return '...';
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-messages {
  display: flex;
  flex-direction: column;
}
  .chat-message {
    word-break: break-all;
    display: table;
    padding: 15px;
    min-width: 200px;
    margin-bottom: 15px;
    font-size: 16px;
    line-height: 20px;
    font-weight: normal;
    height: auto;
    background-color: #31334B;
    border-radius: 4px;
    max-width: 75%;
    &_right {
      margin-left: auto;
    }
    .chat-message__username {
      &_admin {
        color: #E14ECA;
      }
      display: inline;
    }
    &__time {
      font-size: 13px;
      line-height: 16px;
      opacity: 0.2;
      color: white;
      font-weight: 300;
    }
    &__text {
      margin-top: 10px;
      font-size: 13px;
      line-height: 19px;
      opacity: 0.8;
      width: auto;
      display: inline;
    }
    &__files {
      display: flex;
    }
  }
  .file {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #373950;
    border-radius: 4px;
    padding: 10px 20px;
    max-width: 200px;
    cursor: pointer;
    &__icon {
      margin-right: 10px;
    }
    span {
      padding-right: 10px;
    }
  }
</style>
