<template>
  <div class="order-history">
    <card card-body-classes="table-full-width">
      <h4
        slot="header"
        class="card-title"
      >
        {{ $t('transactions.title') }}
      </h4>
      <div>
        <div
          class="row space-between"
        >
          <div class="col">
            <base-input>
              <el-input
                v-model.trim="searchQuery"
                class="mb-3 search-input"
                prefix-icon="el-icon-search"
                :placeholder="this.$t('management.search')"
                aria-controls="datatables"
                clearable
                maxlength="30"
              />
            </base-input>
          </div>
          <div class="col-3">
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
          <div class="col-3">
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
        </div>
        <div
          class="row space-between"
        >
          <div class="col-3">
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
          <div class="col-3">
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
            <div
              class="pair-change"
            >
              <el-select
                v-model="reason"
                class="select-primary pagination-select pair-change-drop"
                :placeholder="$t('transactions.table.type')"
              >
                <el-option
                  v-for="option in selects.type"
                  :key="option.label"
                  class="select-primary role-select"
                  :value="option.value"
                  :label="option.label"
                />
              </el-select>
            </div>
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
              :min-width="240"
              align="right"
            >
              <div
                slot-scope="props"
                class="btns"
              >
                <base-button
                  v-if="props.row.status === 'Pending' || props.row.status === 'Ожидает'"
                  type="info"
                  class="btn discount-btn"
                  data-toggle="modal"
                  data-target="#approveTransactionModal"
                  @click="askApprove(props.row)"
                >
                  {{ $t('transactions.modals.approve') }}
                </base-button>
                <modal
                  :show.sync="approveTransactionModal"
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
                    {{ $t('transactions.modals.enterCode') }}
                  </h4>
                  <form @submit.prevent>
                    <div
                      class="approve__input"
                    >
                      <base-input
                        v-model.trim="approveCode"
                        v-validate="'required|max:8|min:8'"
                        class="commission-fix__input"
                        :placeholder="$t('transactions.modals.enterCode')"
                        maxlength="8"
                        name="approve"
                        :error="getError('approve')"
                      />
                    </div>
                    <div class="btnx">
                      <base-button
                        class="btn"
                        type="primary"
                        @click="closeModal"
                      >
                        {{ $t('management.user-info.general.modal.close') }}
                      </base-button>
                      <b-overlay
                        :show="busy"
                        rounded
                        opacity="0.6"
                        spinner-small
                        spinner-variant="primary"
                        class="d-inline-block"
                      >
                        <base-button
                          class="btn"
                          type="primary"
                          @click="confirmTransaction"
                        >
                          {{ $t('transactions.modals.confirm') }}
                        </base-button>
                      </b-overlay>
                    </div>
                  </form>
                </modal>
                <base-button
                  v-if="props.row.status === 'Pending' || props.row.status === 'Ожидает'"
                  type="danger"
                  class="btn discount-btn"
                  data-toggle="modal"
                  data-target="#rejectTransactionModal"
                  style="margin-left: 20px;"
                  @click="rejectModal(props.row)"
                >
                  {{ $t('transactions.modals.reject') }}
                </base-button>
                <modal
                  :show.sync="rejectTransactionModal"
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
                    {{ $t('transactions.modals.enterMessage') }}
                  </h4>
                  <form @submit.prevent>
                    <div
                      class="approve__input"
                    >
                      <base-input
                        v-model.trim="message"
                        v-validate="'required|max:500|min:10|alpha_spaces'"
                        class="commission-fix__input"
                        :placeholder="$t('transactions.modals.enterMessage')"
                        maxlength="500"
                        name="reject"
                        :error="getError('reject')"
                      />
                    </div>
                    <div class="btnx">
                      <base-button
                        class="btn"
                        type="primary"
                        @click="closeModal"
                      >
                        {{ $t('management.user-info.general.modal.close') }}
                      </base-button>
                      <b-overlay
                        :show="busy"
                        rounded
                        opacity="0.6"
                        spinner-small
                        spinner-variant="primary"
                        class="d-inline-block"
                      >
                        <base-button
                          class="btn"
                          type="primary"
                          @click="rejectApprove"
                        >
                          {{ $t('transactions.modals.confirm') }}
                        </base-button>
                      </b-overlay>
                    </div>
                  </form>
                </modal>
                <a
                  v-if="props.row.status !== 'Error' && props.row.status !== 'Rejected' && props.row.status !== 'Failed' && props.row.status !== 'Pending'
                    && props.row.status !== 'Ошибка' && props.row.status !== 'Отклонено' && props.row.status !== 'Провалено' && props.row.status !== 'Ожидает'"
                  :href="props.row.orderLink"
                  target="_blank"
                >
                  <base-button
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
    </card>
  </div>
