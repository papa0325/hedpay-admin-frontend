<template>
  <div class="">
    <div>
      <div
        class="row"
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
            style="width: 100%"
            @click="getOrders()"
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
            min-width="180"
            :label="this.$t('management.orderHistory.date')"
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
import ordersHandler from '~/handlers/orders';

export default {
  name: 'Orders',
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
      whichPair: null,
      currentPairs: [],
      oldModel: {
        currentPage: '',
        from: '',
        to: '',
        perPage: '',
        whichPair: '',
        userId: this.$route.params.index,
      },
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
    // async getOrders() {
    //   this.busyTable = true;
    //   if (this.oldModel.currentPage !== (this.pagination.currentPage - 1) * this.pagination.perPage
    //       || this.oldModel.perPage !== this.pagination.perPage
    //       || this.oldModel.whichPair !== this.whichPair) {
    //     this.oldModel = {
    //       currentPage: (this.pagination.currentPage - 1) * this.pagination.perPage,
    //       perPage: this.pagination.perPage,
    //       whichPair: this.whichPair,
    //     };
    //     try {
    //       const response = await this.$api.getOrderList(this.$route.params.index, (this.pagination.currentPage - 1) * this.pagination.perPage, this.pagination.perPage, this.whichPair);
    //       await ordersHandler.prepareArray(response.result.data);
    //       response.result.data.map((item) => {
    //         item.pair = item.pair.toUpperCase().replace('_', ' / ');
    //         return item;
    //       });
    //       this.pagination.total = response.result.count;
    //       this.tableData = [...response.result.data];
    //       this.busyTable = false;
    //     } catch (e) {
    //       this.$notify({
    //         type: 'danger',
    //         message: e.response.data.message,
    //         icon: 'tim-icons icon-alert-circle-exc',
    //       });
    //     }
    //   }
    //   this.busyTable = false;
    //   this.get = false;
    // },
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
            userId: this.$route.params.index,
          };
          try {
            const response = await this.$api.getOrderList(this.oldModel);
            await ordersHandler.prepareArray(response.result.data);
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
            userId: this.$route.params.index,
          };
          try {
            const response = await this.$api.getOrderList(this.oldModel);
            await ordersHandler.prepareArray(response.result.data);
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
        const response = await this.$api.getOrderList(this.oldModel);
        await ordersHandler.prepareArray(response.result.data);
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
    goBack() {
      this.$store.commit('management/setUserData', '', '');
      this.$router.push('/users-management');
    },
  },
};
</script>

<style lang="scss">
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
.order-history {
  button {
    width: auto;
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
