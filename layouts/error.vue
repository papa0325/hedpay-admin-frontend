<template>
  <div class="__nuxt-error-page">
    <div class="error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="90"
        height="90"
        fill="#DBE1EC"
        viewBox="0 0 48 48"
      >
        <path d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z" />
      </svg>

      <div
        v-if="message === 'Cannot read property \'data\' of undefined'"
        class="title"
      >
        {{ $t('error.serverError') }}
      </div>
      <div
        v-else
        class="title"
      >
        {{ message }}
      </div>
      <p
        v-if="statusCode === 404"
        class="description"
      >
        <a
          v-if="typeof $route === 'undefined'"
          class="error-link"
          href="/"
        />
        <a
          v-else
          class="error-link"
          href="/"
        >{{ $t('error.backToHome') }}</a>
      </p>
      <a
        v-if="statusCode === 401"
        class="error-link"
        href="/login"
      >{{ $t('error.backToLogin') }}</a>
      <a
        v-else
        class="error-link"
        href="/login"
      >{{ $t('error.backToLogin') }}</a>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  name: 'NuxtError',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  computed: {
    statusCode() {
      return (this.error && this.error.statusCode) || 500;
    },
    message() {
      return this.error.message || 'Error';
    },
  },
  head() {
    return {
      title: this.message,
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0',
        },
      ],
    };
  },
};
</script>

<style>
  .__nuxt-error-page {
    padding: 1rem;
    color: white;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: sans-serif;
    font-weight: 100 !important;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .__nuxt-error-page .error {
    max-width: 450px;
  }
  .__nuxt-error-page .title {
    font-size: 1.5rem;
    margin-top: 15px;
    color: white;
    margin-bottom: 8px;
  }
  .__nuxt-error-page .description {
    color: white;
    line-height: 21px;
    margin-bottom: 10px;
  }
  .__nuxt-error-page a {
    color: white !important;
    text-decoration: none;
    transition: all 300ms ease 0s;
  }
  .__nuxt-error-page a:hover {
    color: #e14eca !important;
    text-decoration: none;
  }
  .__nuxt-error-page .logo {
    position: fixed;
    left: 12px;
    bottom: 12px;
  }
</style>
