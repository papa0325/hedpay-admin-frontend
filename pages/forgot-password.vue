<template>
  <div class="container login-page">
    <div class="col-lg-6 col-md-8 ml-auto mr-auto">
      <form
        v-if="!checkEmail"
        @submit.prevent="resetPass"
        @keypress.enter="resetPass()"
      >
        <card class="card-login card-white">
          <template slot="header">
            <h1 class="card-title">
              {{ $t('forgot-pass.forgotPass') }}
            </h1>
            <h5 class="card-title-text">
              {{ $t('forgot-pass.forgotDesc') }}
            </h5>
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
                @click="resetPass()"
              >
                {{ $t('forgot-pass.resetPass') }}
              </base-button>
            </b-overlay>
          </div>
        </card>
      </form>
      <card
        v-else
        class="card-login card-white"
        style="padding: 10px"
      >
        <template slot="header">
          <h1 class="card-title">
            {{ $t('forgot-pass.checkEmail') }}
          </h1>
          <h5
            class="card-title-text"
            style="margin-bottom: 180px"
          >
            {{ $t('forgot-pass.checkDesc') }}
          </h5>
        </template>

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
              @click="toLogin()"
            >
              {{ $t('forgot-pass.ok') }}
            </base-button>
          </b-overlay>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ForgotPassword',
  layout: 'auth',
  middleware: 'guest',
  data() {
    return {
      busy: false,
      checkEmail: false,
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
    async resetPass() {
      // const isValidForm = await this.$validator.validateAll();
      // if (isValidForm) {
      //   try {
      //     console.log(123);
      //     this.checkEmail = true;
      //   } catch (e) {
      //     this.$notify({
      //       type: 'danger',
      //       message: e.response.data.message,
      //       icon: 'tim-icons icon-alert-circle-exc',
      //     });
      //   }
      // }
      // this.busy = false;
      this.checkEmail = true;
    },
    async toLogin() {
      this.checkEmail = false;
      // this.$router.push('/login');
    },
  },
};
</script>
<style scoped lang="scss">
.card-title {
  padding: 10px 15px 0 15px !important;
}
.card-title-text {
  font-size: 14px;
  color: #1E1E2E;
  opacity: 0.6;
  font-weight: normal;
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
    margin-bottom: 180px !important;
  }
}
</style>
