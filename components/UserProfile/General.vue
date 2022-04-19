<template>
  <div class="general">
    <div class="general__cards">
      <div class="carding">
        <img
          src="~/static/img/genBack.svg"
          alt=""
        >
        <div class="carding__status">
          <label
            v-if="!userData.isBlocked"
            class="verified-active"
          >
            {{ $t('management.user-info.general.active') }}
          </label>
          <label
            v-if="userData.isBlocked"
            class="verified-banned"
          >
            {{ $t('management.user-info.general.blocked') }}
          </label>
        </div>
        <div class="carding__name">
          <h4>{{ userData.username }}</h4>
        </div>
        <div class="carding__email">
          {{ userData.email }}
        </div>
        <div class="carding__btns">
          <div class="general__btns">
            <base-button
              v-if="userData.isBlocked === false"
              type="info"
              @click="openHoldModal"
            >
              <img
                src="/img/icons/hold.svg"
                alt=""
              >
              <span>
                {{ $t('management.table.hold') }}
              </span>
            </base-button>
            <modal
              id="holdModal"
              :show.sync="holdModal"
              class="modal-black modal show"
              :centered="false"
              :show-close="true"
              :modal-classes="'modal-md'"
              @close="closeModal"
            >
              <h4
                slot="header"
                class="card-title"
              >
                {{ $t('management.user-info.general.modal.title') }}
              </h4>
              <form @submit.prevent>
                <div class="user-hold">
                  <div class="user-hold_item">
                    <el-select
                      v-model="time"
                      class="select-primary pagination-select"
                      :placeholder="$t('management.user-info.general.modal.holdTime')"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in holdTime"
                        :key="item.value"
                        class="select-primary"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                  <div class="user-hold_item">
                    <base-input
                      v-model.trim="comment"
                      v-validate="'required|max:200|min:10'"
                      :placeholder="$t('management.user-info.general.modal.comment')"
                      maxlength="200"
                      name="description"
                      :error="getError('description')"
                    />
                  </div>
                </div>
                <div class="btns">
                  <base-button
                    class="btn"
                    type="primary"
                    @click="closeModal"
                  >
                    {{ $t('management.user-info.general.modal.close') }}
                  </base-button>
                  <base-button
                    class="btn"
                    type="primary"
                    @click="holdUser()"
                  >
                    {{ $t('management.user-info.general.modal.hold') }}
                  </base-button>
                </div>
              </form>
            </modal>
            <base-button
              v-if="userData.isBlocked"
              type="danger"
              @click="userStatusChange(userData.id, userData.isBlocked)"
            >
              <img
                src="/img/icons/block.svg"
                alt=""
              >
              <span>
                {{ $t('management.table.unblock') }}
              </span>
            </base-button>
            <base-button
              v-if="!userData.isBlocked"
              type="danger"
              @click="openBlockModal()"
            >
              <img
                src="/img/icons/block.svg"
                alt=""
              >
              <span>
                {{ $t('management.table.block') }}
              </span>
            </base-button>
            <modal
              id="blockModal"
              :show.sync="blockModal"
              class="modal-black modal show"
              :centered="false"
              :show-close="true"
              :modal-classes="'modal-md'"
              @close="closeModal"
            >
              <h4
                slot="header"
                class="card-title"
              >
                {{ $t('management.user-info.general.modal.titleBlock') }}
              </h4>
              <form @submit.prevent>
                <div class="user-hold">
                  <div class="user-hold_item">
                    <base-input
                      v-model.trim="banComment"
                      v-validate="'required|max:200|min:10'"
                      :placeholder="$t('management.user-info.general.modal.comment')"
                      maxlength="200"
                      name="ban"
                      :error="getError('ban')"
                    />
                  </div>
                </div>
                <div
                  class="btns"
                >
                  <base-button
                    class="btn"
                    type="primary"
                    @click="closeModal"
                  >
                    {{ $t('management.user-info.general.modal.close') }}
                  </base-button>
                  <base-button
                    class="btn"
                    type="primary"
                    @click="userStatusChange(userData.id, userData.isBlocked)"
                  >
                    {{ $t('management.user-info.general.block') }}
                  </base-button>
                </div>
              </form>
            </modal>
            <base-button
              type="primary"
              @click="startChat()"
            >
              <img
                src="/img/icons/chat.svg"
                alt=""
              >
              <span>
                {{ $t('management.user-info.userChat') }}
              </span>
            </base-button>
          </div>
        </div>
      </div>
      <div
        class="small-cards col"
        style="margin: 0 -15px"
      >
        <div class="small-cards__card">
          <img
            src="/img/icons/mail.svg"
            alt=""
          >
          <h5>
            {{ $t('management.user-info.general.email') }}
          </h5>
          <h4>
            {{ userData.email }}
          </h4>
        </div>
        <div
          class="small-cards__card"
          style="margin-top: 10px"
        >
          <img
            src="/img/icons/man.svg"
            alt=""
          >
          <h5>
            {{ $t('management.user-info.general.login') }}
          </h5>
          <h4>
            {{ userData.username }}
          </h4>
        </div>
      </div>
      <div
        class="small-cards col"
        style="margin-right: -15px"
      >
        <div class="small-cards__card">
          <img
            src="/img/icons/phone.svg"
            alt=""
          >
          <h5>
            {{ $t('management.user-info.general.phone') }}
          </h5>
          <h4>
            {{ phoneParser }}
          </h4>
        </div>
        <div
          class="small-cards__card"
          style="margin-top: 10px"
        >
          <img
            src="/img/icons/date.svg"
            alt=""
          >
          <h5>
            {{ $t('management.user-info.general.date') }}
          </h5>
          <h4>
            {{ dateParser }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Modal } from '@/components';
