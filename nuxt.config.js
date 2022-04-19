import dateTimeFormats from './assets/locales/dateTimeFormats';

export default {
  ssr: false,
  target: 'static',
  /*
  ** Headers of the page
  */
  head: {
    title: 'HedPay admin site',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'HedPay' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Poppins:200,300,400,600,700,800' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css' },
    ],
    bodyAttrs: {
      class: 'sidebar-mini', // delete the class to have the sidebar expanded by default. Add `white-content` class here to enable "white" mode.
    },
  },
  router: {
    linkExactActiveClass: 'active',
    // middleware: ['auth', 'guest'],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    'assets/css/demo.css',
    'assets/css/nucleo-icons.css',
    'assets/sass/black.scss',
    'simplemde/dist/simplemde.min.css',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/dashboard-plugin.js',
    '~/plugins/axios.js',
    '~/plugins/api.js',
    { src: '~plugins/bignumber', ssr: false },
    { src: '~plugins/TokensRefresher', ssr: false },
    { src: '~/plugins/PrivateConnection', ssr: false },
    { src: '~plugins/ws', ssr: false },
    { src: '~/plugins/full-calendar.js', ssr: false },
    { src: '~/plugins/world-map.js', ssr: false },
    { src: '~plugins/nuxt-simplemde-plugin.js', mode: 'client' },
    { src: '~plugins/v-mask', ssr: false },
    { src: '~mixins/global.js', ssr: false },
    { src: '~/plugins/clipboard.js', ssr: false },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
    'nuxt-i18n',
    'cookie-universal-nuxt',
    '@nuxtjs/axios',
    'bootstrap-vue/nuxt',
  ],
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.js',
      },
      {
        code: 'ar',
        file: 'ar.js',
      },
      {
        code: 'ru',
        file: 'ru.js',
      },
    ],
    strategy: 'no_prefix',
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      onlyOnRoot: true,
    },
    vueI18n: {
      dateTimeFormats,
    },
  },
  // server: {
  //   port: 8000, // default: 3000
  //   host: '0.0.0.0', // default: localhost
  // }, // other configs
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    },
    babel: {
      plugins: [
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: 'theme-chalk',
          },
        ],
      ],
      compact: false,
    },
  },
  // Основной апи
  axios: {
    baseURL: 'https://manage-test.hedpay.com/api',
  },
};
