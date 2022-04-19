<template>
  <div
    class="dialog-msg"
    :class="{'dialog-msg__active': message.chatID === currentId}"
    @click="selectDialogue(message.chatID, message.active)"
  >
    <div
      v-if="(message.lastSender.type === 'user' && !message.read && message.active) || (message.isNew && message.active)"
      class="dialog-msg__indicator"
    />
    <p class="dialog-msg__username">
      {{ message.username }}
    </p>

    <div class="dialog-msg__text">
      <span
        v-if="message.lastSender.type === 'admin'"
        class="dialog-msg__text_admin"
      >{{ $t('chat.you') }}:</span>
      <!--            <p-->
      <!--              v-if="message.files.length"-->
      <!--              class="dialog-msg__text_files"-->
      <!--            >-->
      <!--              <span-->
      <!--                v-for="(item, i) in message.files"-->
      <!--                :key="i"-->
      <!--              >-->
      <!--                {{ item.name }}{{ message.message ? ',' : '' }}-->
      <!--              </span>-->
      <!--            </p>-->
      {{ message.lastMessage }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Document from '~/components/chat/Document.vue';

export default {
  name: 'Dialog',
  components: {
    'chat-doc': Document,
  },
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
  },
  methods: {
    truncate(str, length) {
      return str.length > length ? `${str.substr(0, length)}...` : str;
    },
    async selectDialogue(id, status) {
      try {
        await this.$store.commit('chat/busyChatFetch');
        await this.$store.dispatch('chat/fetchChatById', { id, status });
        this.message.read = true;
        this.message.isNew = false;
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
      await this.$store.commit('chat/busyChatFetch');
    },
  },
};
</script>

<style lang="scss" scoped>
  .dialog-msg {
    position: relative;
    display: flex;
    flex-direction: column;
    height: auto;
    padding: 15px;
    margin-bottom: 15px;
    font-size: 16px;
    line-height: 20px;
    font-weight: normal;
    cursor: pointer;
    border-radius: 4px;
    background-color: #31334B;
    border: 1px solid #31334B;
    &__active {
      border: 1px solid #E14ECA;
    }
    &:hover {
      border: 1px solid #E14ECA;
    }
    &__indicator {
      position: absolute;
      top: 11px;
      right: 15px;
      width: 8px;
      height: 8px;
      background-color: #FD5D93;
      border-radius: 50%;
    }
    &__text {
      height: 20px;
      margin-top: 10px;
      font-size: 13px;
      line-height: 19px;
      opacity: 0.8;
      overflow: hidden;
      text-overflow: ellipsis;
      &_files {
        display: inline-block;
        color: #FD5D93;
      }
      &_admin {
        color: #FD5D93;
      }
    }
  }
</style>
