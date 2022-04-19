import Vue from 'vue';

Vue.mixin({
  methods: {
    SubstrValue(value) {
      return `${value.toString().split('.')[0]}.${value.toString().split('.')[1].substr(0, 5)}`;
    },
  },
});
