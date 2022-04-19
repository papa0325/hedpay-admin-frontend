<template>
  <div class="container">
    <b-overlay
      :show="busyRegStepOne"
      rounded
      opacity="0.6"
      spinner-small
      spinner-variant="primary"
      class="d-inline-block step-one-busy"
    >
      <card>
        <div class="row">
          <h4>
            {{ $t('registration.title') }}
          </h4>
        </div>
        <div class="row">
          <div
            v-show="basic"
            class="col-12"
          >
            <base-input
              v-model.trim="regModel.email"
              maxlength="50"
              name="email"
              disabled
              class="disabled-input"
              :autocomp="'off'"
            />
            <base-input
              v-model.trim="regModel.firstName"
              v-validate="'required|alpha|min:3|max:40|alpha_latin'"
              name="firstName"
              maxlength="40"
              :error="getError('firstName')"
              :autocomp="'given-name'"
              :placeholder="$t('registration.firstName')"
            />
            <base-input
              v-model.trim="regModel.lastName"
              v-validate="'required|alpha|min:3|max:40|alpha_latin'"
              name="lastName"
              maxlength="40"
              :autocomp="'family-name'"
              :error="getError('lastName')"
              :placeholder="$t('registration.lastName')"
            />
            <base-input
              ref="password"
              v-model.trim="regModel.password"
              v-validate="'required|min:7'"
              maxlength="40"
              name="password"
              type="password"
              :autocomp="'off'"
              :error="getError('password')"
              :placeholder="$t('registration.password')"
            />
            <base-input
              v-model.trim="passwordConfirm"
              v-validate="'required|min:7|confirmed:password'"
              maxlength="40"
              name="passwordConfirm"
              :error="getError('passwordConfirm')"
              :placeholder="$t('registration.passwordConfirm')"
              :autocomp="'off'"
              type="password"
              data-vv-as="password"
            />
          </div>
          <div
            v-show="final"
            class="col-12"
          >
            <h3>
              OTP
            </h3>
            <img
              class="QR"
              :src="QRCode"
              alt=""
            >
            <base-input
              v-model.trim="token2FA"
              v-validate="'min:6|max:6|numeric'"
              v-mask="'######'"
              name="token2FA"
              maxlength="6"
              :error="getError('token2FA')"
              :placeholder="$t('registration.token2FA')"
            />
          </div>
        </div>
        <div class="row">
          <div
            v-show="basic"
            class="col-12"
          >
            <b-overlay
              :show="busy"
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block"
            >
              <base-button
                type="primary"
                class="mb-3"
                size="lg"
                block
                @click="registrationBase()"
              >
                {{ $t('registration.confirm') }}
              </base-button>
            </b-overlay>
          </div>
          <div
            v-show="final"
            class="col-12"
          >
            <b-overlay
              :show="busy"
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block"
            >
              <base-button
                type="primary"
                class="mb-3"
                size="lg"
                block
                @click="registrationFinal()"
              >
                {{ $t('registration.complete') }}
              </base-button>
            </b-overlay>
          </div>
        </div>
      </card>
    </b-overlay>
  </div>
</template>

<script>

export default {
  name: 'Registration',
  layout: 'auth',
  data() {
    return {
      busyRegStepOne: true,
      regModel: {
        firstName: '',
        lastName: '',
        password: '',
        email: '',
      },
      passwordConfirm: '',
      final: false,
      basic: true,
      token2FA: '',
      QRCode: null,
      busy: false,
    };
  },
  //  Динамический путь, токен
  async mounted() {
    const verifyToken = this.$route.params.registration;
    await this.registrationVerify(verifyToken);
  },
  methods: {
    async registrationVerify(verifyToken) {
      try {
        const response = await this.$api.registrationVerify(verifyToken);
        this.regModel.email = response.result.email;
        this.busyRegStepOne = false;
      } catch (e) {
        this.$router.push('/login');
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
    },
    async registrationFinal() {
      if (this.token2FA.length === 6) {
        try {
          this.busy = true;
          const finalModel = {
            token2FA: this.token2FA,
            email: this.regModel.email,
          };
          const response = await this.$api.registrationFinal(finalModel);
          this.$store.commit('user/setNewTokens', response);
          this.$router.push('/');
        } catch (e) {
          this.busy = false;
          this.$notify({
            type: 'danger',
            message: e.response.data.message,
            icon: 'tim-icons icon-alert-circle-exc',
          });
        }
      }
      this.busy = false;
    },
    async registrationBase() {
      const isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        try {
          this.busy = true;
          const response = await this.$api.registrationBasic(this.regModel);
          this.QRCode = response.result.QRCode.toString();
          this.final = true;
          this.basic = false;
        } catch (e) {
          this.busy = false;
          this.$notify({
            type: 'danger',
            message: e.response.data.message,
            icon: 'tim-icons icon-alert-circle-exc',
          });
        }
      }
      this.busy = false;
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
  },
};
</script>
<style lang="scss">
  .step-one-busy {
    width: 100%;
    .card {
      margin-bottom: 0;
    }
    .bg-light {
      background-color: transparentize($color: #31334B, $amount: 0.2) !important;
    }
  }
</style>
<style scoped lang="scss">
  .d-inline-block {
    width: 100%;
    button {
      margin: 0;
    }
  }
  .container {
    max-width: 360px;
    .card {
      height: auto;
    }
  }
  .col-6 {
    .form-group {
      margin-bottom: 20px;
    }
  }
  .row {
    button {
      margin-bottom: 0 !important;
    }
    h4 {
      margin-left: 15px;
    }
    h3 {
      margin-bottom: 0;
    }
    img {
      margin: 15px auto;
      display: flex;
      justify-content: center;
    }
  }
  .disabled-input {
    color: #00bbff;
  }

  @media (max-width: 576px) {
    .container {
      max-width: 540px;
    }
  }
</style>
