<template>
  <div class="add-modal">
    <base-button
      id="currency-add-modal"
      class="btn"
      type="primary"
      data-toggle="modal"
      data-target="#currencyAddModal"
      @click="openAddCurrencyModal"
    >
      <img
        src="/img/icons/plus.svg"
        alt=""
      >
      {{ $t('currencyManagement.addValue') }}
    </base-button>
    <modal
      id="currencyAddModal"
      :show.sync="CurrencyAddModalVisible"
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
        {{ $t('currencyManagement.currencyAddModal.title') }}
      </h4>
      <form @submit.prevent>
        <div class="add-modal">
          <div class="add-modal_item">
            <el-select
              v-model="model.type"
              class="select-primary pagination-select"
              style="padding-right: 15px; width: 100%"
              :placeholder="$t('currencyManagement.currencyAddModal.type')"
            >
              <el-option
                v-for="item in type"
                :key="item.label"
                class="select-primary"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-model="model.blockChain"
              class="select-primary pagination-select"
              style="width: 100%"
              :placeholder="$t('currencyManagement.currencyAddModal.blockChain')"
            >
              <el-option
                v-for="item in blockChain"
                :key="item.label"
                class="select-primary"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="add-modal_item">
            <base-input
              v-model.trim="model.fullname"
              v-validate="'required|max:80|min:5|alpha_spaces|latin'"
              :placeholder="$t('currencyManagement.currencyAddModal.fullName')"
              maxlength="80"
              name="fullname"
              :label="$t('currencyManagement.currencyAddModal.fullName')"
              :error="getError('fullname')"
            />
            <base-input
              v-model.trim="model.description"
              v-validate="'required|max:80|min:10|alpha_num_latin'"
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
              v-model.trim="model.symbol"
              v-validate="'required|alpha|latin|max:10|min:3'"
              :placeholder="$t('currencyManagement.currencyAddModal.ticker')"
              maxlength="10"
              :label="$t('currencyManagement.currencyAddModal.ticker')"
              name="symbol"
              :error="getError('symbol')"
            />
            <base-input
              v-model.trim.number="model.id"
              v-validate="'required|min_value:10000|max_value:32000|numeric'"
              type="number"
              placeholder="ID"
              label="ID"
              maxlength="5"
              style="margin-left:15px"
              name="id"
              :error="getError('id')"
            />
          </div>
          <div class="add-modal_item">
            <base-input
              v-model.trim.number="model.decimals"
              v-validate="'required|min_value:2|max_value:50|numeric'"
              type="number"
              :placeholder="$t('currencyManagement.currencyAddModal.decimals')"
              maxlength="2"
              :label="$t('currencyManagement.currencyAddModal.decimals')"
              name="decimals"
              :error="getError('decimals')"
            />
            <base-input
              v-model.trim.number="model.maxWithdraw"
              v-validate="'required|max_value:10000|decimal'"
              type="number"
              :label="$t('currencyManagement.currencyAddModal.maxWithdraw')"
              :placeholder="$t('currencyManagement.currencyAddModal.maxWithdraw')"
              style="margin: 0 15px"
              maxlength="60"
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
            @click="addCurrency"
          >
            {{ $t('currencyManagement.currencyAddModal.addButton') }}
          </base-button>
        </div>
      </form>
    </modal>
  </div>
</template>

<script>
import { Modal } from '@/components';
import { Option, Select } from 'element-ui';

export default {
  name: 'CurrencyAddModal',
  components: {
    Modal,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  data() {
    return {
      CurrencyAddModalVisible: false,
      model: {
        description: '',
        fullname: '',
        symbol: '',
        id: '',
        logoURL: '',
        isDiscount: 'N',
        decimals: '',
        address: '',
        blockChain: '',
        type: '',
        maxWithdraw: '',
        minWithdraw: '',
        withdrawCommissionFixed: '',
        withdrawCommissionPercentage: '',
      },
      type: [
        { value: 'crypto', label: 'Crypto' },
        { value: 'cryptoasfiat', label: 'Cryptoasfiat' },
      ],
      blockChain: [
        { value: 'Bitcoin', label: 'Bitcoin' },
        { value: 'Litecoin', label: 'Litecoin' },
        { value: 'Ethereum', label: 'Ethereum' },
        { value: 'Omni Layer', label: 'Omni Layer' },
        { value: 'Decimal', label: 'Decimal' },
        { value: 'PRIZM', label: 'PRIZM' },
      ],
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
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async openAddCurrencyModal() {
      this.CurrencyAddModalVisible = true;
      await this.$validator.errors.clear();
    },
    async closeModal() {
      this.CurrencyAddModalVisible = false;
      await this.$validator.errors.clear();
      this.model.description = '';
      this.model.fullname = '';
      this.model.symbol = '';
      this.model.id = '';
      this.model.logoURL = '';
      this.model.isDiscount = 'N';
      this.model.decimals = '';
      this.model.address = '';
      this.model.blockChain = '';
      this.model.type = '';
      this.model.maxWithdraw = '';
      this.model.minWithdraw = '';
      this.model.withdrawCommissionFixed = '';
      this.model.withdrawCommissionPercentage = '';
    },
    async addCurrency() {
      const isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        try {
          if (this.model.blockChain && this.model.type) {
            const response = await this.$api.addCurrency(this.model);
            this.model.description = '';
            this.model.fullname = '';
            this.model.symbol = '';
            this.model.id = '';
            this.model.logoURL = '';
            this.model.isDiscount = 'N';
            this.model.decimals = '';
            this.model.address = '';
            this.model.blockChain = '';
            this.model.type = '';
            this.model.maxWithdraw = '';
            this.model.minWithdraw = '';
            this.model.withdrawCommissionFixed = '';
            this.model.withdrawCommissionPercentage = '';
            this.CurrencyAddModalVisible = false;
            this.$notify({
              type: 'success',
              message: this.$t('management.completed'),
              icon: 'tim-icons icon-check-2',
            });
          } else {
            this.$notify({
              type: 'danger',
              message: this.$t('currencyManagement.currencyAddModal.completeDrop'),
              icon: 'tim-icons icon-alert-circle-exc',
            });
          }
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
      margin: 0 15px;
      height: 40px;
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
