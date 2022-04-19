<template>
  <div>
    <b-overlay
      :show="busyChatFetch"
      rounded
      opacity="0.6"
      spinner-small
      spinner-variant="primary"
      class="d-inline-block chat-busy"
    >
      <card
        v-if="currentId"
        class="chat"
        header-classes="chat__header"
        footer-classes="chat__footer"
        body-classes="chat__body-flex"
      >
        <template v-slot:header>
          <div class="chat-header">
            <h4 class="chat__title">
              {{ $t('chat.chat') }}
            </h4>
            <base-dropdown
              v-if="currentChatStatus"
              menu-classes="dropdown-black"
              title-classes="chat__menu-btn"
              :menu-on-right="true"
            >
              <template v-slot:title>
                <img
                  src="~/static/img/icons/menu.svg"
                  alt="menu"
                >
              </template>
              <div
                class="dropdown-item"
                @click="isEndDialogueModal = true"
              >
                {{ $t('chat.endDialogue') }}
              </div>
            </base-dropdown>
          </div>
          <div
            class="break-line"
          />
        </template>
        <div
          v-if="currentId"
          ref="chat"
          class="chat__body scrollbar"
        >
          <!-- Сообщения -->
          <chat-message
            v-for="(item, i) in currentMessages"
            :key="i"
            :message="item"
          />
        </div>

        <template
          v-slot:footer
        >
          <form
            :class="{'disabled-component': !currentChatStatus}"
            class="chat-form"
            @submit.prevent="sendMessage"
            @keydown.enter.prevent.exact="sendMessage"
          >
            <base-input class="chat-form__input">
              <el-input
                v-model="message"
                class="chat-form__textarea"
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 6}"
                :rows="1"
                resize="none"
                :placeholder="$t('chat.inputPlaceholder')"
                spellcheck="false"
              />
            </base-input>
            <base-button
              simple
              class="chat-form__clip-btn"
              type="primary"
            >
              <label
                for="file"
                class="file-upload"
              >
                <img
                  src="~/static/img/icons/clip.svg"
                  alt="clip"
                >
                <input
                  id="file"
                  ref="file"
                  type="file"
                  name="file"
                  multiple
                  class="file-upload__input"
                  @change="handleFileUpload()"
                >
              </label>
            </base-button>
            <base-button
              type="primary"
              class="chat-form__send-btn"
              @click="sendMessage"
            >
              <img
                src="~/static/img/icons/send.svg"
                alt="Send"
              >
            </base-button>
          </form>
          <div
            v-if="messageLength"
            class="message-length"
            :class="{'message-length-error': messageLength > 500}"
          >
            {{ messageLength }} / 500
          </div>
          <!-- Контейнер для файлов. умеет показывать и удалять сообщения -->
          <div
            v-if="files.length"
            class="chat-form__files"
          >
            <div
              v-for="(file, i) in files"
              :key="i"
              class="chat-form__file-wrapper"
            >
              <button
                class="chat-form__file-delete"
                @click="delteFile(file)"
              >
                &times;
              </button>
              <img
                v-if="file.isImg"
                :file="file.file"
                :src="file.src"
                :alt="file.name"
                class="chat-form__img"
              >
              <chat-doc
                v-else
                :file="file"
              />
            </div>
          </div>
        </template>
      </card>
      <card
        v-else
        class="chat-empty"
        body-classes="chat-empty__body"
      >
        <span>{{ $t('chat.emptyDialog') }}</span>
      </card>
      <modal
        id="endDialogueModal"
        :show.sync="isEndDialogueModal"
        class="modal-black modal show ed-modal"
        :centered="false"
        :show-close="true"
        modal-classes="modal-md"
      >
        <h4
          slot="header"
          class="card-title"
        >
          {{ $t('chat.modal.title') }}
        </h4>
        <p class="ed-modal__text mb-4">
          {{ $t('chat.modal.infoText') }}
        </p>
        <div class="ed-modal__btns">
          <base-button
            type="primary"
            simple
            @click="isEndDialogueModal = false"
          >
            {{ $t('chat.modal.cancel') }}
          </base-button>
          <base-button
            type="primary"
            @click="handleCompleteDialogue"
          >
            {{ $t('chat.modal.complete') }}
          </base-button>
        </div>
      </modal>
    </b-overlay>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ImageUpload, BaseButton, Modal } from '@/components';
