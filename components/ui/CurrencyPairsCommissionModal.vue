<template>
  <div class="add-modal">
    <base-button
      id="add-withdrawal"
      type="primary"
      icon
      class="btn"
      data-toggle="modal"
      data-target="#addWithdrawal"
      @click="WithdrawalAddModalVisible = true"
    >
      <i class="tim-icons icon-settings-gear-63" />
    </base-button>
    <modal
      id="addWithdrawal"
      :show.sync="WithdrawalAddModalVisible"
      class="modal-black modal show"
      :centered="false"
      :show-close="true"
      :modal-classes="'modal-lg'"
    >
      <h4
        slot="header"
        class="card-title"
      >
        {{ $t('currencyPairsManagement.commissionModal.titleFixFee') }}
      </h4>
      <form @submit.prevent>
        <!--        <el-select-->
        <!--          v-model="selects.simple"-->
        <!--          class="select-primary"-->
        <!--          size="large"-->
        <!--          :placeholder="$t('currencyPairsManagement.commissionModal.currencyPair')"-->
        <!--        >-->
        <!--          <el-option-->
        <!--            v-for="option in selects.role"-->
        <!--            :key="option.label"-->
        <!--            class="select-primary"-->
        <!--            :value="option.value"-->
        <!--            :label="option.label"-->
        <!--            @click="model.role = option.value"-->
        <!--          />-->
        <!--        </el-select>-->
        <div
          class="commission-volume"
        >
          <div class="commission-fix-content-inputs">
            <base-input
              class="commission-fix__input"
              :placeholder="$t('currencyPairsManagement.commissionModal.fix.makerFee')"
            />
            <base-input
              class="commission-fix__input"
              :placeholder="$t('currencyPairsManagement.commissionModal.fix.takerFee')"
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
          >
            {{ $t('currencyManagement.currencyAddModal.addButton') }}
          </base-button>
        </div>
      </form>
    </modal>
  </div>
</template>

<script>
import { BaseRadio, Modal } from '@/components';
import { Option, Select } from 'element-ui';

export default {
  name: 'CurrencyPairsCommissionModal',
  components: {
    Modal,
    BaseRadio,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  data() {
    return {
      WithdrawalAddModalVisible: false,
      radios: 'fixCommission',
      currentModal: 'fixCommission',
      inputsCount: 1,
      rows: [],
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
    radios(val) {
      this.currentModal = val;
    },
  },
  methods: {
    addNewInputs(index) {
      const inputs = {
        from: '',
        to: '',
        makerFee: '',
        takerFee: '',
      };
      this.rows.push(inputs);
    },
    deleteInputs(index) {
      this.rows.splice(index, 1);
      // eslint-disable-next-line no-plusplus
      this.inputsCount--;
    },
  },
};
</script>

<style scoped lang="scss">
.commission-fix {
  display: flex;
  flex-wrap: wrap;
  &-content {
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
    flex-direction: column;
    &-inputs {
      display: flex;
      justify-content: center;
      width: 100%;
      h4 {
        margin-bottom: 20px;
        padding: 0 5px;
        &:nth-child(1) {
          padding: 0 5px 0 0;
        }
      }
      button {
        margin: 0 0 20px 5px;
      }
    }
    &-leftside {
      display: flex;
      align-items: center;
      width: 80%;
      &__input {
        display: flex;
        width: 100%;
      }
    }
    &-rightside {
      display: flex;
      align-items: center;
      width: 100%;
      &__input {
        display: flex;
      }
    }
  }
  .break-line {
    margin: 0 15px;
    padding: 0;
    width: 1px;
    height: 40px;
    background: #2B3553;
  }
  &__input {
    margin-bottom: 20px;
    width: 100%;
    padding: 0 5px;
  }
}
.checkboxes {
  display: flex;
  .form-check {
    margin-top: 0;
    margin-bottom: 15px;
    &:nth-child(1) {
      margin-right: 10%;
    }
  }
}
.select-primary {
  width: 100%;
  margin-bottom: 20px;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.admin-add-modal-button {
  width: 100%;
}
btn {
  margin: 0;
}
.add-modal {
  display: flex;
  justify-content: flex-end;
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
@media (max-width: 992px) {
  .commission-fix {
    &-content {
      display: flex;
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
      flex-direction: column;
      &-inputs {
        display: flex;
        justify-content: center;
        width: 100%;
        margin-bottom: 10px;
        h4 {
          margin-bottom: 0;
          padding: 0 0px;
          &:nth-child(1) {
            padding: 0 0px 0 0;
          }
        }
        button {
          margin: 0 0 0px 0px;
        }
      }
      &-leftside {
        width: 40%;
        flex-direction: column;
        display: flex;
        &__input {
          display: flex;
        }
      }
      &-rightside {
        width: 60%;
        display: flex;
        &__input {
          display: flex;
          flex-direction: column;
          &:nth-child(1) {
            margin-bottom: 0px;
          }
        }
      }
    }
    .break-line {
      margin: 0 15px;
      padding: 0;
      width: 1px;
      height: 100%;
      background: #2B3553;
    }
    &__input {
      margin-bottom: 0;
      width: 100%;
      padding: 0 5px;
    }
  }
}
@media (max-width: 380px) {
  .card-title {
    width: 200px;
    margin-bottom: 0;
  }
}
</style>
