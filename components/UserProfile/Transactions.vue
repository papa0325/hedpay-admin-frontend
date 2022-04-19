<template>
  <div class="">
    <div>
      <div
        class="row"
        style="margin-bottom: 15px"
      >
        <div class="col">
          <base-input class="options-title__form">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              placeholder="Date Picker"
              class="options-title__date"
            />
          </base-input>
        </div>
        <div class="col-3 options-title__btn">
          <base-button
            class="btn"
            type="primary"
            @click="getTransactions()"
          >
            {{ $t('statistics.calculate') }}
          </base-button>
        </div>
      </div>
      <div
        class="row"
      >
        <div class="col-4">
          <el-select
            v-model="pagination.perPage"
            class="select-primary mb-3 pagination-select"
            placeholder="Per page"
            @change="changePerPage()"
          >
            <el-option
              v-for="item in pagination.perPageOptions"
              :key="item"
              class="select-primary"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
        <div class="col-4">
          <el-select
            v-model="currentCurrency"
            class="select-primary mb-3 pagination-select"
            :placeholder="$t('management.user-info.balance.allcurrency')"
            @change="changePerPage()"
          >
            <el-option
              v-for="item in allCurrencies"
              :key="item.id"
              class="select-primary"
              :label="item.symbol"
              :value="item.symbol"
            />
          </el-select>
        </div>
        <div class="col-4">
          <el-select
            v-model="reasonOf"
            class="select-primary mb-3 pagination-select"
            :placeholder="this.$t('transactions.selects.all')"
            @change="changePerPage()"
          >
            <el-option
              v-for="item in reasons"
              :key="item.id"
              class="select-primary"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <b-overlay
        :show="busyTable"
        rounded
        opacity="0.6"
        spinner-small
        spinner-variant="primary"
        class="d-inline-block table-busy"
      >
        <el-table :data="queriedData">
          <el-table-column
            label="#"
          >
            <div
              slot-scope="{ row, $index }"
            >
              {{ (pagination.currentPage * pagination.perPage) - (pagination.perPage - ($index + 1)) }}
            </div>
          </el-table-column>
          <el-table-column
            v-for="column in tableColumns"
            :key="column.label"
            :min-width="column.minWidth"
            :prop="column.prop"
            :label="column.label"
          />
          <el-table-column
            min-width="130"
            :label="this.$t('management.user-info.transactions.table.recipient')"
            align="center"
            header-align="center"
          >
            <div
              slot-scope="{ row }"
            >
              <div
                v-clipboard="row.recipient"
                v-clipboard:success="copySuccess"
                v-clipboard:error="copyError"
                class="recep-link"
              >
                <p>
                  {{ row.smallRecipient }}
                </p>
              </div>
            </div>
          </el-table-column>
          <el-table-column
            min-width="180"
            :label="this.$t('management.user-info.transactions.table.status')"
            align="center"
            header-align="center"
          >
            <div
              slot-scope="{ row }"
              class="verified"
            >
              <label
                class="verified-true"
                :class="[
                  {'verified-failed': row.status === 'Error'},
                  {'verified-failed': row.status === 'Rejected'},
                  {'verified-failed': row.status === 'Failed'},
                  {'verified-approving': row.status === 'Pending'},
                  {'verified-failed': row.status === 'Ошибка'},
                  {'verified-failed': row.status === 'Отклонено'},
                  {'verified-failed': row.status === 'Провалено'},
                  {'verified-approving': row.status === 'Ожидает'}]"
              >
                {{ row.status }}
              </label>
            </div>
          </el-table-column>
          <el-table-column
            min-width="180"
            :label="this.$t('management.orderHistory.date')"
          >
            <div
              slot-scope="{ row }"
            >
              {{ $d((row.timestamp ), 'long') }}
            </div>
          </el-table-column>
          <el-table-column
            min-width="120"
          >
            <div
              slot-scope="{ row }"
            >
              <a
                v-if="row.status !== 'Error' && row.status !== 'Rejected' && row.status !== 'Failed' && row.status !== 'Pending'
                  && row.status !== 'Ошибка' && row.status !== 'Отклонено' && row.status !== 'Провалено' && row.status !== 'Ожидает'"
                :href="row.orderLink"
                target="_blank"
              >
                <base-button
                  style="padding: 10px 10px"

                  type="secondary"
                >
                  Explorer
                </base-button>
              </a>
            </div>
          </el-table-column>
        </el-table>
      </b-overlay>
    </div>
    <div
      slot="footer"
      class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
    >
      <div class="">
        <p class="card-category" />
      </div>
      <base-pagination
        v-model="pagination.currentPage"
        class="pagination-no-border"
        :per-page="pagination.perPage"
        :total="pagination.total"
      />
    </div>
  </div>
