<template>
  <div class="settings">
    <div class="settings__item">
      <h4>2FA</h4>
      <div
        class="verified"
      >
        <label
          v-if="userData.settings.is2FA === true"
          class="verified-true"
        >
          {{ $t('management.user-info.settings.enabled') }}
        </label>
        <label
          v-if="userData.settings.is2FA === false"
          class="verified-false"
        >
          {{ $t('management.user-info.settings.disabled') }}
        </label>
      </div>
    </div>
    <div
      v-if="userLanguage"
      class="settings__item"
    >
      <h4>{{ $t('management.user-info.settings.language') }}</h4>
      <div
        class="verified"
      >
        <label
          class="verified-true_lang"
        >
          {{ userLanguage }}
        </label>
      </div>
    </div>
    <div class="settings__item">
      <h4>{{ $t('management.user-info.settings.BTTToken') }}</h4>
      <div
        class="verified"
      >
        <label
          v-if="userData.payFeeBTT === true"
          class="verified-true"
        >
          {{ $t('management.user-info.settings.enabled') }}
        </label>
        <label
          v-if="userData.payFeeBTT === false"
          class="verified-false"
        >
          {{ $t('management.user-info.settings.disabled') }}
        </label>
      </div>
    </div>
    <div class="settings__item">
      <h4>{{ $t('management.user-info.settings.phoneVerification') }}</h4>
      <div
        class="verified"
      >
        <label
          v-if="userData.settings.phoneValidated === true"
          class="verified-true"
        >
          {{ $t('management.user-info.settings.verified') }}
        </label>
        <label
          v-if="userData.settings.phoneValidated === false"
          class="verified-false"
        >
          {{ $t('management.user-info.settings.unverified') }}
        </label>
      </div>
    </div>
    <div class="settings__item">
      <h4>{{ $t('management.user-info.settings.KYCVerification') }}</h4>
      <div
        class="verified"
      >
        <label
          v-if="userData.KYCStatus !== null"
          class="verified-true"
        >
          {{ $t('management.user-info.settings.verified') }}
        </label>
        <label
          v-else
          class="verified-false"
        >
          {{ $t('management.user-info.settings.unverified') }}
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Settings',
  computed: {
    ...mapGetters({
      userData: 'management/userData',
    }),
    // eslint-disable-next-line vue/return-in-computed-property
    userLanguage() {
      if (this.userData.language === 'EN' || this.userData.language === 'en') {
        return 'English';
      } if (this.userData.language === 'RU' || this.userData.language === 'ru') {
        return 'Russian';
      }
    },
  },
};
</script>

<style scoped lang="scss">
.verified {
  display: flex;
  justify-content: center;
  label {
    text-align: center;
    width: auto;
    padding: 5px 10px;
    display: flex;
    justify-content: center;
    border-radius: 82px;
    font-size: 14px;
    margin: 0;
  }
  &-true {
    background: rgba(66, 184, 131, 0.2);
    color: #42B883;
  }
  &-true_lang {
    background: rgba(29, 140, 248, 0.2);
    color: #1D8CF8;
  }
  &-false {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
}
.settings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px,1fr));
  grid-gap: 20px;
  &__items {

  }
  &__item {
    height: 77px;
    background-color: #2E3044;
    padding: 0 25px 0 25px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h4 {
      margin: 0;
    }
  }
}
</style>
