<template>
  <div class="stats-page">
    <card>
      <div class="flex-container head">
        <h4
          slot="header"
          class="card-title"
        >
          Transactions
        </h4>
      </div>
      <div
        class="options-title row"
      >
        <div class="col-6">
          <base-input class="options-title__form">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              placeholder="Date Picker"
              class="options-title__date"
            />
          </base-input>
        </div>
        <div class="col-3">
          <el-select
            v-model="currentCurrency"
            class="select-primary pagination-select"
            :placeholder="$t('statistics.currency')"
            style="width: 100%"
          >
            <el-option
              v-for="item in allCurrencies"
              :key="item.symbol"
              class="select-primary"
              :label="item.symbol"
              :value="item.symbol"
            />
          </el-select>
        </div>
        <div class="col-3 options-title__btn">
          <base-button
            class="btn"
            type="primary"
            @click="getStatistics()"
          >
            {{ $t('statistics.calculate') }}
          </base-button>
        </div>
      </div>
      <div
        class="break-line"
      />
      <div class="row">
        <b-overlay
          :show="busyTable"
          rounded
          opacity="0.6"
          spinner-small
          spinner-variant="primary"
          class="d-inline-block table-busy"
        >
          <div
            v-for="item in statistics"
            :key="item.pair"
            class="cards"
          >
            <div
              v-if="statistics.length"
              class="col-4 cards__item"
            >
              <div class="cards__img">
                <img
                  src="/img/icons/Libra.svg"
                  alt=""
                >
              </div>
              <div class="cards__text">
                <div class="cards__title">
                  {{ $t('statistics.sell') }} ({{ oldModel.currency }})
                </div>
                <div class="cards__description">
                  {{ item.quantity }}
                </div>
              </div>
            </div>
            <div
              v-if="statistics.length"
              class="col-4 cards__item"
            >
              <div class="cards__img">
                <img
                  src="/img/icons/Coin.svg"
                  alt=""
                >
              </div>
              <div class="cards__text">
                <div class="cards__title">
                  {{ $t('statistics.sum') }} ({{ item.pair }})
                </div>
                <div class="cards__description">
                  {{ item.amount }}
                </div>
              </div>
            </div>
            <div
              v-if="statistics.length"
              class="col-4 cards__item"
            >
              <div class="cards__img">
                <img
                  src="/img/icons/Lines.svg"
                  alt=""
                >
              </div>
              <div class="cards__text">
                <div class="cards__title">
                  {{ $t('statistics.middlePrice') }}
                </div>
                <div class="cards__description">
                  {{ item.mean }}
                </div>
              </div>
            </div>
          </div>
        </b-overlay>
      </div>
    </card>
    <card>
      <div class="flex-container head">
        <h4
          slot="header"
          class="card-title"
        >
          Commission profit
        </h4>
      </div>
      <div
        class="options-title row"
      >
        <div class="col-6">
          <base-input class="options-title__form">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              placeholder="Date Picker"
              class="options-title__date"
            />
          </base-input>
        </div>
        <div class="col-3">
          <el-select
            v-model="currentCurrency"
            class="select-primary pagination-select"
            :placeholder="$t('statistics.currency')"
            style="width: 100%"
          >
            <el-option
              v-for="item in allCurrencies"
              :key="item.symbol"
              class="select-primary"
              :label="item.symbol"
              :value="item.symbol"
            />
          </el-select>
        </div>
        <div class="col-3 options-title__btn">
          <base-button
            class="btn"
            type="primary"
            @click="getStatistics()"
          >
            {{ $t('statistics.calculate') }}
          </base-button>
        </div>
      </div>
      <div
        class="break-line"
      />
      <div class="row">
        <b-overlay
          :show="busyTable"
          rounded
          opacity="0.6"
          spinner-small
          spinner-variant="primary"
          class="d-inline-block table-busy"
        >
          <div
            v-for="item in statistics"
            :key="item.pair"
            class="cards"
          >
            <div
              v-if="statistics.length"
              class="col-4 cards__item"
            >
              <div class="cards__img">
                <img
                  src="/img/icons/Libra.svg"
                  alt=""
                >
              </div>
              <div class="cards__text">
                <div class="cards__title">
                  {{ $t('statistics.sell') }} ({{ oldModel.currency }})
                </div>
                <div class="cards__description">
                  {{ item.quantity }}
                </div>
              </div>
            </div>
            <div
              v-if="statistics.length"
              class="col-4 cards__item"
            >
              <div class="cards__img">
                <img
                  src="/img/icons/Coin.svg"
                  alt=""
                >
              </div>
              <div class="cards__text">
                <div class="cards__title">
                  {{ $t('statistics.sum') }} ({{ item.pair }})
                </div>
                <div class="cards__description">
                  {{ item.amount }}
                </div>
              </div>
            </div>
            <div
              v-if="statistics.length"
              class="col-4 cards__item"
            >
              <div class="cards__img">
                <img
                  src="/img/icons/Lines.svg"
                  alt=""
                >
              </div>
              <div class="cards__text">
                <div class="cards__title">
                  {{ $t('statistics.middlePrice') }}
                </div>
                <div class="cards__description">
                  {{ item.mean }}
                </div>
              </div>
            </div>
          </div>
        </b-overlay>
      </div>
    </card>
  </div>