import ChatMessage from '~/components/chat/ChatMessage.vue';
import Document from '~/components/chat/Document.vue';

export default {
  name: 'ChatComponent',
  components: {
    ImageUpload,
    BaseButton,
    ChatMessage,
    'chat-doc': Document,
    Modal,
  },
  data() {
    return {
      message: '',
      messages: [],
      files: [], // массив файлов
      scrollHeight: '', // переменная хранящая старое значение высоты скорола (до прихода/отправки сообщения)
      isEndDialogueModal: false,
      test: null,
      localCurrentMessages: [],
      allFilesSize: 0,
      filesLength: 0,
      enoughSize: true,
    };
  },
  computed: {
    ...mapGetters({
      currentMessages: 'chat/currentChat',
      currentId: 'chat/currentId',
      busyChatFetch: 'chat/busyChatFetch',
      currentChatStatus: 'chat/currentChatStatus',
    }),
    messageLength() {
      return this.message.length;
    },
  },
  watch: {
    allFilesSize(value) {
      console.log(value);
    },
  },
  mounted() {
    if (!this.currentMessages.length) return;
    const { chat } = this.$refs;

    chat.scrollTo(0, chat.scrollHeight); // прокурчивает скролл вниз
    this.scrollHeight = chat.scrollHeight;
  },
  updated() {
    const { chat } = this.$refs;

    if (!chat) return;
    // прокручиваем скролл вниз, при добавлении новых сообщений
    if (chat.scrollHeight !== this.scrollHeight) {
      chat.scrollTo(0, chat.scrollHeight);
      this.scrollHeight = chat.scrollHeight;
    }
  },
  methods: {
    sendMessage() {
      const { message, files } = this;
      if (!message.trim() && !files.length) return;
      const trimMessage = message.trim();
      if (this.messageLength < 500 && !files.length) {
        const newMessage = {
          id: this.currentId,
          message: trimMessage,
        };
        this.$store.dispatch('chat/sendMessage', newMessage);
        this.message = '';
        this.files = [];
      } else if (files.length && this.messageLength < 500) {
        if (files.length >= 4) {
          this.$notify({
            type: 'danger',
            message: this.$t('chat.messageLengthError'),
            icon: 'tim-icons icon-check-2',
          });
        } else {
          const newMessage = {
            id: this.currentId,
            message: trimMessage,
            attachments: [],
          };
          const re = /(?:\.([^.]+))?$/;
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < files.length; i++) {
            const file = {
              fileExtension: `.${re.exec(files[i].name)[1]}`,
              data: files[i].bcode,
            };
            newMessage.attachments.push(file);
          }
          try {
            this.$store.dispatch('chat/sendMessage', newMessage);
            this.message = '';
            this.files = [];
          } catch (e) {
            this.$notify({
              type: 'danger',
              message: this.$t('chat.messageError'),
              icon: 'tim-icons icon-check-2',
            });
          }
        }
      } else {
        this.$notify({
          type: 'danger',
          message: this.$t('chat.messageError'),
          icon: 'tim-icons icon-check-2',
        });
      }
    },
    handleFileUpload() {
      const resolutions = ['png', 'jpg', 'jpeg', 'PNG', 'doc', 'docx', 'pdf'];
      const { files } = this.$refs.file;
      if (files.length) {
        // eslint-disable-next-line no-plusplus
        this.filesLength++;
        const extension = files[0].name.substr(files[0].name.lastIndexOf('.') + 1);
        extension.toLowerCase();
        // eslint-disable-next-line no-plusplus
        const oldFilesSize = this.allFilesSize;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < files.length; i++) {
          if ((files[i].size + this.allFilesSize) < 15728640) {
            if (!resolutions.includes(extension)) {
              this.allFilesSize += files[i].size;
            }
          } else {
            this.enoughSize = false;
            this.allFilesSize = oldFilesSize;
            this.$notify({
              type: 'danger',
              message: this.$t('chat.messageErrorFileSize'),
              icon: 'tim-icons icon-check-2',
            });
            break;
          }
        }
        if (resolutions.includes(extension) && this.enoughSize) {
          for (let i = 0; i < files.length; i += 1) {
            const currentFile = files[i];
            const file = {};
            const reader = new FileReader();
            file.file = currentFile;
            file.name = currentFile.name;
            file.type = currentFile.type;
            reader.onload = (function (file, files) {
              return function (e) {
                const images = /image\/.+/gm;
                file.isImg = images.test(file.type);
                // eslint-disable-next-line prefer-destructuring
                file.bcode = e.target.result.split(',')[1];
                file.src = e.target.result;
                files.push(file);
              };
            }(file, this.files));
            reader.readAsDataURL(currentFile);
          }
        } else if (!resolutions.includes(extension)) {
          this.enoughSize = true;
          this.$notify({
            type: 'danger',
            message: this.$t('chat.messageErrorFileExtension'),
            icon: 'tim-icons icon-check-2',
          });
        }
      }
    },
    delteFile(file) {
      this.allFilesSize -= file.file.size;
      const { files } = this;
      this.files = files.filter((item) => item.name !== file.name);
    },
    handleCompleteDialogue() {
      const model = {
        id: this.currentId,
      };
      this.$api.closeChat(model);
      this.isEndDialogueModal = false;
      this.localCurrentMessages = [];
      this.$store.commit('chat/closeChat', this.currentId);
    },
  },
};
</script>