import { Option, Select } from 'element-ui';
import login from '~/pages/login';

export default {
  name: 'General',
  components: {
    Modal,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  data() {
    return {
      holdModal: false,
      blockModal: false,
      banComment: '',
      time: '',
      comment: '',
      holdTime: [
        { value: 'HOUR', label: this.$t('management.user-info.general.modal.hour') },
        { value: 'DAY', label: this.$t('management.user-info.general.modal.day') },
        { value: 'THREEDAYS', label: this.$t('management.user-info.general.modal.threeDays') },
      ],
    };
  },
  computed: {
    ...mapGetters({
      userData: 'management/userData',
    }),
    // eslint-disable-next-line vue/return-in-computed-property
    dateParser() {
      if (this.userData.createdAt && this.$i18n.locale) {
        if (this.$i18n.locale === 'en') {
          return this.$d(new Date(this.userData.createdAt), 'long', 'en-US');
        }
        if (this.$i18n.locale === 'ru') {
          return this.$d(new Date(this.userData.createdAt), 'long', 'ru-RU');
        }
      }
    },
    // eslint-disable-next-line vue/return-in-computed-property
    phoneParser() {
      if (!this.userData.phone) {
        return 'No phone number';
      } if (this.userData.phone) {
        return this.userData.phone;
      }
    },
  },
  methods: {
    async startChat() {
      try {
        const response = await this.$api.startChat(this.userData.id);
        const id = response.result.chatID;
        const status = true;
        await this.$store.dispatch('chat/fetchChatById', { id, status });
        await this.$router.push('/chat');
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
    },
    async openBlockModal() {
      this.blockModal = true;
      await this.$validator.errors.clear();
    },
    async openHoldModal() {
      this.holdModal = true;
      await this.$validator.errors.clear();
    },
    async closeModal() {
      this.holdModal = false;
      this.blockModal = false;
      this.banComment = '';
      this.comment = '';
      this.time = '';
      await this.$validator.errors.clear();
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async userStatusChange(userId, isBlocked) {
      const isValidForm = await this.$validator.validateAll('description');
      if (isValidForm) {
        const model = {
          userId,
          isBlocked,
          banComment: this.banComment,
        };
        try {
          await this.$store.dispatch('management/userStatusChange', model);
          if (!this.userData.isBlocked) {
            this.$store.commit('management/changeStatus');
            // this.userData.isBlocked = true;
          } else if (this.userData.isBlocked) {
            this.$store.commit('management/changeStatus');
          }
          this.blockModal = false;
          this.banComment = '';
          this.$notify({
            type: 'success',
            message: this.$t('management.completed'),
            icon: 'tim-icons icon-check-2',
          });
        } catch (e) {
          this.$notify({
            type: 'danger',
            message: e.response.data.message,
            icon: 'tim-icons icon-alert-circle-exc',
          });
        }
      }
    },
    async holdUser() {
      const isValidForm = await this.$validator.validateAll('ban');
      if (this.time) {
        if (isValidForm) {
          try {
            const model = {
              userId: this.userData.id,
              timeInterval: this.time,
              banComment: this.comment,
            };
            await this.$api.holdUser(model);
            this.$notify({
              type: 'success',
              message: this.$t('management.user-info.general.modal.success'),
              icon: 'tim-icons icon-check-2',
            });
            this.time = '';
            this.comment = '';
            this.holdModal = false;
            this.$store.commit('management/changeStatus');
          } catch (e) {
            this.$notify({
              type: 'danger',
              message: e.response.data.message,
              icon: 'tim-icons icon-alert-circle-exc',
            });
          }
        }
      } else {
        this.$notify({
          type: 'danger',
          message: this.$t('management.user-info.general.modal.takeHoldTime'),
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
    },
  },
};
</script>
<style scoped lang="scss">
.small-cards {
  &__card {
    padding: 20px;
    width: 100%;
    height: 150px;
    background: #2E3045;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    img {
      margin-bottom: 30px;
    }
    h5 {
      font-size: 14px;
      line-height: 17px;
      color: #FFFFFF;
      opacity: 0.2;
      margin-bottom: 10px;
    }
    h4 {
      font-weight: 600;
      font-size: 18px;
      line-height: 22px;
      color: #FFFFFF;
      margin: 0;
    }
  }
}
.verified {
  &-active {
    background: #42B883;
    color: white;
  }
  &-banned {
    color: white;
    background: rgba(235, 87, 87, 1);
  }
}
.carding {
  background: #2E3045;
  border-radius: 5px;
  margin-right: 15px;
  width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    position: absolute;
  }
  &__status {
    padding-top: 46px;
      display: flex;
      justify-content: center;
      label {
        width: auto;
        padding: 5px 10px;
        display: flex;
        justify-content: center;
        border-radius: 82px;
        font-size: 14px;
      }
  }
  &__name {
    margin-top: 30px;
    h4 {
      font-weight: normal;
      font-size: 30px;
      line-height: 37px;
      margin: 0;
      color: white;
    }
  }
  &__email {
    margin-top: 10px;
    margin-bottom: 30px;
    h4 {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 17px;
      color: #FFFFFF;
      opacity: 0.3;
      margin: 0;
    }
  }
  &__btns {
    margin-bottom: 45px;
  }
}
.general {
  &__cards {
    display: flex;
  }
  margin-top: 5px;
  &__items {
    display: grid;
    grid-template-columns: auto auto auto auto;
    grid-column-gap: 50px;
  }
  &__item {
    display: flex;
    flex-direction: column;
    &_bold {
      font-weight: 600;
    }
  }
  &__btns {
    button {
      padding: 12px;
      img {
        position: relative;
      }
      span {
        margin-left: 5px;
      }
    }
  }
}
.user-hold {
  display: flex;
  flex-direction: column;
  justify-content: center;
  &_item {
    display: flex;
    margin-bottom: 20px;
  }
  button {
    margin: 0 15px;
    height: 40px;
  }
}
.form-group {
  margin: 0;
  width: 100%;
}
.btns {
  display: flex;
  justify-content: space-between;
}
btn {
  margin: 0;
}
.add-modal {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  img {
    margin-right: 5px;
  }
  button {
    margin: 0;
    padding: 15px 10px;
  }
}
.col {
  button {
    margin: 0;
    border-radius: 0.25rem;
  }
}
</style>
