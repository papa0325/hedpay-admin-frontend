<template>
  <div class="add-modal">
    <base-button
      id="currency-pair-add-modal"
      class="btn"
      type="primary"
      data-toggle="modal"
      data-target="#currencyPairAddModal"
      @click="getAllCurrencies()"
    >
      Add currency
    </base-button>
    <modal
      id="currencyPairAddModal"
      :show.sync="CurrencyPairAddModalVisible"
      class="modal-black modal show"
      :centered="false"
      :show-close="true"
      :modal-classes="'modal-md fix-height'"
      @close="closeModal"
    >
      <b-overlay
        :show="busyTable"
        rounded
        opacity="0.6"
        spinner-small
        spinner-variant="primary"
        class="d-inline-block table-busy"
      >
        <h4
          slot="header"
          class="card-title"
        >
          {{ $t('currencyPairsManagement.currencyPairsAddModal.title') }}
        </h4>
        <form @submit.prevent>
          <div class="pair-add-modal">
            <div class="pair-add-modal_item">
              <el-select
                v-model="model.baseAssetId"
                class="select-primary pagination-select"
                placeholder="Crypto"
              >
                <el-option
                  v-for="item in cryptoCurrencies"
                  :key="item.id + '_crypto'"
                  class="select-primary"
                  :label="item.symbol"
                  :value="item.id"
                />
              </el-select>
              <base-button
                type="info"
                icon
                class="btn"
                @click="currencySwitch()"
              >
                <img
                  src="/img/icons/Union.svg"
                  alt=""
                >
              </base-button>
              <el-select
                v-model="model.quoteAssetId"
                class="select-primary pagination-select"
                placeholder="Fiat/Crypto"
              >
                <el-option
                  v-for="item in allCurrencies"
                  :key="item.id + '_all'"
                  class="select-primary"
                  :label="item.symbol"
                  :value="item.id"
                />
              </el-select>
            </div>
            <div class="pair-add-modal_item">
              <base-input
                v-model.trim="model.fullname"
                v-validate="'required|max:80|min:5|alpha_spaces|latin'"
                :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.fullName')"
                maxlength="80"
                name="fullname"
                :label="$t('currencyPairsManagement.currencyPairsAddModal.fullName')"
                :error="getError('fullname')"
              />
            </div>
            <div class="pair-add-modal_item">
              <base-input
                v-model.trim="model.description"
                v-validate="'required|max:80|min:10|alpha_num_latin'"
                :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.description')"
                maxlength="80"
                name="description"
                :label="$t('currencyPairsManagement.currencyPairsAddModal.description')"
                :error="getError('description')"
              />
            </div>
            <div class="pair-add-modal_item">
              <base-input
                v-model.trim.number="model.takerFee"
                v-validate="'required|decimal|min_value:0|max_value:100'"
                type="number"
                :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.takerFee')"
                style="margin-right: 15px"
                maxlength="60"
                name="takerFee"
                :label="$t('currencyPairsManagement.currencyPairsAddModal.takerFee')"
                :error="getError('takerFee')"
              />
              <base-input
                v-model.trim.number="model.makerFee"
                v-validate="'required|decimal|min_value:0|max_value:100'"
                type="number"
                :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.makerFee')"
                maxlength="60"
                name="makerFee"
                :label="$t('currencyPairsManagement.currencyPairsAddModal.makerFee')"
                :error="getError('makerFee')"
              />
            </div>
            <div class="pair-add-modal_item">
              <base-input
                v-model.trim.number="model.priceMin"
                v-validate="'required|decimal|min_value:0|max_value:10000'"
                type="number"
                :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.priceMin')"
                maxlength="60"
                name="priceMin"
                :label="$t('currencyPairsManagement.currencyPairsAddModal.priceMin')"
                :error="getError('priceMin')"
              />
              <base-input
                v-model.trim.number="model.priceMax"
                v-validate="'required|decimal|min_value:0|max_value:10000'"
                type="number"
                :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.priceMax')"
                style="margin: 0 15px"
                maxlength="60"
                name="priceMax"
                :label="$t('currencyPairsManagement.currencyPairsAddModal.priceMax')"
                :error="getError('priceMax')"
              />
              <base-input
                v-model.trim.number="model.priceTick"
                v-validate="'required|decimal|min_value:0|max_value:10000'"
                type="number"
                :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.priceTick')"
                maxlength="60"
                name="priceTick"
                :label="$t('currencyPairsManagement.currencyPairsAddModal.priceTick')"
                :error="getError('priceTick')"
              />
            </div>
            <div class="pair-add-modal_item">
              <base-input
                v-model.trim.number="model.lotSizeMin"
                v-validate="'required|decimal|min_value:0|max_value:10000'"
                type="number"
                :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.lotSizeMin')"
                maxlength="60"
                name="lotSizeMin"
                :label="$t('currencyPairsManagement.currencyPairsAddModal.lotSizeMin')"
                :error="getError('lotSizeMin')"
              />
              <base-input
                v-model.trim.number="model.lotSizeMax"
                v-validate="'required|decimal|min_value:0|max_value:10000'"
                type="number"
                :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.lotSizeMax')"
                style="margin: 0 15px"
                maxlength="60"
                name="lotSizeMax"
                :label="$t('currencyPairsManagement.currencyPairsAddModal.lotSizeMax')"
                :error="getError('lotSizeMax')"
              />
              <base-input
                v-model.trim.number="model.lotSizeTick"
                v-validate="'required|decimal|min_value:0|max_value:10000'"
                type="number"
                maxlength="60"
                name="lotSizeTick"
                :label="$t('currencyPairsManagement.currencyPairsAddModal.lotSizeTick')"
                :error="getError('lotSizeTick')"
                :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.lotSizeTick')"
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
              @click="addPair"
            >
              {{ $t('currencyManagement.currencyAddModal.addButton') }}
            </base-button>
          </div>
        </form>
      </b-overlay>
    </modal>
  </div>
