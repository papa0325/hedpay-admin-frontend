<template>
  <card card-body-classes="table-full-width">
    <h4
      slot="header"
      class="card-title"
    >
      {{ $t('management.admins') }}
    </h4>
    <div>
      <div
        class="row"
      >
        <div class="col-3">
          <el-select
            v-model="pagination.perPage"
            class="select-primary pagination-select"
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
              class="search-input"
              prefix-icon="el-icon-search"
              :placeholder="this.$t('management.search')"
              aria-controls="datatables"
              clearable
              maxlength="30"
            />
          </base-input>
        </div>
        <div class="col-auto">
          <AdminAddModal />
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
            min-width="180"
            :label="this.$t('management.table.status')"
          >
            <b-overlay
              slot-scope="{ row }"
              :show="row.isBusyRole"
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block select-busy"
            >
              <el-select
                :id="row.email"
                v-model="row.role"
                :class="{ blocked: row.roleNum === 3 }"
                class="select-primary role-select"
                size="large"
                :placeholder="row.role"
                :disabled="row.roleNum === 3"
                @input="changeRole($event, row)"
              >
                <el-option
                  v-for="option in selects.role"
                  :key="option.label"
                  class="select-primary role-select"
                  :value="option.value"
                  :label="option.label"
                />
              </el-select>
            </b-overlay>
          </el-table-column>
          <el-table-column
            v-for="column in tableColumns"
            :key="column.label"
            :min-width="column.minWidth"
            :prop="column.prop"
            :label="column.label"
          />
          <!--    Таблица с кнопками    -->
          <el-table-column
            :min-width="250"
            align="right"
          >
            <div
              slot-scope="props"
              class="btns"
            >
              <b-overlay
                :show="props.row.isBusyBlock"
                rounded
                opacity="0.6"
                spinner-small
                spinner-variant="primary"
                class="d-inline-block button-busy"
              >
                <base-button
                  v-if="props.row.roleNum !== 3"
                  type="danger"
                  @click="adminStatusChange(props.$index, props.row)"
                >
                  <img
                    src="/img/icons/block.svg"
                    alt=""
                  >
                  <span v-if="props.row.status === 0">
                    {{ $t('management.table.block') }}
                  </span>
                  <span v-if="props.row.status === 1">
                    {{ $t('management.table.unblock') }}
                  </span>
                </base-button>
              </b-overlay>
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
      selects: {
        role: [
          { value: '2', label: this.$t('management.addAdminModal.options.admin') },
          { value: '1', label: this.$t('management.addAdminModal.options.operator') },
        ],
      },
      page: 1,
      pagination: {
        perPage: 10,
        currentPage: 1,
        perPageOptions: [10, 50, 100],
        total: 10,
      },
      searchQuery: '',
      propsToSearch: ['name', 'email', 'age'],
      tableColumns: [
        {
          prop: 'email',
          label: this.$t('management.table.email'),
          minWidth: 250,
        },
        {
          prop: 'firstName',
          label: this.$t('management.table.firstName'),
          minWidth: 150,
        },
        {
          prop: 'lastName',
          label: this.$t('management.table.lastName'),
          minWidth: 150,
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
      },
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
    to(value) {
      this.getAdmins();
    },
    searchQuery(newSearchedDate, oldSearchedDate) {
      if (newSearchedDate < oldSearchedDate && newSearchedDate.length < 2 && newSearchedDate.length !== 0) {
        this.pagination.currentPage = 1;
        this.getAdmins();
        this.get = true;
      } else if (newSearchedDate.length >= 2) {
        this.pagination.currentPage = 1;
        this.getAdmins();
        this.get = true;
      } else if (newSearchedDate === '') {
        this.getAdmins();
        this.newTotal = true;
        this.get = true;
      }
    },
    from(value) {
      this.getAdmins();
    },
  },
  mounted() {
    // this.getAdmins();
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
    async changeRole(e, row) {
      const model = {
        email: row.email,
        newRole: row.role,
      };
      try {
        await this.$api.changeRole(model);
        this.$notify({
          type: 'success',
          message: this.$t('management.actions.roleChange'),
          icon: 'tim-icons icon-check-2',
        });
        row.isBusyRole = false;
      } catch (e) {
        if (row.role === '1') {
          row.role = '2';
        } else if (row.role === '2') {
          row.role = '1';
        }
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
    },
    async getAdmins() {
      this.busyTable = true;
      if (this.oldModel.currentPage !== (this.pagination.currentPage - 1) * this.pagination.perPage
          || this.oldModel.perPage !== this.pagination.perPage
          || this.oldModel.searchQuery !== this.searchQuery) {
        this.oldModel = {
          currentPage: (this.pagination.currentPage - 1) * this.pagination.perPage,
          perPage: this.pagination.perPage,
          searchQuery: this.searchQuery,
        };
        try {
          const localeRoles = ['operator', 'admin', 'super'];
          const response = await this.$api.getAdminList((this.pagination.currentPage - 1) * this.pagination.perPage, this.pagination.perPage, this.searchQuery);
          response.result.users.map((item) => {
            item.roleNum = item.role;
            item.role = this.$t(`management.addAdminModal.options.${localeRoles[item.role - 1]}`);
            return item.role;
          });
          if (this.pagination.total === 10 || this.searchQuery || this.newTotal) {
            this.pagination.total = response.result.count;
            this.newTotal = false;
          }
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
    async adminStatusChange(index, row) {
      row.isBusyBlock = true;
      let message = '';
      const model = {
        adminId: row.id,
        status: row.status,
      };
      try {
        await this.$store.dispatch('management/adminStatusChange', model);
        if (row.status === 0) {
          message = 'blocked';
          row.status = 1;
        } else if (row.status === 1) {
          message = 'unblocked';
          row.status = 0;
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
    deleteRow(row) {
      const indexToDelete = this.tableData.findIndex(
        (tableRow) => tableRow.id === row.id,
      );
      if (indexToDelete >= 0) {
        this.tableData.splice(indexToDelete, 1);
      }
    },
  },
};
</script>
<style lang="scss">
  .table-busy {
    width: 100%;
    height: 100%;
    .bg-light {
      background-color: transparentize($color: #31334B, $amount: 0.2) !important;
    }
  }
.form-group .el-input__inner {
  height: 40px;
}
.role-select input{
  color: rgba(255, 255, 255, 0.7) !important;
  border: none;
  padding: 0;
}
.el-select .el-input.is-disabled .el-input__inner {
  cursor: default;
}
.el-input.is-disabled .el-input__icon {
  cursor: default;
  display: none;
}
</style>
<style lang="scss" scoped>
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
  .unblock {
    button {
      color: black;
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
