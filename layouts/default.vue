<template>
  <div
    class="wrapper"
    :class="{ 'nav-open': $sidebar.showSidebar }"
  >
    <notifications />
    <sidebar-fixed-toggle-button />
    <side-bar
      :background-color="sidebarBackground"
      :short-title="$t('newSidebar.shortTitle')"
      :title="$t('newSidebar.title')"
    >
      <template
        slot="links"
      >
        <!--    Для добавления пунктов sidebar-item. Для подпунктов внутри пункта добавить тот же тег
        Поля в link: name - передает имя пункта, icon -  передает стиль иконку (обязатьлоно с "tim-icons"),
        img - передает путь к картинке если не передавать icon, path - путь ссылки    -->
        <sidebar-item
          :link="{
            name: $t('newSidebar.dashboard'),
            icon: 'tim-icons icon-chart-pie-36',
            path: '/'
          }"
        />
        <sidebar-item
          :link="{
            name: 'Settings',
            icon: 'tim-icons icon-settings-gear-63',
          }"
        >
          <sidebar-item
            :link="{
              name: 'Available currencies',
              path: '/available-currencies'
            }"
          />
          <sidebar-item
            :link="{
              name: 'Packages',
              path: '/packages'
            }"
          />
          <sidebar-item
              :link="{
              name: 'Stakes',
              path: '/stakes'
            }"
          />
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Messenger',
            path: '/messenger',
            img: '/img/icons/chat.svg'
          }"
        />
        <sidebar-item
          :link="{
            name: $t('newSidebar.management'),
            icon: 'tim-icons icon-single-02',
          }"
        >
          <sidebar-item
            :link="{
              name: 'Users',
              path: '/users-management'
            }"
          />
          <sidebar-item
            :link="{
              name: 'Admins',
              path: '/admins-management'
            }"
          />
        </sidebar-item>
        <sidebar-item
          :link="{
            name: $t('newSidebar.transactions'),
            img: '/img/icons/Transactions.svg',
            path: '/transactions'
          }"
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: $t('newSidebar.statistics'),
            path: '/statistics',
            img: '/img/icons/Statistics.svg'
          }"
        />
        <sidebar-item
          :link="{
            name: $t('newSidebar.faq-editor'),
            path: '/faq-editor',
            icon: 'tim-icons icon-paper'
          }"
        />
      </template>
    </side-bar>
    <!-- Плагин для настройки цвета/отображение сайдбара, так же возможно добавление кнопок-->
    <!--    <sidebar-share :background-color.sync="sidebarBackground" />-->
    <div
      class="main-panel"
      :data="sidebarBackground"
    >
      <dashboard-navbar />
      <router-view name="header" />

      <div
        :class="{ content: !isFullScreenRoute }"
        @click="toggleSidebar"
      >
        <zoom-center-transition
          :duration="200"
          mode="out-in"
        >
          <!-- your content here -->
          <nuxt />
        </zoom-center-transition>
      </div>
    <!--   Стандартный футер   -->
    <!--      <content-footer v-if="!isFullScreenRoute" />-->
    </div>
  </div>
</template>
<script>
/* eslint-disable no-new */
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import SidebarShare from '@/components/Layout/SidebarSharePlugin';

import DashboardNavbar from '@/components/Layout/DashboardNavbar.vue';
import ContentFooter from '@/components/Layout/ContentFooter.vue';
import DashboardContent from '@/components/Layout/Content.vue';
import SidebarFixedToggleButton from '@/components/Layout/SidebarFixedToggleButton.vue';
import { SlideYDownTransition, ZoomCenterTransition } from 'vue2-transitions';
import Sidebar from '@/components/SidebarPlugin/SideBar';
import { mapGetters } from 'vuex';

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

export default {
  components: {
    Sidebar,
    DashboardNavbar,
    ContentFooter,
    SidebarFixedToggleButton,
    DashboardContent,
    SlideYDownTransition,
    ZoomCenterTransition,
    SidebarShare,
  },
  data() {
    return {
      sidebarBackground: 'vue', // vue|blue|orange|green|red|primary
    };
  },
  computed: {
    ...mapGetters({
      role: 'user/userRole',
    }),
    isFullScreenRoute() {
      return this.$route.path === '/maps/full-screen';
    },
  },
  mounted() {
    this.initScrollbar();
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    initScrollbar() {
      const docClasses = document.body.classList;
      const isWindows = navigator.platform.startsWith('Win');
      if (isWindows) {
        // if we are on windows OS we activate the perfectScrollbar function
        initScrollbar('sidebar');
        initScrollbar('main-panel');
        initScrollbar('sidebar-wrapper');

        docClasses.add('perfect-scrollbar-on');
      } else {
        docClasses.add('perfect-scrollbar-off');
      }
    },
  },
};
</script>
<style lang="scss">
$scaleSize: 0.95;
@keyframes zoomIn95 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  to {
    opacity: 1;
  }
}

.main-panel .zoomIn {
  animation-name: zoomIn95;
}

@keyframes zoomOut95 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}

.main-panel .zoomOut {
  animation-name: zoomOut95;
}
</style>
