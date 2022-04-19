<template>
  <card>
    <div class="flex-container head">
      <h4
        slot="header"
        class="card-title"
      >
        {{ $t('newSidebar.orders') }}
      </h4>
    </div>
    <div
      class="options-title row"
    >
      <div class="col-9">
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
          @click="getOrders()"
        >
          {{ $t('statistics.calculate') }}
        </base-button>
      </div>
    </div>
    <div
      class="options-title row"
    >
      <div class="col-3">
        <el-select
          v-model="pagination.perPage"
          class="select-primary mb-0 pagination-select"
          placeholder="Per page"
          style="width: 100%"
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
        <el-select
          v-model="side"
          class="select-primary mb-0 pagination-select"
          placeholder="Per page"
          style="width: 100%"
          @change="changePerPage()"
        >
          <el-option
            v-for="item in sides"
            :key="item.value"
            class="select-primary"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="col-3">
        <div
          v-if="currentPairs[0]"
          class="pair-change"
        >
          <el-select
            v-model="whichPair"
            class="select-primary pagination-select pair-change-drop"
            :placeholder="$t('management.orderHistory.allPairs')"
          >
            <el-option
              v-for="option in currentPairs"
              :key="option.name"
              class="select-primary role-select"
              :value="option.id"
              :label="option.name"
            />
          </el-select>
        </div>
      </div>
      <div class="col-3">
        <el-select
          v-model="status"
          class="select-primary mb-0 pagination-select"
          placeholder="Per page"
          style="width: 100%"
          @change="changePerPage()"
        >
          <el-option
            v-for="item in stats"
            :key="item.value"
            class="select-primary"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div
      class="break-line"
    />
    <b-overlay
      :show="busyTable"
      rounded
      opacity="0.6"
      spinner-small
      spinner-variant="primary"
      class="d-inline-block table-busy"
    >
      <el-table
        :data="queriedData"
        @sort-change="sortTable"
      >
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
          min-width="180"
          :label="this.$t('management.orderHistory.date')"
          sortable="custom"
        >
          <div
            slot-scope="{ row }"
          >
            {{ $d((row.timestamp * 1000), 'long') }}
          </div>
        </el-table-column>
        <el-table-column
          min-width="180"
          :label="this.$t('management.table.status')"
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
                {'verified-failed': row.status === 'error'},
                {'verified-failed': row.status === 'rejected'},
                {'verified-failed': row.status === 'failed'},
                {'verified-failed': row.status === 'cancelled'},
                {'verified-approving': row.status === 'pending'}]"
            >
              {{ row.status }}
            </label>
          </div>
        </el-table-column>
        <el-table-column
          :min-width="180"
          align="right"
        >
          <div
            slot-scope="{ row }"
            class="close-order"
          >
            <base-button
              v-if="row.status === 'executing' || row.status === 'created' || row.status === 'accepted'"
              class="btn"
              type="primary"
              @click="closeOrder(row)"
            >
              {{ $t("management.orderHistory.closeOrder") }}
            </base-button>
          </div>
        </el-table-column>
      </el-table>
    </b-overlay>
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
        :total="total"
      />
    </div>
  </card>
</template>

<script>
import {
  DatePicker, Option, Select, Table, TableColumn,
} from 'element-ui';
import { mapGetters } from 'vuex';
import { BasePagination } from '~/components';
import ordersHandler from '~/handlers/orders';

