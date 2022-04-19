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
              {{ $d((row.timestamp), 'long') }}
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
  Option, Select, Table, TableColumn,
} from 'element-ui';
import { mapGetters } from 'vuex';
import { BasePagination } from '~/components';
import ordersHandler from '~/handlers/orders';

export default {
  name: 'Logs',
  components: {
    BasePagination,
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
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
          prop: 'type',
          label: this.$t('management.user-info.loginLogs.table.type'),
          minWidth: 120,
        },
        {
          prop: 'usedIP',
          label: this.$t('management.user-info.loginLogs.table.usedIP'),
          minWidth: 150,
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
    to(value) {
      this.getLogs();
    },
    from(value) {
      this.getLogs();
    },
  },
  async mounted() {
    await this.getLogs();
  },
  methods: {
    changePerPage() {
      this.pagination.currentPage = 1;
    },
    async getLogs() {
      this.busyTable = true;
      if (this.oldModel.currentPage !== (this.pagination.currentPage - 1) * this.pagination.perPage
          || this.oldModel.perPage !== this.pagination.perPage) {
        this.oldModel = {
          currentPage: (this.pagination.currentPage - 1) * this.pagination.perPage,
          perPage: this.pagination.perPage,
        };
        try {
          const response = await this.$api.getLogs(this.$route.params.index, (this.pagination.currentPage - 1) * this.pagination.perPage, this.pagination.perPage);
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
      this.busyTable = false;
      this.get = false;
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
