<template>
  <div class="user">
    <div class="user__title">
      <base-button
        type="primary"
        @click="goBack()"
      >
        <i class="tim-icons icon-minimal-left" />
        {{ $t('management.orderHistory.back') }}
      </base-button>
      <b-overlay
        :show="userBusy"
        rounded
        opacity="0.6"
        spinner-small
        spinner-variant="primary"
        class="d-inline-block user-busy"
      >
        <div class="user-busy-items">
          <h3>{{ userData.username }}</h3>
          <div
            v-if="!userBusy"
            class="col-auto line"
          />
          <p class="text-muted">
            {{ userData.email }}
          </p>
        </div>
      </b-overlay>
    </div>
    <card
      card-body-classes="table-full-width no-padding"
    >
      <div
        slot="header"
        class="slot-header"
      >
        <div
          class="user__menu menu card-title"
        >
          <div class="menu__items">
            <div
              class="menu__item"
              @click="changeComponent('general')"
            >
              <h4
                :class="{'menu__item_active-text': currentComponent === 'general'}"
              >
                {{ $t('management.user-info.general.title') }}
              </h4>
              <div
                v-if="currentComponent === 'general'"
                class="menu__item_active"
              />
            </div>
            <div
              class="menu__item"
              @click="changeComponent('balance')"
            >
              <h4 :class="{'menu__item_active-text': currentComponent === 'balance'}">
                {{ $t('management.user-info.balance.title') }}
              </h4>
              <div
                v-if="currentComponent === 'balance'"
                class="menu__item_active"
              />
            </div>
            <div
              class="menu__item"
              @click="changeComponent('transactions')"
            >
              <h4 :class="{'menu__item_active-text': currentComponent === 'transactions'}">
                {{ $t('management.user-info.transactions.title') }}
              </h4>
              <div
                v-if="currentComponent === 'transactions'"
                class="menu__item_active"
              />
            </div>
            <div
              class="menu__item"
              @click="changeComponent('loginLogs')"
            >
              <h4 :class="{'menu__item_active-text': currentComponent === 'loginLogs'}">
                {{ $t('management.user-info.loginLogs.title') }}
              </h4>
              <div
                v-if="currentComponent === 'loginLogs'"
                class="menu__item_active"
              />
            </div>
            <div
              class="menu__item"
              @click="changeComponent('settings')"
            >
              <h4 :class="{'menu__item_active-text': currentComponent === 'settings'}">
                {{ $t('management.user-info.settings.title') }}
              </h4>
              <div
                v-if="currentComponent === 'settings'"
                class="menu__item_active"
              />
            </div>
            <div
              class="menu__item"
              @click="changeComponent('locks')"
            >
              <h4 :class="{'menu__item_active-text': currentComponent === 'locks'}">
                {{ $t('management.user-info.locks.title') }}
              </h4>
              <div
                v-if="currentComponent === 'locks'"
                class="menu__item_active"
              />
            </div>
            <div
              class="menu__item"
              @click="changeComponent('orders')"
            >
              <h4 :class="{'menu__item_active-text': currentComponent === 'orders'}">
                {{ $t('management.orderHistory.title') }}
              </h4>
              <div
                v-if="currentComponent === 'orders'"
                class="menu__item_active"
              />
            </div>
          </div>
        </div>
        <div
          class="break-line"
        />
      </div>
      <!--   components   -->
      <div class="user__components">
        <General v-if="currentComponent === 'general'" />
        <Orders v-if="currentComponent === 'orders'" />
        <Balance v-if="currentComponent === 'balance'" />
        <Settings v-if="currentComponent === 'settings'" />
        <Transactions v-if="currentComponent === 'transactions'" />
        <Logs v-if="currentComponent === 'loginLogs'" />
        <Locks v-if="currentComponent === 'locks'" />
      </div>
    </card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import General from '~/components/UserProfile/General.vue';
import Orders from '~/components/UserProfile/Orders.vue';
import Balance from '~/components/UserProfile/Balance.vue';
import Settings from '~/components/UserProfile/Settings.vue';
import Transactions from '~/components/UserProfile/Transactions.vue';
import Logs from '~/components/UserProfile/Logs.vue';
import Locks from '~/components/UserProfile/Locks.vue';

export default {
  middleware: 'auth',
  name: 'Index',
  components: {
    General,
    Orders,
    Balance,
    Settings,
    Transactions,
    Logs,
    Locks,
  },
  data() {
    return {
      userBusy: true,
      currentComponent: 'general',
    };
  },
  computed: {
    ...mapGetters({
      userData: 'management/userData',
    }),
  },
  async mounted() {
    await this.getUserData();
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
    async getUserData() {
      try {
        let numIs = this.$route.params.index;
        numIs = isNaN(parseInt(numIs));
        // eslint-disable-next-line valid-typeof
        if (this.$route.params.index.length < 30 && !numIs) {
          await this.$store.dispatch('management/getUserData', this.$route.params.index);
          this.userBusy = false;
        } else {
          this.$notify({
            type: 'danger',
            message: 'Invalid user id',
            icon: 'tim-icons icon-alert-circle-exc',
          });
          this.$router.push('/users-management');
        }
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
        this.$router.push('/users-management');
      }
    },
    goBack() {
      this.$router.push('/users-management');
      const userdata = {};
      this.$store.commit('management/setUserData', userdata);
    },
    changeComponent(component) {
      this.currentComponent = component;
    },
  },
};
</script>

<style lang="scss">
.user-busy {
  height: 100%;
  &-items {
    display: flex;
    align-items: center;
  }
  .bg-light {
    background-color: transparentize($color: #31334B, $amount: 0.2) !important;
  }
}
</style>

<style scoped lang="scss">
.user {
  button {
    width: auto;
    padding: 10px 10px;
    height: 40px;
  }
  h3 {
    margin: 0 0 0 20px;
  }
  p {
    margin: 0 20px 0 0;
  }
  &__title {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }
}
.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0 !important;
  height: 60px;
  margin-top: -15px;
  &__items {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  &__item {
    padding: 0 15px;
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &:nth-child(1) {
      padding-left: 0;
    }
    h4 {
      margin: 0;
      opacity: 0.3;
    }
    &_active {
      border-bottom: 2px solid #E14ECA;
      position: relative;
      width: 100%;
      top: 18px;
    }
    &_active-text {
      opacity: 1 !important;
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
@media (max-width: 1000px) {
  .menu {
    &__item {
      padding: 0 15px;
      cursor: pointer;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &:nth-child(1) {
        padding-left: 0;
      }
      h4 {
        font-size: 16px;
        margin: 0;
        opacity: 0.3;
      }
      &_active {
        border-bottom: 2px solid #E14ECA;
        position: relative;
        width: 100%;
        top: 18px;
      }
      &_active-text {
        opacity: 1 !important;
      }
    }
    &__btn {
      padding: 5px;
      width: auto;
      button {
        width: 100%;
        margin: 0;
      }
    }
  }
}
</style>
