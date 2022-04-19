<template>
  <div class="add-modal">
    <base-button
      id="add-withdrawal"
      class="btn"
      data-toggle="modal"
      type="primary"
      icon
      data-target="#addWithdrawal"
      @click="openModal()"
    >
      <i class="tim-icons icon-settings-gear-63" />
    </base-button>
    <modal
      id="CurrencyEdit"
      :show.sync="CurrencyEdit"
      class="modal-black modal show"
      :centered="false"
      :show-close="true"
      :modal-classes="'modal-lg fix-height'"
      @close="closeModal"
    >
      <h4
        slot="header"
        class="card-title"
      >
        {{ $t('currencyManagement.currencyAddModal.editTitle') }} : {{ symbol }}
      </h4>
      <form @submit.prevent>
        <div class="add-modal">
          <div class="add-modal_item">
            <base-input
              v-model.trim="model.fullname"
              v-validate="'required|max:80|min:5'"
              :placeholder="$t('currencyManagement.currencyAddModal.fullName')"
              maxlength="80"
              name="fullname"
              :label="$t('currencyManagement.currencyAddModal.fullName')"
              :error="getError('fullname')"
            />
            <base-input
              v-model.trim="model.description"
              v-validate="'required|max:80|min:10'"
              :placeholder="$t('currencyManagement.currencyAddModal.description')"
              maxlength="80"
              style="margin-left: 15px"
              name="description"
              :label="$t('currencyManagement.currencyAddModal.description')"
              :error="getError('description')"
            />
          </div>
          <div class="add-modal_item">
            <base-input
              v-model.trim="model.logoURL"
              v-validate="'required|max:240|min:10|url'"
              :placeholder="$t('currencyManagement.currencyAddModal.logoURL')"
              maxlength="240"
              name="logoURL"
              :label="$t('currencyManagement.currencyAddModal.logoURL')"
              :error="getError('logoURL')"
            />
            <base-input
              v-model.trim="model.address"
              v-validate="'required|max:240|min:10|url'"
              :placeholder="$t('currencyManagement.currencyAddModal.address')"
              maxlength="120"
              :label="$t('currencyManagement.currencyAddModal.address')"
              name="address"
              style="margin-left: 15px"
              :error="getError('address')"
            />
          </div>
          <div class="add-modal_item">
            <base-input
              v-model.trim.number="model.maxWithdraw"
              v-validate="'required|max_value:10000|decimal'"
              type="number"
              :label="$t('currencyManagement.currencyAddModal.maxWithdraw')"
              :placeholder="$t('currencyManagement.currencyAddModal.maxWithdraw')"
              maxlength="60"
              style="margin-right: 15px"
              name="maxWithdraw"
              :error="getError('maxWithdraw')"
            />
            <base-input
              v-model.trim.number="model.minWithdraw"
              v-validate="'required|max_value:10000|decimal'"
              type="number"
              :label="$t('currencyManagement.currencyAddModal.minWithdraw')"
              :placeholder="$t('currencyManagement.currencyAddModal.minWithdraw')"
              maxlength="60"
              name="minWithdraw"
              :error="getError('minWithdraw')"
            />
          </div>
          <div class="add-modal_item">
            <base-input
              v-model.trim.number="model.withdrawCommissionFixed"
              v-validate="'required|max_value:99999999999999|decimal'"
              type="number"
              :label="$t('currencyManagement.currencyAddModal.withdrawCommissionFixed')"
              :placeholder="$t('currencyManagement.currencyAddModal.withdrawCommissionFixed')"
              maxlength="60"
              name="withdrawCommissionFixed"
              :error="getError('withdrawCommissionFixed')"
              style="margin-right: 15px"
            />
            <base-input
              v-model.trim.number="model.withdrawCommissionPercentage"
              v-validate="'required|max_value:100|decimal'"
              type="number"
              :label="$t('currencyManagement.currencyAddModal.withdrawCommissionPercentage')"
              :placeholder="$t('currencyManagement.currencyAddModal.withdrawCommissionPercentage')"
              maxlength="60"
              name="withdrawCommissionPercentage"
              :error="getError('withdrawCommissionPercentage')"
            />
          </div>
        </div>
        <div class="btns">
          <base-button
            class="btn"
            type="primary"
            @click="closeModal"
          >
            {{ $t('currencyManagement.currencyAddModal.closeButton') }}
          </base-button>
          <base-button
            class="btn"
            type="primary"
            @click="currencyEditing"
          >
            {{ $t('currencyManagement.currencyAddModal.editButton') }}
          </base-button>
        </div>
      </form>
    </modal>
  </div>
