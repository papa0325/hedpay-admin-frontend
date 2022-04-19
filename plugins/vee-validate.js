import Vue from 'vue';

import {
  ValidationProvider,
  ValidationObserver,
  extend, configure,
} from 'vee-validate';

import {
  required, email, length, numeric, confirmed, max, min_value, max_value,
} from 'vee-validate/dist/rules';

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
export default ({ app }) => {
  configure({
    // this will be used to generate messages.
    defaultMessage: (_field, values) => app.i18n.t(`messages.${values._rule_}`, values),
  });
  extend('required', required);

  extend('email', email);

  extend('length', {
    ...length,
  });

  extend('numeric', {
    ...numeric,
  });

  extend('confirmed', {
    ...confirmed,
  });

  extend('max', {
    ...max,
    // eslint-disable-next-line consistent-return
    validate(value, [maxValue]) {
      if (value.length > Number(maxValue)) return false;
    },
  });
  // eslint-disable-next-line no-unused-expressions
  extend('min_value', {
    ...min_value,
    message: 'The value must be greater than {min}',
    // eslint-disable-next-line no-sequences
  }),
  extend('max_value', {
    ...max_value,
    message: 'The value must be less than {max}',
  }),
  extend('password', {
    ...required,
    validate(value) {
      const regExp = /^.*(?=.{6,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;

      return regExp.test(value);
    },
  });
};