</template>

<script>
import {
  DatePicker, Select, Option, Table, TableColumn,
} from 'element-ui';
import { mapGetters } from 'vuex';
import { Modal } from '@/components';
import { BasePagination } from '~/components';
import transactionsHandler from '~/handlers/transactions';

export default {
  middleware: 'auth',
  name: 'Withdraw',
  components: {
    [DatePicker.name]: DatePicker,
    BasePagination,
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    Modal,
  },
  data() {
    return {
      dateRange: '',
      reasons: [
        { value: 'All reasons', label: this.$t('transactions.selects.all') },
        { value: 'trade', label: this.$t('transactions.selects.trade') },
        { value: 'deposit', label: this.$t('transactions.selects.deposit') },
        { value: 'reward', label: this.$t('transactions.selects.reward') },
        { value: 'p2p', label: this.$t('transactions.selects.p2p') },
      ],
      reasonOf: 'All reasons',
      reason: 3,
      selects: {
        type: [
          { value: 3, label: this.$t('transactions.selects.pending') },
          { value: 4, label: this.$t('transactions.selects.rejected') },
          { value: 1, label: this.$t('transactions.selects.confirmed') },
          { value: 'all', label: this.$t('transactions.selects.allTypes') },
        ],
      },
      approveTransactionModal: false,
      rejectTransactionModal: false,
      approveCode: '',
      type: null,
      busyTable: true,
      page: 1,
      busy: false,
      message: '',
      searchQuery: '',
      propsToSearch: ['name', 'email'],
      pagination: {
        perPage: 10,
        currentPage: 1,
        perPageOptions: [10, 50, 100],
        total: 10,
      },
      tableColumns: [
        {
          prop: 'user.username',
          label: this.$t('management.user-info.transactions.table.username'),
          minWidth: 100,
        },
        {
          prop: 'currency.symbol',
          label: this.$t('management.user-info.transactions.table.currency'),
          minWidth: 100,
        },
        {
          prop: 'amount',
          label: this.$t('management.user-info.transactions.table.amount'),
          minWidth: 100,
        },
        {
          prop: 'reason',
          label: this.$t('management.user-info.transactions.table.reason'),
          minWidth: 120,
        },
      ],
      tableData: [],
      searchedData: [],
      fuseSearch: null,
      get: false,
      newTotal: false,
      oldModel: {
        currentPage: '',
        perPage: '',
        reason: '',
        type: '',
        from: '',
        to: '',
        symbol: '',
        username: '',
      },
      currentIndex: '',
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
    reasonOf(value) {
      this.pagination.currentPage = 1;
      this.reasonOf = value;
      this.getTransactions();
    },
    searchQuery(newSearchedDate, oldSearchedDate) {
      if (newSearchedDate < oldSearchedDate && newSearchedDate.length < 1 && newSearchedDate.length !== 0) {
        this.pagination.currentPage = 1;
        this.getTransactions();
        this.get = true;
        this.oldModel.username = newSearchedDate;
      } else if (newSearchedDate.length >= 3) {
        this.pagination.currentPage = 1;
        this.getTransactions();
        this.get = true;
        this.oldModel.username = newSearchedDate;
      } else if (newSearchedDate === '') {
        this.getTransactions();
        this.newTotal = true;
        this.get = true;
        this.oldModel.username = newSearchedDate;
      }
    },
    currentCurrency(value) {
      this.pagination.currentPage = 1;
      this.getTransactions();
    },
    dateRange(value) {
      if (value === null) {
        this.rangeTransactions();
      }
    },
    reason(value) {
      this.pagination.currentPage = 1;
      this.reason = value;
      this.getTransactions();
    },
    type(value) {
      this.pagination.currentPage = 1;
      this.type = value;
      this.getTransactions();
    },
    to(value) {
      this.getTransactions();
    },
    from(value) {
      this.getTransactions();
    },
  },
  async mounted() {
    await this.getTransactions();
    await this.getAllCurrencies();
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
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
    async rejectApprove() {
      this.busy = true;
      try {
        if (this.message) {
          await this.$api.rejectTransaction(this.currentIndex.orderId, this.message);
          this.rejectTransactionModal = true;
          this.message = '';
          await this.spliceTransaction(this.currentIndex);
        } else {
          this.$notify({
            type: 'danger',
            message: this.$t('transactions.modals.null'),
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
      this.busy = false;
    },
    async rejectModal(index) {
      await this.$validator.errors.clear();
      this.currentIndex = index;
      this.rejectTransactionModal = true;
    },
    async askApprove(index) {
      await this.$validator.errors.clear();
      this.currentIndex = index;
      try {
        await this.$api.askTransaction(index.orderId);
        this.approveTransactionModal = true;
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
    },
    async closeModal() {
      this.approveTransactionModal = false;
      this.rejectTransactionModal = false;
      this.approveCode = '';
      this.message = '';
      await this.$validator.errors.clear();
    },
    async confirmTransaction() {
      this.busy = true;
      try {
        if (this.approveCode) {
          await this.$api.confirmTransaction(this.approveCode);
          this.approveTransactionModal = false;
          this.approveCode = '';
          await this.spliceTransaction(this.currentIndex);
        } else {
          this.$notify({
            type: 'danger',
            message: this.$t('transactions.modals.null'),
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
      this.busy = false;
    },
    spliceTransaction(row) {
      const indexToDelete = this.tableData.findIndex(
        (tableRow) => tableRow.orderId === row.orderId,
      );
      if (indexToDelete >= 0) {
        this.tableData.splice(indexToDelete, 1);
      }
    },
    changePerPage() {
      this.pagination.currentPage = 1;
    },
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
            || this.oldModel.symbol !== this.currentCurrency
            || this.oldModel.username !== this.searchQuery) {
          this.oldModel = {
            currentPage: (this.pagination.currentPage - 1) * this.pagination.perPage,
            perPage: this.pagination.perPage,
            reason: this.reason,
            type: this.type,
            from,
            reasonOf: this.reasonOf,
            to,
            symbol: this.currentCurrency || null,
            username: this.searchQuery || '',
          };
          try {
            const optionalModel = {
              userId: null,
              type: this.type || 'withdraw',
              reason: this.reason || null,
              limit: this.pagination.perPage,
              reasonOf: this.reasonOf || null,
              offset: (this.pagination.currentPage - 1) * this.pagination.perPage,
              from,
              to,
              symbol: this.currentCurrency || null,
              username: this.searchQuery || null,
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
            || this.oldModel.reasonOf !== this.reasonOf
            || this.oldModel.type !== this.type
            || this.oldModel.symbol !== this.currentCurrency
            || this.oldModel.username !== this.searchQuery) {
          this.oldModel = {
            currentPage: (this.pagination.currentPage - 1) * this.pagination.perPage,
            perPage: this.pagination.perPage,
            reason: this.reason,
            type: this.type,
            from: null,
            to: null,
            reasonOf: this.reasonOf,
            symbol: this.currentCurrency || null,
            username: this.searchQuery || '',
          };
          try {
            const optionalModel = {
              userId: null,
              type: this.type || 'withdraw',
              reason: this.reason || null,
              limit: this.pagination.perPage,
              reasonOf: this.reasonOf || null,
              offset: (this.pagination.currentPage - 1) * this.pagination.perPage,
              symbol: this.currentCurrency || null,
              username: this.searchQuery || '',
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
          userId: null,
          type: this.type || 'withdraw',
          reason: this.reason || null,
          reasonOf: this.reasonOf || null,
          limit: this.pagination.perPage,
          offset: (this.pagination.currentPage - 1) * this.pagination.perPage,
          symbol: this.currentCurrency || null,
          username: this.searchQuery || '',
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
.space-between {
  display: flex;
  justify-content: space-between;
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
.selects {
  display: flex;
  align-items: center;
  margin-bottom: 1rem !important;
  h4 {
    margin: 0;
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
.btnx {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  button {
    margin-top: 0;
    margin-bottom: 0;
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