</template>

<script>
import { DatePicker, Option, Select } from 'element-ui';

export default {
  middleware: 'auth',
  name: 'Index',
  components: {
    [DatePicker.name]: DatePicker,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  data() {
    return {
      dateRange: '',
      allCurrencies: '',
      currentCurrency: '',
      busyTable: false,
      oldModel: {
        from: '',
        to: '',
        currency: '',
      },
      statistics: '',
    };
  },
  async mounted() {
    // await this.getAllCurrencies();
  },
  methods: {
    async getStatistics() {
      this.busyTable = true;
      if (this.dateRange && this.currentCurrency) {
        this.oldModel = {
          from: this.dateRange[0],
          to: this.dateRange[1],
          currency: this.currentCurrency,
        };
        const from = await Math.floor(this.dateRange[0].getTime() / 1000);
        const to = await Math.floor(this.dateRange[1].getTime() / 1000);
        try {
          const response = await this.$api.getStatistics(from, to, this.currentCurrency);
          response.map((item) => {
            item.pair = item.pair.toUpperCase();
            item.amount = this.SubstrValue(item.amount);
            item.quantity = this.SubstrValue(item.quantity);
            item.mean = this.SubstrValue(item.mean);
            return item;
          });
          this.statistics = response;
          if (!this.statistics.length) {
            this.$notify({
              type: 'danger',
              message: this.$t('statistics.noData'),
              icon: 'tim-icons icon-alert-circle-exc',
            });
          }
        } catch (e) {
          if (e.response) {
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
          message: this.$t('transactions.modals.null'),
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
      this.busyTable = false;
    },
    async getAllCurrencies() {
      try {
        const response = await this.$api.getAllCurrencies();
        response.result.data.map((item) => {
          item.symbol = item.symbol.toUpperCase();
          return item;
        });
        this.allCurrencies = [...response.result.data];
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
.options-title {
  &__date {
    cursor: pointer;
    &:hover {
      color: white !important;
      input,span,i {
        color: white !important;
      }
    }
    .el-range-input {
      background-color: transparent !important;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
    }
    .el-range-separator {
      color: rgba(255, 255, 255, 0.8);
    }
  }
}
</style>
<style scoped lang="scss">
.table-busy {
  margin-top: 20px;
  width: 100%;
}
.cards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  &__item {
    width: 100%;
    display: flex;
    height: 100px;
  }
  &__img {
    width: 20%;
    background-color: #32354F;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  &__text {
    width: 100%;
    background-color: #1E1E2E;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    padding-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  &__title {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    color: #FFFFFF;
    opacity: 0.5;
  }
  &__description {
    margin-top: 10px;
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 29px;
    color: #FFFFFF;
  }
}
.break-line {
  border-bottom: 1px solid #2B3553;
  margin: 0 -15px;
}
.options-title {
  display: flex;
  margin-bottom: 20px;
  &__btn {
    button {
      margin: 0;
      width: 100%;
    }
  }
  &__date {
    justify-content: space-between;
    height: 40px;
    &:hover {
      border-color: #e14eca !important
    }
  }
  &__form {
    margin-bottom: 0 !important;
  }
}

</style>
