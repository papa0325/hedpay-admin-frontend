<template>
  <card card-body-classes="table-full-width">
    <h4
      slot="header"
      class="card-title"
    >
      {{ $t('management.users') }}
    </h4>
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
            v-model="banned"
            class="select-primary mb-3 pagination-select"
            placeholder="Per page"
            @change="changePerPage()"
          >
            <el-option
              v-for="item in banneds"
              :key="item.label"
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
            min-width="180"
            :label="$t('management.table.activity')"
            align="center"
            header-align="center"
          >
            <div
              slot-scope="{ row }"
              class="verified"
            >
              <div
                class=""
              >
                <label
                  v-if="row.status === 2"
                  class="verified-true"
                >
                  {{ $t('management.table.active') }}
                </label>
                <label
                  v-if="row.status === 3"
                  class="verified-failed"
                >
                  {{ $t('management.table.banned') }}
                </label>
              </div>
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
              <div
                v-if="row.document"
                class=""
              >
                <label
                  v-if="row.document.status === 'completed' && row.document.result === 'GREEN'"
                  class="verified-true"
                >
                  {{ $t('management.table.verified') }}
                </label>
                <label
                  v-if="row.document.status !== 'completed'"
                  class="verified-false"
                >
                  {{ $t('management.table.unverified') }}
                </label>
              </div>
              <div
                v-if="!row.document"
                class=""
              >
                <label
                  class="verified-false"
                >
                  {{ $t('management.table.unverified') }}
                </label>
              </div>
            </div>
          </el-table-column>
          <el-table-column
            :min-width="160"
            align="right"
          >
            <div
              slot-scope="props"
              class="btns"
            >
              <NuxtLink
                class="mrg-r"
                :to="`/users-management/user-info/${props.row.id}`"
              >
                <base-button
                  type="primary"
                >
                  {{ $t('management.table.userInfo') }}
                </base-button>
              </NuxtLink>
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
        :total="total"
      />
    </div>
  </card>
</template>

<script>
import {
  Select, Option, Table, TableColumn,
} from 'element-ui';
import { BasePagination } from '@/components';
import Fuse from 'fuse.js';
import AdminAddModal from '~/components/ui/AdminAddModal.vue';

export default {
  middleware: 'auth',
  name: 'Management',
  components: {
    AdminAddModal,
    BasePagination,
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      busyTable: true,
      page: 1,
      banned: 'All users',
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
          prop: 'username',
          label: this.$t('management.table.login'),
          minWidth: 250,
        },
        {
          prop: 'email',
          label: this.$t('management.table.email'),
          minWidth: 250,
        },
        {
          prop: 'phone',
          label: this.$t('management.table.phone'),
          minWidth: 200,
        },
        {
          prop: 'country',
          label: this.$t('management.table.country'),
          minWidth: 100,
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
        searchQuery: '',
        banned: '',
      },
      banneds: [
        { value: 'All users', label: this.$t('management.table.allUsers'), active: true },
        { value: '3', label: this.$t('management.table.blockedUsers') },
        { value: '2', label: this.$t('management.table.activeUsers') },
      ],
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
    banned(value) {
      this.getUsers();
    },
    to(value) {
      this.getUsers();
    },
    searchQuery(newSearchedDate, oldSearchedDate) {
      if (newSearchedDate < oldSearchedDate && newSearchedDate.length < 2 && newSearchedDate.length !== 0) {
        this.pagination.currentPage = 1;
        this.getUsers();
        this.get = true;
      } else if (newSearchedDate.length >= 2) {
        this.pagination.currentPage = 1;
        this.getUsers();
        this.get = true;
      } else if (newSearchedDate === '') {
        this.getUsers();
        this.newTotal = true;
        this.get = true;
      }
    },
    from(value) {
      this.getUsers();
    },
  },
  mounted() {
    this.getUsers();
    // Fuse search initialization.
    this.fuseSearch = new Fuse(this.tableData, {
      keys: ['name', 'email'],
      threshold: 0.3,
    });
  },
  methods: {
    changePerPage() {
      this.pagination.currentPage = 1;
    },
    async getUsers() {
      this.busyTable = true;
      if (this.oldModel.currentPage !== (this.pagination.currentPage - 1) * this.pagination.perPage
          || this.oldModel.perPage !== this.pagination.perPage
          || this.oldModel.searchQuery !== this.searchQuery
          || this.oldModel.banned !== this.banned) {
        this.oldModel = {
          currentPage: (this.pagination.currentPage - 1) * this.pagination.perPage,
          perPage: this.pagination.perPage,
          searchQuery: this.searchQuery,
          banned: this.banned,
        };
        try {
          const response = await this.$api.getUserList(this.oldModel);
          this.pagination.total = response.result.count;
          this.tableData = [...response.result.users];
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
    async userStatusChange(index, row) {
      row.isBusyBlock = true;
      let message = '';
      const model = {
        email: row.id,
        isBlocked: row.isBlocked,
      };
      try {
        await this.$store.dispatch('management/userStatusChange', model);
        if (!row.isBlocked) {
          message = 'blocked';
          row.isBlocked = true;
        } else if (row.isBlocked) {
          message = 'unblocked';
          row.isBlocked = false;
        }
        this.$notify({
          type: 'success',
          message: this.$t(`management.actions.${message}`),
          icon: 'tim-icons icon-check-2',
        });
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
      row.isBusyBlock = false;
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
