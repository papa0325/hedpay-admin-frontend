<template>
  <div class="container login-page">
    <div class="col-lg-6 col-md-8 ml-auto mr-auto">
      <form
        @submit.prevent="login"
        @keypress.enter="login()"
      >
        <card class="card-login card-white">
          <template slot="header">
            <h3 class="card-title-text">
              {{ $t('login.smallTitle') }}
            </h3>
            <h1 class="card-title">
              {{ $t('login.bigTitle') }}
            </h1>
          </template>
          <div class="form-fix">
            <base-input
              v-model.trim="model.email"
              v-validate="'required|email|max:50'"
              maxlength="50"
              name="email"
              :error="getError('email')"
              :placeholder="$t('login.email')"
              :label="$t('login.email')"
              autocomp="email"
            />

            <base-input
              v-model.trim="model.password"
              v-validate="'required|min:7|max:40'"
              maxlength="40"
              name="password"
              :error="getError('password')"
              type="password"
              :label="$t('login.password')"
              :placeholder="$t('login.password')"
              autocomp="current-password"
            />

            <base-input
              v-model.trim="model.token2FA"
              v-validate="'required|min:6|max:6|numeric'"
              v-mask="'######'"
              maxlength="6"
              name="token"
              :error="getError('token')"
              :label="$t('login.token')"
              type="password"
              autocomp="off"
              :placeholder="$t('login.token')"
            />

            <div class="form__password-forget">
              <a @click="toForgot()">{{ $t('login.forgotPass') }}</a>
            </div>
          </div>

          <div slot="footer">
            <b-overlay
              :show="busy"
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block"
            >
              <base-button
                ref="button"
                type="primary"
                :disabled="busy"
                size="lg"
                block
                @click="login()"
              >
                {{ $t('login.button') }}
              </base-button>
            </b-overlay>
          </div>
        </card>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LoginPage',
  layout: 'auth',
  middleware: 'guest',
  data() {
    return {
      busy: false,
      model: {
        email: '',
        password: '',
        token2FA: '',
      },
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async login() {
      const isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        try {
          this.busy = true;
          const response = await this.$api.signIn(this.model);
          this.$store.commit('user/setNewTokens', response);
          this.$router.push('/');
        } catch (e) {
          console.dir(e);
          this.$notify({
            type: 'danger',
            message: e.response.data.message,
            icon: 'tim-icons icon-alert-circle-exc',
          });
        }
      }
      this.busy = false;
    },
    toForgot() {
      this.$router.push('/forgot-password');
    },
  },
};
</script>
<style scoped lang="scss">
.card-title {
  padding: 10px 15px !important;
}
.card-title-text {
  padding: 0 15px !important;
}

.form__password-forget {
  font-size: 14px;
  line-height: 17px;
  align-items: center;
  text-align: right;
  a {
    transition: all 0.15s ease;
    text-decoration-line: underline;
    color: #1E1E2E;
    opacity: 0.6;
    cursor: pointer;
    &:hover {
      text-decoration-line: none;
      color: #E14ECA;
    }
  }
}
.d-inline-block {
  width: 100%;
  button {
    margin: 0;
  }
}
.navbar-nav .nav-item p {
  line-height: inherit;
  margin-left: 5px;
}
  .login-page {
    form {
      .card-login {
        padding: 10px;
      }
    }
  }
  .form-fix {
    .form-group {
      margin-bottom: 15px !important;
    }
    .form-group:last-child {
      margin-bottom: 10px !important;
    }
  }
</style>