</template>

<script>
import {
  DatePicker, Option, Select, Table, TableColumn,
} from 'element-ui';
import { mapGetters } from 'vuex';
import { BasePagination } from '~/components';
import transactionsHandler from '~/handlers/transactions';

export default {
  name: 'Transactions',
  components: {
    [DatePicker.name]: DatePicker,
    BasePagination,
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      dateRange: '',
      userBusy: true,
      busyTable: true,
      page: 1,
      pagination: {
        perPage: 10,
        currentPage: 1,
        perPageOptions: [10, 50, 100],
        total: 10,
      },
      reasons: [
        { value: 'All reasons', label: this.$t('transactions.selects.all') },
        { value: 'trade', label: this.$t('transactions.selects.trade') },
        { value: 'deposit', label: this.$t('transactions.selects.deposit') },
        { value: 'reward', label: this.$t('transactions.selects.reward') },
        { value: 'p2p', label: this.$t('transactions.selects.p2p') },
      ],
      reasonOf: 'All reasons',
      searchQuery: '',
      propsToSearch: ['name', 'email'],
      tableColumns: [
        {
          prop: 'currency.symbol',
          label: this.$t('management.user-info.transactions.table.currency'),
          minWidth: 100,
        },
        {
          prop: 'amount',
          label: this.$t('management.user-info.transactions.table.amount'),
          minWidth: 180,
        },
        {
          prop: 'reason',
          label: this.$t('management.user-info.transactions.table.reason'),
          minWidth: 120,
        },
        {
          prop: 'type',
          label: this.$t('management.user-info.transactions.table.type'),
          minWidth: 120,
        },
      ],
      tableData: [],
      searchedData: [],
      fuseSearch: null,
      get: false,
      newTotal: false,
      whichPair: null,
      currentPairs: [],
      oldModel: {
        currentPage: '',
        perPage: '',
        reason: '',
        from: '',
        to: '',
        symbol: '',
      },
      allCurrencies: [],
      currentCurrency: this.$t('management.user-info.balance.allcurrency'),
    };
  },
  computed: {
    ...mapGetters({
      userData: 'management/userData',
    }),
    queriedData() {
      let result = this.tableData;
      if (this.searchedData.length > 0) {
        result = this.searchedData;
      }
      return result;
    },
    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.pagination.total < highBound) {
        highBound = this.pagination.total;
      }
      return highBound;
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    total() {
      return this.searchedData.length > 0
        ? this.searchedData.length
        : this.pagination.total;
    },
  },
  watch: {
    currentCurrency(value) {
      this.pagination.currentPage = 1;
      this.getTransactions();
    },
    reasonOf(value) {
      this.pagination.currentPage = 1;
      this.reasonOf = value;
      this.getTransactions();
    },
    dateRange(value) {
      if (value === null) {
        this.rangeTransactions();
      }
    },
    to(value) {
      this.getTransactions();
    },
    from(value) {
      this.getTransactions();
    },
  },
  async mounted() {
    await this.getAllCurrencies();
    await this.getTransactions();
  },
  methods: {
    async getAllCurrencies() {
      try {
        const response = await this.$api.getAllCurrencies();
        response.result.data.map((item) => {
          item.symbol = item.symbol.toUpperCase();
          return item;
        });
        this.allCurrencies = [...response.result.data];
        this.allCurrencies.unshift({
          active: true,
          id: '',
          symbol: this.$t('management.user-info.balance.allcurrency'),
        });
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
    },
    copySuccess() {
      this.$notify({
        type: 'success',
        message: this.$t('transactions.copySuccess'),
        icon: 'tim-icons icon-check-2',
      });
    },
    copyError() {
      this.$notify({
        type: 'danger',
        message: this.$t('error.title'),
        icon: 'tim-icons icon-alert-circle-exc',
      });
    },
    changePerPage() {
      this.pagination.currentPage = 1;
    },
    async getTransactions() {
      this.busyTable = true;
      if (this.dateRange) {
        const from = await Math.floor(this.dateRange[0].getTime() / 1000);
        const to = await Math.floor(this.dateRange[1].getTime() / 1000);
        if (this.oldModel.currentPage !== (this.pagination.currentPage - 1) * this.pagination.perPage
            || this.oldModel.perPage !== this.pagination.perPage
            || this.oldModel.reason !== this.reason
            || this.oldModel.reasonOf !== this.reasonOf
            || this.oldModel.from !== from
            || this.oldModel.to !== to
            || this.oldModel.type !== this.type
            || this.oldModel.symbol !== this.currentCurrency) {
          this.oldModel = {
            currentPage: (this.pagination.currentPage - 1) * this.pagination.perPage,
            perPage: this.pagination.perPage,
            reason: this.reason,
            type: this.type,
            reasonOf: this.reasonOf,
            from,
            to,
            symbol: this.currentCurrency || null,
          };
          try {
            const optionalModel = {
              userId: this.$route.params.index,
              type: 'all',
              reasonOf: this.reasonOf || null,
              limit: this.pagination.perPage,
              offset: (this.pagination.currentPage - 1) * this.pagination.perPage,
              from,
              to,
              symbol: this.currentCurrency || null,
            };
            const response = await this.$api.getTransactions(optionalModel);
            await transactionsHandler.prepareArray(response.result.data);
            await response.result.data.map((item) => {
              transactionsHandler.prepareLink(item);
              item.currency.symbol = item.currency.symbol.toUpperCase();
              item.smallRecipient = `${item.recipient.substr(0, 4)}...${item.recipient.substr(-4)}`;
              if (item.status === 2) {
                item.status = this.$t('transactions.table.failed');
              } else if (item.status === 1) {
                item.status = this.$t('transactions.table.confirmed');
              } else if (item.status === 0) {
                item.status = this.$t('transactions.table.created');
              } else if (item.status === -1) {
                item.status = this.$t('transactions.table.error');
              } else if (item.status === 4) {
                item.status = this.$t('transactions.table.rejected');
              } else if (item.status === 3) {
                item.status = this.$t('transactions.table.pending');
              }
              return item;
            });
            this.pagination.total = response.result.count;
            this.tableData = [...response.result.data];
            this.busyTable = false;
          } catch (e) {
            this.$notify({
              type: 'danger',
              message: e.response.data.message,
              icon: 'tim-icons icon-alert-circle-exc',
            });
          }
        }
      } else if (!this.dateRange) {
        this.oldModel.from = null;
        this.oldModel.to = null;
        if (this.oldModel.currentPage !== (this.pagination.currentPage - 1) * this.pagination.perPage
            || this.oldModel.perPage !== this.pagination.perPage
            || this.oldModel.reason !== this.reason
            || this.oldModel.type !== this.type
            || this.oldModel.reasonOf !== this.reasonOf
            || this.oldModel.symbol !== this.currentCurrency) {
          this.oldModel = {
            currentPage: (this.pagination.currentPage - 1) * this.pagination.perPage,
            perPage: this.pagination.perPage,
            reason: this.reason,
            type: this.type,
            from: null,
            reasonOf: this.reasonOf,
            to: null,
            symbol: this.currentCurrency || null,
          };
          try {
            const optionalModel = {
              userId: this.$route.params.index,
              type: 'all',
              reasonOf: this.reasonOf || null,
              limit: this.pagination.perPage,
              offset: (this.pagination.currentPage - 1) * this.pagination.perPage,
              symbol: this.currentCurrency || null,
            };
            const response = await this.$api.getTransactions(optionalModel);
            await transactionsHandler.prepareArray(response.result.data);
            await response.result.data.map((item) => {
              transactionsHandler.prepareLink(item);
              item.currency.symbol = item.currency.symbol.toUpperCase();
              item.smallRecipient = `${item.recipient.substr(0, 4)}...${item.recipient.substr(-4)}`;
              if (item.status === 2) {
                item.status = this.$t('transactions.table.failed');
              } else if (item.status === 1) {
                item.status = this.$t('transactions.table.confirmed');
              } else if (item.status === 0) {
                item.status = this.$t('transactions.table.created');
              } else if (item.status === -1) {
                item.status = this.$t('transactions.table.error');
              } else if (item.status === 4) {
                item.status = this.$t('transactions.table.rejected');
              } else if (item.status === 3) {
                item.status = this.$t('transactions.table.pending');
              }
              return item;
            });
            this.pagination.total = response.result.count;
            this.tableData = [...response.result.data];
            this.busyTable = false;
          } catch (e) {
            this.$notify({
              type: 'danger',
              message: e.response.data.message,
              icon: 'tim-icons icon-alert-circle-exc',
            });
          }
        }
      }
      this.busyTable = false;
      this.get = false;
    },
    async rangeTransactions() {
      this.oldModel.from = null;
      this.oldModel.to = null;
      try {
        const optionalModel = {
          userId: this.$route.params.index,
          type: 'all',
          reasonOf: this.reasonOf || null,
          limit: this.pagination.perPage,
          offset: (this.pagination.currentPage - 1) * this.pagination.perPage,
          symbol: this.currentCurrency || null,
        };
        const response = await this.$api.getTransactions(optionalModel);
        await transactionsHandler.prepareArray(response.result.data);
        await response.result.data.map((item) => {
          transactionsHandler.prepareLink(item);
          item.currency.symbol = item.currency.symbol.toUpperCase();
          item.smallRecipient = `${item.recipient.substr(0, 4)}...${item.recipient.substr(-4)}`;
          if (item.status === 2) {
            item.status = this.$t('transactions.table.failed');
          } else if (item.status === 1) {
            item.status = this.$t('transactions.table.confirmed');
          } else if (item.status === 0) {
            item.status = this.$t('transactions.table.created');
          } else if (item.status === -1) {
            item.status = this.$t('transactions.table.error');
          } else if (item.status === 4) {
            item.status = this.$t('transactions.table.rejected');
          } else if (item.status === 3) {
            item.status = this.$t('transactions.table.pending');
          }
          return item;
        });
        this.pagination.total = response.result.count;
        this.tableData = [...response.result.data];
        this.busyTable = false;
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
.input-group, .form-control{
  height: 40px;
}
.table-busy {
  width: 100%;
  height: 100%;
  .bg-light {
    background-color: transparentize($color: #31334B, $amount: 0.2) !important;
  }
}
.user-busy {
  height: 100%;
  &-items {
    display: flex;
    align-items: center;
  }
  .bg-light {
    background-color: transparentize($color: #31334B, $amount: 0.2) !important;
  }
}
</style>

<style scoped lang="scss">
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
.recep-link {
  p {
    margin: 0 !important;
    cursor: pointer;
    text-decoration: underline;
    &:hover {
      color: #E14ECA;
    }
  }
}
.order-history {
  button {
    padding: 10px 10px;
    height: 40px;
  }
  h3 {
    margin: 0 0 0 20px;
  }
  p {
    margin: 0 20px 0 0;
  }
  &-menu {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    &__line {
      margin: 0 20px;
      padding: 0;
      width: 1px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
    }
  }
}
.verified {
  display: flex;
  justify-content: center;
  label {
    width: auto;
    padding: 0 5px;
    display: flex;
    justify-content: center;
    border-radius: 82px;
    font-size: 14px;
  }
  &-true {
    background: rgba(66, 184, 131, 0.2);
    color: #42B883;
  }
  &-false {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
  &-approving {
    color: white;
    background-color: rgba(255, 138, 118, 1);
  }
  &-failed {
    color: white;
    background-color: rgba(235, 87, 87, 1);
  }
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
.btns {
  display: flex;
  justify-content: flex-end;
  img {
    margin-right: 2px;
  }
  button {
    padding: 11px 10px;
    &:nth-child(2) {
      margin-left: 20px;
    }
  }
}
.row {
  .el-select {
    display: block;
  }
  h4 {
    margin-left: 15px;
  }
  .form-group {
    margin-bottom: 0;
  }
  .mt-3 {
    margin-top: 0 !important;
  }
}
</style>
