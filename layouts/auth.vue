<template>
  <div>
    <notifications />
    <div class="locale-change">
      <div class="locale-change-nav">
        <ul
          class="navbar-nav"
          :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'"
        >
          <base-dropdown
            tag="li"
            :menu-on-right="!$rtl.isRTL"
            title-tag="a"
            class="nav-item"
            title-classes="nav-link"
            menu-classes="dropdown-navbar"
          >
            <template
              slot="title"
            >
              <div class="locale">
                {{ currentLocale }}
              </div>
              <b class="locale-drop caret" />
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
        </ul>
      </div>
    </div>
    <div class="wrapper wrapper-full-page">
      <div
        class="full-page"
        :class="pageClass"
      >
        <div class="content">
          <zoom-center-transition
            :duration="pageTransitionDuration"
            mode="out-in"
          >
            <nuxt />
          </zoom-center-transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { BaseNav } from '@/components';
import { ZoomCenterTransition } from 'vue2-transitions';

export default {
  components: {
    BaseNav,
    ZoomCenterTransition,
  },
  props: {
    backgroundColor: {
      type: String,
      default: 'black',
    },
  },
  data() {
    return {
      showMenu: false,
      menuTransitionDuration: 250,
      pageTransitionDuration: 200,
      year: new Date().getFullYear(),
      pageClass: 'login-page',
    };
  },
  computed: {
    title() {
      const parts = this.$route.path.split('/');
      const name = parts[parts.length - 1];
      return `${name} Page`;
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
  beforeDestroy() {
    this.closeMenu();
  },
  methods: {
    closeMenu() {
      document.body.classList.remove('nav-open');
      this.showMenu = false;
    },
    changeLocale(locale) {
      this.$i18n.setLocale(locale);
    },
  },
  beforeRouteUpdate(to, from, next) {
    // Close the mobile menu first then transition to next page
    if (this.showMenu) {
      this.closeMenu();
      setTimeout(() => {
        next();
      }, this.menuTransitionDuration);
    } else {
      next();
    }
  },
};
</script>
<style lang="scss" scoped>
.navbar-nav li a {
  color: #9A9A9A;
}
.locale {
  margin-left: 78%;
}
.locale-drop {
  margin-left: 85%;
  top: 22px;
}
.locale-change {
  right: 0;
  background: transparent !important;
  position: absolute;
  z-index: 1050;
}
</style>

<style lang="scss">
.navbar.auth-navbar {
  top: 0;
}

$scaleSize: 0.8;
@keyframes zoomIn8 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  100% {
    opacity: 1;
  }
}

.wrapper-full-page .zoomIn {
  animation-name: zoomIn8;
}

@keyframes zoomOut8 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}

.wrapper-full-page .zoomOut {
  animation-name: zoomOut8;
}
</style>
