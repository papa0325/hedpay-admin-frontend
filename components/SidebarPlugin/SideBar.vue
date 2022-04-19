<template>
  <div
    class="sidebar"
    :data="backgroundColor"
  >
    <div
      ref="sidebarScrollArea"
      class="sidebar-wrapper"
    >
      <div
        class="logo logo-changed"
      >
        <img
          src="/img/Logo.svg"
          alt="app-logo"
        >
      </div>
      <slot />
      <ul class="nav">
        <slot name="links">
          <sidebar-item
            v-for="(link, index) in sidebarLinks"
            :key="link.name + index"
            :link="link"
          >
            <sidebar-item
              v-for="(subLink, index) in link.children"
              :key="subLink.name + index"
              :link="subLink"
            />
          </sidebar-item>
        </slot>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Sidebar',
  props: {
    title: {
      type: String,
      default: 'Sidebar title',
      description: 'Sidebar title',
    },
    shortTitle: {
      type: String,
      default: 'ST',
      description: 'Sidebar short title',
    },
    logo: {
      type: String,
      default: '',
      description: 'Sidebar app logo',
    },
    backgroundColor: {
      type: String,
      default: 'vue',
      validator: (value) => {
        const acceptedValues = [
          '',
          'vue',
          'blue',
          'green',
          'orange',
          'red',
          'primary',
        ];
        return acceptedValues.indexOf(value) !== -1;
      },
      description:
        'Sidebar background color (vue|blue|green|orange|red|primary)',
    },
    sidebarLinks: {
      type: Array,
      default: () => [],
      description:
        "List of sidebar links as an array if you don't want to use components for these.",
    },
    autoClose: {
      type: Boolean,
      default: true,
      description:
        'Whether sidebar should autoclose on mobile when clicking an item',
    },
  },
  provide() {
    return {
      autoClose: this.autoClose,
    };
  },
  beforeDestroy() {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false;
    }
  },
  methods: {
    minimizeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.toggleMinimize();
      }
    },
  },
};
</script>
<style>
.logo-changed {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
@media (min-width: 992px) {
  .navbar-search-form-mobile,
  .nav-mobile-menu {
    display: none;
  }
}
</style>