export default {
  middleware: 'auth',
  name: 'Index',
  components: {
    [DatePicker.name]: DatePicker,
    [Option.name]: Option,
    [Select.name]: Select,
    BasePagination,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      dateRange: '',
      allCurrencies: '',
      currentCurrency: '',
      busyTable: false,
      statistics: '',
      userBusy: true,
      page: 1,
      pagination: {
        perPage: 10,
        currentPage: 1,
        perPageOptions: [10, 50, 100],
        total: 10,
      },
      searchQuery: '',
      propsToSearch: ['name', 'email'],
      tableColumns: [
        {
          prop: 'pair',
          label: this.$t('management.orderHistory.pair'),
          minWidth: 120,
        },
        {
          prop: 'side',
          label: this.$t('management.orderHistory.side'),
          minWidth: 100,
        },
        {
          prop: 'quantity',
          label: this.$t('management.orderHistory.quantity'),
          minWidth: 200,
        },
        {
          prop: 'executed',
          label: this.$t('management.orderHistory.executed'),
          minWidth: 200,
        },
        {
          prop: 'price',
          label: this.$t('management.orderHistory.price'),
          minWidth: 200,
        },
      ],
      tableData: [],
      searchedData: [],
      fuseSearch: null,
      get: false,
      newTotal: false,
      whichPair: this.$t('management.orderHistory.allPairs'),
      currentPairs: [],
      oldModel: {
        currentPage: '',
        perPage: '',
        whichPair: '',
        sortedMethod: '',
        from: '',
        to: '',
        side: '',
        status: '',
      },
      sortedMethod: '',
      stats: [
        { value: 'Status', label: this.$t('management.orderHistory.stats.all'), active: true },
        { value: 'created', label: this.$t('management.orderHistory.stats.created') },
        { value: 'accepted', label: this.$t('management.orderHistory.stats.accepted') },
        { value: 'rejected', label: this.$t('management.orderHistory.stats.rejected') },
        { value: 'executing', label: this.$t('management.orderHistory.stats.executing') },
        { value: 'executed', label: this.$t('management.orderHistory.stats.executed') },
        { value: 'cancelled', label: this.$t('management.orderHistory.stats.cancelled') },
      ],
      sides: [
        { value: 'Side', label: this.$t('management.orderHistory.sides.all'), active: true },
        { value: 'buy', label: this.$t('management.orderHistory.sides.buy') },
        { value: 'sell', label: this.$t('management.orderHistory.sides.sell') },
        { value: 'buyShort', label: this.$t('management.orderHistory.sides.buyShort') },
        { value: 'sellShort', label: this.$t('management.orderHistory.sides.sellShort') },
      ],
      status: 'Status',
      side: 'Side',
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
    dateRange(value) {
      if (value === null) {
        this.rangeOrdersGetting();
      }
    },
    side(value) {
      this.side = value;
      this.getOrders();
    },
    status(value) {
      this.status = value;
      this.getOrders();
    },
    to(value) {
      this.getOrders();
    },
    whichPair(value) {
      this.pagination.currentPage = 1;
      this.whichPair = value;
      this.getOrders();
    },
    from(value) {
      this.getOrders();
    },
  },
  async mounted() {
    await this.getOrders();
    await this.getPairs();
  },
  methods: {
    async closeOrder(row) {
      try {
        const response = await this.$api.closeOrder(+row.id);
        row.status = 'cancelled';
        this.$notify({
          type: 'success',
          message: this.$t('management.orderHistory.successClose'),
          icon: 'tim-icons icon-check-2',
        });
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
    },
    async sortTable(sorted) {
      this.whichSorted = sorted.prop;
      if (sorted.order === null) {
        this.whichSorted = '';
        this.sortedMethod = sorted.order;
        await this.getOrders();
      } else if (sorted.order === 'ascending') {
        this.sortedMethod = 'ASC';
        await this.getOrders();
      } else if (sorted.order === 'descending') {
        this.sortedMethod = 'DESC';
        await this.getOrders();
      }
    },
    async getPairs() {
      try {
        this.currentPairs = await this.$store.dispatch('dashboard/getPairs');
        this.currentPairs.unshift({
          active: true,
          id: '',
          name: this.$t('management.orderHistory.allPairs'),
        });
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
    },
    changePerPage() {
      this.pagination.currentPage = 1;
    },
    async getOrders() {
      // const start = new Date();
      // start.setHours(0, 0, 0, 0);
      // this.dateRange[0] = start;
      // const end = new Date();
      // end.setHours(23, 59, 59, 999);
      // this.dateRange[1] = end;
      // console.log(this.dateRange);
      this.busyTable = true;
      if (this.dateRange) {
        const from = await Math.floor(this.dateRange[0].getTime() / 1000);
        const to = await Math.floor(this.dateRange[1].getTime() / 1000);
        if (this.oldModel.currentPage !== (this.pagination.currentPage - 1) * this.pagination.perPage
            || this.oldModel.perPage !== this.pagination.perPage
            || this.oldModel.whichPair !== this.whichPair
            || this.oldModel.side !== this.side
            || this.oldModel.status !== this.status
            || this.oldModel.from !== from
            || this.oldModel.to !== to
            || this.oldModel.sortedMethod !== this.sortedMethod) {
          this.oldModel = {
            currentPage: (this.pagination.currentPage - 1) * this.pagination.perPage,
            perPage: this.pagination.perPage,
            whichPair: this.whichPair,
            sortedMethod: this.sortedMethod,
            from,
            to,
            status: this.status,
            side: this.side,
          };
          try {
            const response = await this.$api.getOrders(this.oldModel);
            response.result.data.map((item) => {
              item.pair = item.pair.toUpperCase().replace('_', ' / ');
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
            || this.oldModel.whichPair !== this.whichPair
            || this.oldModel.side !== this.side
            || this.oldModel.status !== this.status
            || this.oldModel.sortedMethod !== this.sortedMethod) {
          this.oldModel = {
            currentPage: (this.pagination.currentPage - 1) * this.pagination.perPage,
            perPage: this.pagination.perPage,
            whichPair: this.whichPair,
            sortedMethod: this.sortedMethod,
            from: null,
            to: null,
            status: this.status,
            side: this.side,
          };
          try {
            const response = await this.$api.getOrders(this.oldModel);
            response.result.data.map((item) => {
              item.pair = item.pair.toUpperCase().replace('_', ' / ');
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
    async rangeOrdersGetting() {
      this.oldModel.from = null;
      this.oldModel.to = null;
      try {
        const response = await this.$api.getOrders(this.oldModel);
        response.result.data.map((item) => {
          item.pair = item.pair.toUpperCase().replace('_', ' / ');
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
</style>
<style scoped lang="scss">
.close-order {
 button {
   padding: 10px 10px;
 }
}
.table-busy {
  margin-top: 20px;
  width: 100%;
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