</template>

<script>
import { Modal } from '@/components';
import { Option, Select } from 'element-ui';
import login from '~/pages/login';

export default {
  name: 'CurrencyPairAddModal',
  components: {
    Modal,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  data() {
    return {
      CurrencyPairAddModalVisible: false,
      busyTable: true,
      model: {
        baseAssetId: '',
        quoteAssetId: '',
        fullname: '',
        description: '',
        takerFee: '',
        makerFee: '',
        priceMin: '',
        priceMax: '',
        priceTick: '',
        lotSizeMin: '',
        lotSizeMax: '',
        lotSizeTick: '',
        name: '',
      },
      currencies: ['usd', 'btc', 'eth'],
      allCurrencies: [],
      cryptoCurrencies: [],
      noFiat: false,
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
    async getAllCurrencies() {
      this.CurrencyPairAddModalVisible = true;
      await this.$validator.errors.clear();
      this.busyTable = true;
      try {
        const response = await this.$api.getAllCurrencies();
        response.result.data.map((item) => {
          item.symbol = item.symbol.toUpperCase();
          if (item.type === 'crypto') {
            this.cryptoCurrencies.push(item);
          }
          return item;
        });
        this.allCurrencies = [...response.result.data];
        this.busyTable = false;
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
      this.busyTable = false;
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async closeModal() {
      this.CurrencyPairAddModalVisible = false;
      this.cryptoCurrencies = [];
      this.model.baseAssetId = '';
      this.model.quoteAssetId = '';
      this.model.fullname = '';
      this.model.description = '';
      this.model.takerFee = '';
      this.model.makerFee = '';
      this.model.priceMin = '';
      this.model.priceMax = '';
      this.model.priceTick = '';
      this.model.lotSizeMin = '';
      this.model.lotSizeMax = '';
      this.model.lotSizeTick = '';
      this.model.name = '';
      await this.$validator.errors.clear();
    },
    async currencySwitch() {
      if (this.model.quoteAssetId && this.model.baseAssetId) {
        await this.cryptoCurrencies.map((item) => {
          if (item.id === this.model.quoteAssetId && !this.noFiat) {
            this.noFiat = true;
          }
          return item;
        });
        if (this.noFiat) {
          const a = this.model.baseAssetId;
          this.model.baseAssetId = this.model.quoteAssetId;
          this.model.quoteAssetId = a;
          this.noFiat = false;
        } else {
          this.$notify({
            type: 'danger',
            message: this.$t('currencyPairsManagement.currencyPairsAddModal.noFiat'),
            icon: 'tim-icons icon-alert-circle-exc',
          });
        }
      }
    },
    async addPair() {
      const isValidForm = await this.$validator.validateAll();
      if (this.model.quoteAssetId && this.model.baseAssetId) {
        if (isValidForm) {
          try {
            if (this.model.baseAssetId !== this.model.quoteAssetId) {
              let firstCurr = '';
              let secondCurr = '';
              await this.allCurrencies.map((item) => {
                if (item.id === this.model.baseAssetId && !firstCurr) {
                  firstCurr = item.symbol;
                }
                if (item.id === this.model.quoteAssetId && !secondCurr) {
                  secondCurr = item.symbol;
                }
                return item;
              });
              this.model.name = `${firstCurr}_${secondCurr}`.toLowerCase();
              const response = await this.$api.addPair(this.model);
              this.cryptoCurrencies = [];
              this.model.baseAssetId = '';
              this.model.quoteAssetId = '';
              this.model.fullname = '';
              this.model.name = '';
              this.model.description = '';
              this.model.takerFee = '';
              this.model.makerFee = '';
              this.model.priceMin = '';
              this.model.priceMax = '';
              this.model.priceTick = '';
              this.model.lotSizeMin = '';
              this.model.lotSizeMax = '';
              this.model.lotSizeTick = '';
              this.CurrencyPairAddModalVisible = false;
              this.$notify({
                type: 'success',
                message: this.$t('management.completed'),
                icon: 'tim-icons icon-check-2',
              });
            } else {
              this.$notify({
                type: 'danger',
                message: this.$t('currencyPairsManagement.currencyPairsAddModal.sameCurrencies'),
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
      } else {
        this.$notify({
          type: 'danger',
          message: this.$t('currencyPairsManagement.currencyPairsAddModal.selectCurrencies'),
          icon: 'tim-icons icon-alert-circle-exc',
        });
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
.table-busy {
  width: 100%;
  height: 100%;
  .bg-light {
    background-color: transparentize($color: #31334B, $amount: 0.2) !important;
  }
}
</style>
<style scoped lang="scss">
  .pair-add-modal {
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
  }
  .form-group {
    margin: 0;
    width: 100%;
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
    justify-content: flex-end;
    margin-top: 0;
    img {
      margin-right: 5px;
    }
    button {
      margin: 0;
      height: 38px;
    }
  }
  .col {
    button {
      margin: 0;
      border-radius: 0.25rem;
    }
  }
</style>
