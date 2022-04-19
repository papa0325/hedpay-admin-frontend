// Polyfills for js features used in the Dashboard but not supported in some browsers (mainly IE)
import Vue from 'vue';
import './extra/polyfills';
// Notifications plugin. Used on Notifications page
import Notifications from '@/components/NotificationPlugin';
// Validation plugin used to validate forms
import VeeValidate, { extend } from 'vee-validate';
// A plugin file where you could register global components used across the app
import './globalComponents';
// A plugin file where you could register global directives
import './globalDirectives';
// Sidebar on the right. Used as a local plugin in DashboardLayout.vue
import SideBar from '@/components/SidebarPlugin';
// RTL (right to left plugin to support rtl layout). If you don't need support for rtl, remove this plugin

// element ui language configuration
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import { Validator } from 'vee-validate';
import RTLPlugin from './RTLPlugin';

locale.use(lang);

Vue.use(RTLPlugin);
Vue.use(SideBar);
Vue.use(Notifications);
Vue.use(VeeValidate, { fieldsBagName: 'veeFields' });

Validator.extend('latin', {
  getMessage: (field) => `The ${field} may contain only latin alphabetic.`,
  validate: (value) => {
    const regExp = /^([A-Za-z0-9- ]+)$/;
    return regExp.test(value);
  },
});

Validator.extend('alpha_latin', {
  getMessage: (field) => `The ${field} may contain only latin alphabetic.`,
  validate: (value) => {
    const regExp = /^([A-Za-z]+)$/;
    return regExp.test(value);
  },
});

Validator.extend('alpha_num_ru', {
  getMessage: (field) => `The ${field} not valid.`,
  validate: (value) => {
    const regExp = /^([А-Яа-яA-Za-z0-9- ]+)$/;
    return regExp.test(value);
  },
});

Validator.extend('alpha_num_latin', {
  getMessage: (field) => `The ${field} not valid.`,
  validate: (value) => {
    const regExp = /^([A-Za-z0-9- ]+)$/;
    return regExp.test(value);
  },
});

Validator.extend('alpha_num_ru', {
  getMessage: (field) => `The ${field} not valid.`,
  validate: (value) => {
    const regExp = /^([A-Za-zа-яА-Я0-9- ]+)$/;
    return regExp.test(value);
  },
});

Validator.extend('address', {
  getMessage: (field) => `The ${field} may contain only latin alphabetic.`,
  validate: (value) => {
    const regExp = /^([A-Za-z0-9]+)$/;
    return regExp.test(value);
  },
});

Validator.extend('url', {
  getMessage: (field) => `The ${field} not valid.`,
  validate: (value) => {
    const regExp = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
    return regExp.test(value);
  },
});

Validator.extend('password', {
  getMessage: (field) => `The ${field} not valid.`,
  validate(value) {
    const regExp = /^.*(?=.{6,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;

    return regExp.test(value);
  },
});
