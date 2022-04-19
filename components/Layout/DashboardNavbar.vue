<template>
  <base-nav
    v-model="showMenu"
    class="navbar-absolute top-navbar"
    type="white"
    :transparent="true"
  >
    <div
      slot="brand"
      class="navbar-wrapper"
    >
      <div class="navbar-minimize d-inline">
        <sidebar-toggle-button />
      </div>
      <div
        class="navbar-toggle d-inline"
        :class="{ toggled: $sidebar.showSidebar }"
      >
        <button
          type="button"
          class="navbar-toggler"
          @click="toggleSidebar"
        >
          <span class="navbar-toggler-bar bar1" />
          <span class="navbar-toggler-bar bar2" />
          <span class="navbar-toggler-bar bar3" />
        </button>
      </div>
      <a
        class="navbar-brand"
      >{{ routeName }}</a>
    </div>

    <ul
      class="navbar-nav"
      :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'"
    >
      <base-dropdown
        tag="li"
        :menu-on-right="!$rtl.isRTL"
        title-tag="a"
        class="nav-item locale"
        title-classes="nav-link"
        menu-classes="dropdown-navbar"
      >
        <template
          slot="title"
        >
          <div class="locale">
            {{ currentLocale }}
          </div>
          <b class="caret d-none d-lg-block d-xl-block" />
        </template>
        <li class="nav-link">
          <a
            href="#"
            class="nav-item dropdown-item"
            @click="changeLocale('ru')"
          >{{ $t(`newSidebar.rus`) }}</a>
        </li>
        <li class="nav-link">
          <a
            href="#"
            class="nav-item dropdown-item"
            @click="changeLocale('en')"
          >{{ $t(`newSidebar.eng`) }}</a>
        </li>
      </base-dropdown>
      <div
        class="search-bar input-group chat-big"
        @click="$router.push('/chat')"
      >
        <button
          class="btn btn-link chat-big"
        >
          <img
            src="/img/icons/chat.svg"
            alt=""
          >
        </button>
        <!-- You can choose types of search input -->
      </div>
      <div
        class="logout"
        @click="logOut()"
      >
        {{ $t('newSidebar.logOut') }}
      </div>
    </ul>
  </base-nav>
</template>
<script>
import { CollapseTransition } from 'vue2-transitions';
import { BaseNav, Modal } from '@/components';
import SidebarToggleButton from './SidebarToggleButton';
import login from '~/pages/login';

export default {
  components: {
    SidebarToggleButton,
    CollapseTransition,
    BaseNav,
    Modal,
  },
  data() {
    return {
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      searchQuery: '',
    };
  },
  computed: {
    routeName() {
      const { path } = this.$route;
      let partsRu = path.split('/')[1];
      if (partsRu === '' || partsRu === undefined) {
        partsRu = 'dashboard';
      }
      return this.$t(`newSidebar.${partsRu}`);
    },
    isRTL() {
      return this.$rtl.isRTL;
    },
    // eslint-disable-next-line vue/return-in-computed-property
    currentLocale() {
      console.log(this.$i18n);
      if (this.$i18n.locale === 'en') {
        return this.$t('newSidebar.eng');
      }
      if (this.$i18n.locale === 'ru') {
        return this.$t('newSidebar.rus');
      }
    },
  },
  methods: {
    changeLocale(locale) {
      this.$i18n.setLocale(locale);
    },
    logOut() {
      this.$cookies.remove('access');
      this.$cookies.remove('refresh');
      this.$router.push('/login');
    },
    capitalizeFirstLetter(string) {
      if (!string || typeof string !== 'string') {
        return '';
      }
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
  },
};
</script>
<style scoped lang="scss">
.top-navbar {
  top: 0px;
}
.logout {
  color: white;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 10px;
  transition: all 300ms ease 0s;
  &:hover {
    color: #e14eca;
  }
}
@media (max-width: 991px) {
  .chat-big {
    display: none !important;
  }
  .logout {
    margin-top: 10px;
    color: #222a42;
    &:hover {
      color: #222a42;
    }
  }
}
@media (max-width: 576px) {
  .navbar-brand {
    display: none;
  }
}
</style>
