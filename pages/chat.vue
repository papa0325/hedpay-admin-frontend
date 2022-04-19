<template>
  <div class="row justify-content-between">
    <div class="col-md-4">
      <card
        class="chat-nav"
        :title="$t('chat.messages')"
      >
        <base-input>
          <el-input
            v-model.trim="searchQuery"
            class="search-input"
            :class="{'not-found-input': notFound}"
            clearable
            prefix-icon="el-icon-search"
            :placeholder="$t('chat.search')"
            maxlength="30"
            aria-controls="datatables"
          />
          <div class="not-found">
            <span
              v-if="notFound"
            >{{ $t('chat.nothingFound') }}</span>
          </div>
        </base-input>
        <div class="menu">
          <div class="menu__items">
            <div
              class="menu__item"
              @click="changeChats('active')"
            >
              <h4
                :class="{'menu__item_active-text': currentChat === 'active'}"
              >
                {{ $t('chat.dialogActive') }}
              </h4>
              <div
                v-if="currentChat === 'active'"
                class="menu__item_active"
              />
            </div>
            <div
              class="menu__item"
              @click="changeChats('inactive')"
            >
              <h4
                :class="{'menu__item_active-text': currentChat === 'inactive'}"
              >
                {{ $t('chat.dialogInactive') }}
              </h4>
              <div
                v-if="currentChat === 'inactive'"
                class="menu__item_active"
              />
            </div>
          </div>
        </div>
        <div
          class="break-line"
        />
        <div class="dialogs">
          <div
            v-if="currentChat === 'active'"
            class="dialogs-active scrollbar"
          >
            <b-overlay
              :show="busyChats"
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block chats-busy"
            >
              <div
                v-for="(item, i) in queriedData"
                :key="i"
                class="dialog-msg-container"
              >
                <app-dialogue
                  v-if="item.active === true"
                  :message="item"
                  type="dialog"
                />
              </div>
              <div
                v-if="!activeLength && !busyChats"
                class="no-data-dialog"
              >
                {{ $t('chat.noActive') }}
              </div>
            </b-overlay>
          </div>
          <div
            v-if="currentChat === 'inactive'"
            class="dialogs-inactive scrollbar"
          >
            <b-overlay
              :show="busyChats"
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block chats-busy"
            >
              <div
                v-for="(item, i) in chats"
                :key="i"
                class="dialog-msg-container"
              >
                <app-dialogue
                  v-if="item.active === false"
                  :message="item"
                  type="dialog"
                />
              </div>
              <div
                v-if="!inActiveLength && !busyChats"
                class="no-data-dialog"
              >
                {{ $t('chat.noInActive') }}
              </div>
            </b-overlay>
          </div>
        </div>
      </card>
    </div>
    <div class="col-md-8">
      <chat-component />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Fuse from 'fuse.js';
import ChatMessage from '~/components/chat/ChatMessage.vue';
import ChatComponent from '~/components/chat/ChatComponent.vue';
import Dialog from '~/components/chat/Dialog.vue';

export default {
  middleware: 'auth',
  name: 'Chat',
  components: {
    ChatComponent,
    ChatMessage,
    AppDialogue: Dialog,
  },
  data() {
    return {
      busyChats: true,
      searchQuery: '',
      propsToSearch: 'username',
      dialogs: [],
      searchedDialogs: [],
      fuseSearch: null,
      notFound: false,
      activeLength: 0,
      inActiveLength: 0,
      currentChat: 'active',
    };
  },
  computed: {
    ...mapGetters({
      chats: 'chat/getAllChats',
    }),
    queriedData() {
      let result = this.chats;
      // eslint-disable-next-line array-callback-return
      result.map((item) => {
        if (item.active) {
          // eslint-disable-next-line no-plusplus
          this.activeLength++;
        } else {
          // eslint-disable-next-line no-plusplus
          this.inActiveLength++;
        }
      });
      if (this.searchedDialogs.length > 0) {
        result = this.searchedDialogs;
      }
      return result;
    },
  },
  watch: {
    searchQuery(value) {
      let result = this.chats;
      if (value !== '') {
        result = this.fuseSearch.search(this.searchQuery);
      }
      this.searchedDialogs = result;
      if (result.length && this.searchQuery) {
        this.notFound = false;
      } else if (!this.searchQuery) {
        this.notFound = false;
      } else {
        this.notFound = true;
      }
    },
  },
  async mounted() {
    await this.getChats();
    this.fuseSearch = new Fuse(this.chats, {
      keys: ['username'],
      threshold: 0.3,
    });
  },
  methods: {
    changeChats(component) {
      this.currentChat = component;
    },
    async getChats() {
      try {
        await this.$store.dispatch('chat/fetchAllChats');
        this.busyChats = false;
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0 !important;
  height: 30px;
  &__items {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  &__item {
    padding-right: 15px;
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h4 {
      margin: 0;
      opacity: 0.3;
      font-size: 13px;
    }
    &_active {
      border-bottom: 2px solid #E14ECA;
      position: relative;
      width: 100%;
      top: 6px;
    }
    &_active-text {
      opacity: 1 !important;
      color: #E14ECA;
    }
  }
  &__btn {
    width: 200px;
    button {
      width: 100%;
      margin: 0;
    }
  }
}
.break-line {
  border-bottom: 1px solid #2B3553;
  margin: 0 -15px;
}
.line {
  margin: 0 20px;
  padding: 0;
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
}
</style>
<style lang="scss">
  .no-data-dialog {
    padding: 0 15px;
  }
  .chats-busy {
    width: 100%;
    .bg-light {
      background-color: transparentize($color: #31334B, $amount: 0.2) !important;
    }
  }
.not-found {
  span {
    color: rgba(255, 255, 255, 0.8);
    opacity: 0.5;
  }
  margin-top: 5px;
}
//.form-group .not-found-input .el-input__inner{
//  border-color: #ec250d;
//  color: #ec250d;
//}
  .chat-nav {
    height: 883px;
  }
  .dialog-msg-container {
    cursor: pointer;
    border-radius: 4px;
  }
  .dialogs {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 15px;
    &__title {
      opacity: 0.5;
      margin: 0 15px 10px;
    }
  }
  .scrollbar {
    margin-right: 2px;
    //стили для mozila
    scrollbar-color: #1e1e2f #27293D;     /* «цвет ползунка» «цвет полосы скроллбара» */
    scrollbar-width: thin;
    // стили для webkit браузеров
    &::-webkit-scrollbar {
      width: 8px; /* ширина для вертикального скролла */
      height: 8px; /* высота для горизонтального скролла */
      background-color: #27293D;
    }

    /* ползунок скроллбара */
    &::-webkit-scrollbar-thumb {
        background-color: #1e1e2f;
        border-radius: 9em;
        // box-shadow: inset 1px 1px 10px #f3faf7;
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: #31334B;
    }
  }
  .dialogs-active {
    overflow-y: auto;
    margin-bottom: 30px;
    max-height: 720px;
    min-height: 30px;
  }
  .dialogs-inactive {
    max-height: 720px;
    overflow-y: auto;
    min-height: 30px;
  }
</style>
