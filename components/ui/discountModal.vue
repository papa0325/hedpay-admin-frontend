<template>
  <div class="add-modal">
    <base-button
      id="add-withdrawal"
      type="primary"
      class="btn discount-btn"
      data-toggle="modal"
      data-target="#addWithdrawal"
      @click="setDiscounts(), discountModalVisible = true;"
    >
      {{ $t('currencyPairsManagement.commissionModal.discount') }}
    </base-button>
    <modal
      id="addWithdrawal"
      :show.sync="discountModalVisible"
      class="modal-black modal show"
      :centered="false"
      :show-close="true"
      :modal-classes="'modal-lg fix-height'"
    >
      <h4
        slot="header"
        class="card-title"
      >
        {{ $t('currencyPairsManagement.commissionModal.titleDiscount') }}
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
          class="commission-fix"
        >
          <b-overlay
            :show="busyDiscounts"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block discounts-busy"
          >
            <div
              v-if="!rows.length && !busyDiscounts"
              class="commission-fix_null"
            >
              {{ $t('main.noDataCards') }}
            </div>
            <div
              v-for="(row, index) in rows"
              :key="index"
              class="commission-fix-content-inputs"
            >
              <div class="commission-fix__content">
                <div class="commission-fix__content__left">
                  <div class="commission-fix__content__left-left">
                    <h4>{{ $t('currencyPairsManagement.commissionModal.volume.from') }}</h4>
                    <base-input
                      v-model.trim.number="row.bttAmount"
                      type="number"
                      class="commission-fix__input off-thick"
                      :placeholder="$t('currencyPairsManagement.commissionModal.volume.bttBalance')"
                      :disabled="!row.new"
                    />
                  </div>
                </div>
                <div class="col-auto break-line" />
                <div class="commission-fix__content__right">
                  <div class="commission-fix__content__right-left">
                    <base-input
                      v-model.trim.number="row.discount"
                      type="number"
                      class="commission-fix__input off-thick"
                      placeholder="%"
                    />
                  </div>
                  <div class="commission-fix__content__right-right">
                    <base-button
                      v-if="rows.length > index - 1"
                      type="info"
                      icon
                      class="btn"
                      @click="addDiscount(row, index)"
                    >
                      <div class="tick" />
                    </base-button>
                    <base-button
                      type="danger"
                      icon
                      class="btn"
                      @click="deleteInputs(row, index)"
                    >
                      <img
                        src="/img/icons/trash.svg"
                        alt=""
                      >
                    </base-button>
                  </div>
                </div>
              </div>
            </div>
          </b-overlay>
        </div>
        <div class="btns">
          <base-button
            class="btn"
            type="primary"
            @click="addNewInputs"
          >
            <img
              src="/img/icons/plus.svg"
              alt=""
              style="margin-right: 5px"
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
  name: 'DiscountModal',
  components: {
    Modal,
    BaseRadio,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  data() {
    return {
      discountModalVisible: false,
      inputsCount: 1,
      rows: [],
      busyDiscounts: false,
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
  async mounted() {
    // await this.setDiscounts();
  },
  methods: {
    async setDiscounts() {
      this.busyDiscounts = true;
      try {
        const response = await this.$api.getDiscounts();
        response.data.map((item) => {
          item.new = false;
          return item.new;
        });
        const inputs = {
          bttAmount: '',
          discount: '',
        };
        if (!response.data) {
          this.rows = [];
          await this.rows.push(inputs);
        } else {
          this.rows = response.data;
        }
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
      this.busyDiscounts = false;
    },
    async addDiscount(row, index) {
      try {
        if (row.new) {
          const action = 'I';
          await this.$api.discountAction(row, action);
          this.$notify({
            type: 'success',
            message: this.$t('currencyPairsManagement.added'),
            icon: 'tim-icons icon-check-2',
          });
          row.new = false;
        } else if (!row.new) {
          const action = 'U';
          await this.$api.discountAction(row, action);
          this.$notify({
            type: 'success',
            message: this.$t('currencyPairsManagement.updated'),
            icon: 'tim-icons icon-check-2',
          });
        }
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
    },
    addNewInputs() {
      const inputs = {
        bttAmount: '',
        discount: '',
        new: true,
      };
      this.rows.push(inputs);
    },
    async deleteInputs(row, index) {
      try {
        if (row.new) {
          this.rows.splice(index, 1);
        } else {
          const action = 'D';
          await this.$api.discountAction(row, action);
          this.rows.splice(index, 1);
          this.$notify({
            type: 'success',
            message: this.$t('currencyPairsManagement.deleted'),
            icon: 'tim-icons icon-check-2',
          });
        }
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
    },
  },
};
</script>
<style lang="scss">
.fix-height {
  margin-top: 20%;
  transform: translate(0, 0) !important;
}
.off-thick:after, .off-thick:after {
  display: none;
}
.off-thick{
  .form-control:focus {
    border-color: #E14ECA;
  }
}
.discounts-busy {
  width: 100%;
  height: 100%;
  .bg-light {
    background-color: transparentize($color: #31334B, $amount: 0.2) !important;
  }
}
</style>
<style scoped lang="scss">
  .tick {
    position: relative;
    display: inline-block;
    width: 12px;
    height: 15px;
    margin-bottom: 5px;
  }

  .tick::before {
    position: absolute;
    left: -1px;
    top: 45%;
    height: 50%;
    width: 2px;
    background-color: white;
    content: "";
    transform: translateX(5px) rotate(-45deg);
    transform-origin: left bottom;
  }

  .tick::after {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 100%;
    background-color: white;
    content: "";
    transform: translateX(5px) rotate(-45deg);
    transform-origin: left bottom;
  }
.discount-btn {
padding: 10px !important;
}
.commission-fix {
  display: flex;
  flex-wrap: wrap;
  &_null {
    display: flex;
    justify-content: center;
  }
  &-content {
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
    flex-direction: column;
  }
  &__content {
    align-items: center;
    display: flex;
    width: 100%;
    margin-bottom: 5px;
    &__left {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60%;
      h4 {
        margin: 0;
      }
      &-left {
        display: flex;
        align-items: center;
        width: 100%;
      }
      &-right {
        display: flex;
        align-items: center;
      }
    }
    &__right {
      width: 100%;
      display: flex;
      align-items: center;
      &-left {
        width: 100%;
        display: flex;
      }
      &-right {
        display: flex;
        button {
          margin: 0 5px;
        }
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
    margin-bottom: 0;
    width: 100%;
    padding: 0 5px;
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
      margin-bottom: 15px;
    }
    &__content {
      align-items: center;
      display: flex;
      width: 100%;
      margin-bottom: 5px;
      &__left {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60%;
        flex-direction: column;
        h4 {
          margin: 0;
        }
        &-left {
          display: flex;
          align-items: center;
        }
        &-right {
          display: flex;
          align-items: center;
        }
      }
      &__right {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        &-left {
          display: flex;
          flex-direction: column;
        }
        &-right {
          display: flex;
          align-items: center;
          margin-top: -5px;
          button {
            margin: 0 5px;
          }
        }
      }
    }
    .break-line {
      margin: 0 10px;
      padding: 0;
      width: 1px;
      height: 40px;
      background: #2B3553;
    }
    &__input {
      margin-bottom: 5px;
      width: 100%;
      padding: 0 5px;
    }
  }
  .invalid-sk {
    flex-direction: row !important;
  }
}
@media (max-width: 380px) {
  .card-title {
    width: 200px;
    margin-bottom: 0;
  }
}
</style>
