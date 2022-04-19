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
      id="currencyPairAddModal"
      :show.sync="PairEdit"
      class="modal-black modal show"
      :centered="false"
      :show-close="true"
      :modal-classes="'modal-md fix-height'"
      @close="closeModal"
    >
      <h4
        slot="header"
        class="card-title"
      >
        {{ $t('currencyPairsManagement.currencyPairsEdit.title') }} : {{ name }}
      </h4>
      <form @submit.prevent>
        <div class="pair-add-modal">
          <div class="pair-add-modal_item">
            <base-input
              v-model.trim="model.fullname"
              v-validate="'required|max:80|min:5'"
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
              v-validate="'required|max:80|min:10'"
              :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.description')"
              maxlength="80"
              :label="$t('currencyPairsManagement.currencyPairsAddModal.description')"
              name="description"
              :error="getError('description')"
            />
          </div>
          <div class="pair-add-modal_item">
            <base-input
              v-model.trim.number="model.takerFee"
              v-validate="'required|decimal|min_value:0|max_value:100'"
              type="number"
              :label="$t('currencyPairsManagement.currencyPairsAddModal.takerFee')"
              :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.takerFee')"
              style="margin-right: 15px"
              maxlength="60"
              name="takerFee"
              :error="getError('takerFee')"
            />
            <base-input
              v-model.trim.number="model.makerFee"
              v-validate="'required|decimal|min_value:0|max_value:100'"
              type="number"
              :label="$t('currencyPairsManagement.currencyPairsAddModal.makerFee')"
              :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.makerFee')"
              maxlength="60"
              name="makerFee"
              :error="getError('makerFee')"
            />
          </div>
          <div class="pair-add-modal_item">
            <base-input
              v-model.trim.number="model.priceMin"
              v-validate="'required|decimal|min_value:0|max_value:10000'"
              type="number"
              :label="$t('currencyPairsManagement.currencyPairsAddModal.priceMin')"
              :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.priceMin')"
              maxlength="60"
              name="priceMin"
              :error="getError('priceMin')"
            />
            <base-input
              v-model.trim.number="model.priceMax"
              v-validate="'required|decimal|min_value:0|max_value:10000'"
              type="number"
              :label="$t('currencyPairsManagement.currencyPairsAddModal.priceMax')"
              :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.priceMax')"
              style="margin: 0 15px"
              maxlength="60"
              name="priceMax"
              :error="getError('priceMax')"
            />
            <base-input
              v-model.trim.number="model.priceTick"
              v-validate="'required|decimal|min_value:0|max_value:10000'"
              type="number"
              :label="$t('currencyPairsManagement.currencyPairsAddModal.priceTick')"
              :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.priceTick')"
              maxlength="60"
              name="priceTick"
              :error="getError('priceTick')"
            />
          </div>
          <div class="pair-add-modal_item">
            <base-input
              v-model.trim.number="model.lotSizeMin"
              v-validate="'required|decimal|min_value:0|max_value:10000'"
              type="number"
              :label="$t('currencyPairsManagement.currencyPairsAddModal.lotSizeMin')"
              :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.lotSizeMin')"
              maxlength="60"
              name="lotSizeMin"
              :error="getError('lotSizeMin')"
            />
            <base-input
              v-model.trim.number="model.lotSizeMax"
              v-validate="'required|decimal|min_value:0|max_value:10000'"
              type="number"
              :label="$t('currencyPairsManagement.currencyPairsAddModal.lotSizeMax')"
              :placeholder="$t('currencyPairsManagement.currencyPairsAddModal.lotSizeMax')"
              style="margin: 0 15px"
              maxlength="60"
              name="lotSizeMax"
              :error="getError('lotSizeMax')"
            />
            <base-input
              v-model.trim.number="model.lotSizeTick"
              v-validate="'required|decimal|min_value:0|max_value:10000'"
              type="number"
              :label="$t('currencyPairsManagement.currencyPairsAddModal.lotSizeTick')"
              maxlength="60"
              name="lotSizeTick"
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
            @click="editPair"
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
  name: 'PackageEdit',
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
      PairEdit: false,
      model: {
        fullname: '',
        description: '',
        id: '',
        takerFee: '',
        makerFee: '',
        priceMin: '',
        priceMax: '',
        priceTick: '',
        lotSizeMin: '',
        lotSizeMax: '',
        lotSizeTick: '',
        status: 1,
      },
      name: '',
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
      this.name = this.item.name;
      this.model.id = this.item.id;
      this.model.takerFee = this.item.takerFee;
      this.model.makerFee = this.item.makerFee;
      this.model.fullname = this.item.fullName;
      this.model.description = this.item.description;
      if (this.item.settings) {
        this.model.priceMin = this.item.settings.lot_size_max;
        this.model.priceMax = this.item.settings.lot_size_min;
        this.model.priceTick = this.item.settings.lot_size_tick;
        this.model.lotSizeMin = this.item.settings.price_max;
        this.model.lotSizeMax = this.item.settings.price_min;
        this.model.lotSizeTick = this.item.settings.price_tick;
      }
      this.PairEdit = true;
      await this.$validator.errors.clear();
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async closeModal() {
      this.PairEdit = false;
      this.cryptoCurrencies = [];
      this.model.id = '';
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
      this.name = '';
      await this.$validator.errors.clear();
    },
    async editPair() {
      const isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        try {
          const response = await this.$api.editPair(this.model);
          this.$emit('updatePackage', this.model);
          this.name = '';
          this.model.id = '';
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
          this.PairEdit = false;
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
    padding: 15px 10px;
    i {
      font-size: 25px !important;
      padding: 0 !important;
    }
  }
}
.col {
  button {
    margin: 0;
    border-radius: 0.25rem;
  }
}
</style>