<style lang="scss">
  .disabled-component {
    opacity: 0.3;
    pointer-events: none;
  }
  .chat {
    display: flex;
    min-height: 883px;
    &__menu-btn {
      background-color: transparent;
      border: none;
      outline: none;
      &:focus {
        outline: none;
      }
    }
    .chat__title {
      font-size: 17px;
      line-height: 21px;
      font-weight: normal;
      color: #fff;
    }
    .chat__body-flex {
      display: flex;
      flex-direction: column;
    }
    .chat__body {
      width: 100%;
      overflow: auto;
      flex-basis: 400px;
      flex-shrink: 0;
      flex-grow: 1;
      padding-right: 15px;
      margin-right: -13px;
    }
    .chat__footer {
      background-color: #31334B;
    }
  &-busy {
    width: 100%;
    .bg-light {
      background-color: transparentize($color: #31334B, $amount: 0.2) !important;
    }
    .card {
      margin-bottom: 0;
    }
  }
  }
  .chat-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 883px;
    &__body {
      width: 100%;
      display: flex;
      align-items: center;
    }
  }
  .chat-form {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    &__input {
      height: 100%;
      flex-grow: 1;
      margin-bottom: 0;
    }
    &__textarea {
       & > textarea {
        background-color: transparent;
         padding-left: 0;
        padding-top: 7px;
        padding-bottom: 8px;
        border: none;
        color: #fff;
        &:focus {
          border-color: #E14ECA;
          color: #fff;
        }
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
        }

        &::-webkit-scrollbar-thumb:hover {
            background-color: #31334B;
        }
      }
    }
    &__send-btn {
      margin-left: 15px;
      width: 56px;
      height: 40px;
      padding: 0;
    }
    &__clip-btn {
      height: 38px;
      width: 56px;
      border-radius: 4px;
      margin-left: 15px;
      padding: 0;
    }
    &__files {
      display: flex;
      flex-wrap: wrap;
    }
    &__file-wrapper {
      position: relative;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    &__img {
      max-width: 150px;
    }
    &__file-delete {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 20px;
      width: 20px;
      background-color: transparentize($color: #31334B, $amount: 0.6);
      color: #E14ECA;
      font-weight: 600;
      font-size: 30px;
      outline: none;
      border: none;
      &:hover {
        background-color: transparentize($color: #31334B, $amount: 0.2);
        outline: none;
      }
      &:active {
        background-color: transparentize($color: #31334B, $amount: 0.4);
        outline: none;
      }
    }
    .file-upload {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      cursor: pointer;
      &__input {
        display: none;
      }
    }
  }
  .ed-modal {
    &__text {
      text-align: center;
    }
    &__btns {
      display: flex;
      justify-content: space-between;
    }
  }
  .message-length-error {
    color: #ec250d;
  }
</style>
<style lang="scss" scoped>
.chat-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.break-line {
  border-bottom: 1px solid #2B3553;
  margin: 0 -15px;
}
</style>