</template>

<script>
import { Modal } from '@/components';
import { Option, Select } from 'element-ui';
import login from '~/pages/login';

export default {
  name: 'CurrencyEdit',
  components: {
    Modal,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  props: {
    item: {
      type: Object,
    },
  },
  data() {
    return {
      CurrencyEdit: false,
      model: {
        description: '',
        fullname: '',
        currencyId: '',
        logoURL: '',
        address: '',
        maxWithdraw: '',
        minWithdraw: '',
        withdrawCommissionFixed: '',
        withdrawCommissionPercentage: '',
      },
      symbol: '',
    };
  },
  watch: {
    show(val) {
      const documentClasses = document.body.classList;
      if (val) {
        documentClasses.add('modal-open');
        this.$nextTick(this.scrollModalToBottom);
      } else {
        documentClasses.remove('modal-open');
      }
    },
  },
  methods: {
    async openModal() {
      this.model.description = this.item.description;
      this.model.fullname = this.item.title;
      this.symbol = this.item.symbol;
      this.model.currencyId = this.item.id;
      this.model.logoURL = this.item.logoURL;
      // this.model.decimals = '';
      this.model.address = this.item.address;
      // this.model.blockChain = '';
      // this.model.type = '';
      this.model.maxWithdraw = this.item.txLimits.maxWithdraw;
      this.model.minWithdraw = this.item.txLimits.minWithdraw;
      this.model.withdrawCommissionFixed = this.item.txLimits.withdrawCommissionFixed;
      this.model.withdrawCommissionPercentage = this.item.txLimits.withdrawCommissionPercentage;
      this.CurrencyEdit = true;
      await this.$validator.errors.clear();
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async closeModal() {
      this.CurrencyEdit = false;
      this.model.description = '';
      this.model.fullname = '';
      this.symbol = '';
      this.model.currencyId = '';
      this.model.logoURL = '';
      this.model.address = '';
      this.model.maxWithdraw = '';
      this.model.minWithdraw = '';
      this.model.withdrawCommissionFixed = '';
      this.model.withdrawCommissionPercentage = '';
      await this.$validator.errors.clear();
    },
    async currencyEditing() {
      const isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        try {
          const response = await this.$api.currencyEdit(this.model);
          this.$emit('updateCurrency', this.model);
          this.model.description = '';
          this.model.fullname = '';
          this.model.currencyId = '';
          this.symbol = '';
          this.model.logoURL = '';
          this.model.address = '';
          this.model.maxWithdraw = '';
          this.model.minWithdraw = '';
          this.model.withdrawCommissionFixed = '';
          this.model.withdrawCommissionPercentage = '';
          this.CurrencyEdit = false;
          this.$notify({
            type: 'success',
            message: this.$t('management.completed'),
            icon: 'tim-icons icon-check-2',
          });
        } catch (e) {
          this.$notify({
            type: 'danger',
            message: e.response.data.message,
            icon: 'tim-icons icon-alert-circle-exc',
          });
        }
      }
    },
  },
};
</script>
<style lang="scss">
.fix-height {
  margin-top: 5%;
  transform: translate(0, 0) !important;
}
</style>
<style scoped lang="scss">
.input {
  margin-bottom: 20px;
}
.btns {
  display: flex;
  justify-content: space-between;
}
btn {
  margin: 0;
}
.add-modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  &_item {
    display: flex;
    margin-bottom: 20px;
  }
  button {
    margin: 0;
    padding: 15px 10px;
    i {
      font-size: 25px !important;
      padding: 0 !important;
    }
  }
  img {
    margin-right: 5px;
  }
}
.form-group {
  margin: 0;
  width: 100%;
}
.btns {
  display: flex;
  justify-content: space-between;
}
.col {
  button {
    margin: 0;
    border-radius: 0.25rem;
  }
}
</style>
