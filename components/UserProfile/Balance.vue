<template>
  <div class="">
    <div>
      <div
        class="row justify-content-between"
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
          <base-checkbox
            v-model="hideZerosCheck"
            class="zero-balance mb-3"
            name="zero-balance"
          >
            {{ $t('management.user-info.balance.hide') }}
          </base-checkbox>
        </div>
        <div class="col-3">
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
            v-model="currentType"
            class="select-primary mb-3 pagination-select"
            @change="changePerPage()"
          >
            <el-option
              v-for="item in type"
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
            sortable="custom"
            :min-width="column.minWidth"
            :prop="column.prop"
            :label="column.label"
          />
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
        :total="total"
      />
    </div>
  </div>
</template>

<script>
import {
  Option, Select, Table, TableColumn,
} from 'element-ui';
import { BasePagination } from '~/components';
import balancesHandler from '~/handlers/balances';
import ordersHandler from '~/handlers/orders';

export default {
  name: 'Balance',
  components: {
    BasePagination,
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      hideZerosCheck: true,
      busyTable: true,
      page: 1,
      pagination: {
        perPage: 10,
        currentPage: 1,
        perPageOptions: [10, 50, 100],
        total: 10,
      },
      currentType: 'All types',
      type: [
        { value: 'All types', label: this.$t('management.user-info.balance.allTypes') },
        { value: 'crypto', label: this.$t('management.user-info.balance.crypto') },
        { value: 'cryptoasfiat', label: this.$t('management.user-info.balance.cryptoasfiat') },
      ],
      searchQuery: '',
      propsToSearch: ['name', 'email'],
      tableColumns: [
        {
          prop: 'symbol',
          label: this.$t('management.user-info.balance.currency'),
          minWidth: 150,
        },
        {
          prop: 'balance',
          label: this.$t('management.user-info.balance.balance'),
          minWidth: 200,
        },
        {
          prop: 'address',
          label: this.$t('management.user-info.balance.wallet'),
          minWidth: 400,
        },
        {
          prop: 'type',
          label: this.$t('management.user-info.balance.type'),
          minWidth: 200,
        },
      ],
      tableData: [],
      searchedData: [],
      fuseSearch: null,
      get: false,
      newTotal: false,
      whichSorted: null,
      sortedMethod: null,
      oldModel: {
        currentPage: '',
        perPage: '',
        whichSorted: '',
        sortedMethod: '',
      },
      noZerosArray: [],
      zerosArray: [],
    };
  },
  computed: {
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
    currentType(value) {
      this.getBalances();
    },
    searchQuery(newSearchedDate, oldSearchedDate) {
      if (newSearchedDate < oldSearchedDate && newSearchedDate.length < 2 && newSearchedDate.length !== 0) {
        this.pagination.currentPage = 1;
        this.getBalances();
        this.get = true;
      } else if (newSearchedDate.length >= 1) {
        this.pagination.currentPage = 1;
        this.getBalances();
        this.get = true;
      } else if (newSearchedDate === '') {
        this.getBalances();
        this.newTotal = true;
        this.get = true;
      }
    },
    to(value) {
      this.getBalances();
    },
    hideZerosCheck(value) {
      this.hideZeros();
    },
    from(value) {
      if (!this.get) {
        this.getBalances();
      }
    },
  },
  async mounted() {
    await this.getBalances();
  },
  methods: {
    async sortTable(sorted) {
      this.whichSorted = sorted.prop;
      if (sorted.order === null) {
        this.whichSorted = '';
        this.sortedMethod = sorted.order;
        await this.getBalances();
      } else if (sorted.order === 'ascending') {
        this.sortedMethod = 'ASC';
        await this.getBalances();
      } else if (sorted.order === 'descending') {
        this.sortedMethod = 'DESC';
        await this.getBalances();
      }
    },
    changePerPage() {
      this.pagination.currentPage = 1;
    },
    async hideZeros() {
      if (this.hideZerosCheck === true) {
        this.tableData = [...this.noZerosArray];
      } else if (this.hideZerosCheck === false) {
        this.tableData = [...this.zerosArray];
      }
    },
    async getBalances() {
      this.busyTable = true;
      if (this.oldModel.currentPage !== (this.pagination.currentPage - 1) * this.pagination.perPage
          || this.oldModel.perPage !== this.pagination.perPage
          || this.oldModel.whichSorted !== this.whichSorted
          || this.oldModel.whichSorted !== this.sortedMethod
          || this.oldModel.searchQuery !== this.searchQuery
          || this.oldModel.currentType !== this.currentType) {
        this.oldModel = {
          currentPage: (this.pagination.currentPage - 1) * this.pagination.perPage,
          perPage: this.pagination.perPage,
          whichSorted: this.whichSorted,
          sortedMethod: this.sortedMethod,
          searchQuery: this.searchQuery,
          currentType: this.currentType,
          userId: this.$route.params.index,
        };
        try {
          const response = await this.$api.getBalances(this.oldModel);
          await balancesHandler.prepareArray(response.result.data);
          response.result.data.map((item) => {
            item.symbol = item.symbol.toUpperCase();
            this.noZerosArray = [];
            if (item.balance !== 0) {
              this.noZerosArray.push(item);
            }
            return item;
          });
          this.zerosArray = [];
          this.zerosArray = response.result.data;
          this.pagination.total = response.result.count;
          await this.hideZeros();
          this.busyTable = false;
        } catch (e) {
          this.$notify({
            type: 'danger',
            message: e.response.data.message,
            icon: 'tim-icons icon-alert-circle-exc',
          });
        }
      }
      this.busyTable = false;
      this.get = false;
    },
  },
};
</script>

<style lang="scss">
.zero-balance {
  display: flex;
  align-items: center;
  label {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 25px !important;
    color: #FFFFFF;
    span:before {
      width: 24px !important;
      height: 24px !important;
    }
    span:after {
      margin-top: 0 !important;
      width: 24px !important;
      height: 24px !important;
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
</style>

<style scoped lang="scss">
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
}
.btns {
  display: flex;
  justify-content: flex-end;
  img {
    margin-right: 2px;
  }
  button {
    padding: 11px 10px;
  }
}
.mrg-r {
  margin-left: 20px;
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
