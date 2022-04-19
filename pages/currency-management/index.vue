<template>
  <card>
    <h4
      slot="header"
      class="card-title"
    >
      {{ $t('currencyManagement.title') }}
    </h4>
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
    </div>
    <b-overlay
      :show="busyTable"
      rounded
      opacity="0.6"
      spinner-small
      spinner-variant="primary"
      class="d-inline-block table-busy"
    >
      <div
        v-for="(item, index) in queriedData"
        :key="index"
        class="currencies"
      >
        <div class="currency">
          <div class="on-button">
            <!--            <div class="on-button__img">-->
            <!--              <img-->
            <!--                src="~/static/img/icons/on.svg"-->
            <!--                alt=""-->
            <!--              >-->
            <!--            </div>-->
            <h4>
              {{ item.symbol }}
            </h4>
          </div>
          <div class="btns">
            <CurrencyEdit
              :item="item"
              @updateCurrency="updateCurrency"
            />
            <CurrencyInfo
              :item="item"
            />
            <!--            <base-button-->
            <!--              type="danger"-->
            <!--              icon-->
            <!--              class="btn"-->
            <!--            >-->
            <!--              <img-->
            <!--                src="~/static/img/icons/trash.svg"-->
            <!--                alt=""-->
            <!--                style="width: 40%"-->
            <!--              >-->
            <!--            </base-button>-->
          </div>
        </div>
      </div>
    </b-overlay>
    <div
      slot="footer"
      class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap base-footer"
    >
      <base-pagination
        v-model="pagination.currentPage"
        class="pagination-no-border mb-0"
        :per-page="pagination.perPage"
        :total="total"
      />
      <CurrencyAddModal />
    </div>
  </card>
</template>

<script>
import users from '@/util/mock-users';
import CurrencyAddModal from '@/components/ui/CurrencyAddModal.vue';
import WithdrawalFeeModal from '@/components/ui/WithdrawalFeeModal.vue';
import { Option, Select } from 'element-ui';
import { BasePagination } from '~/components';
import CurrencyInfo from '~/components/ui/CurrencyInfo.vue';
import CurrencyEdit from '~/components/ui/CurrencyEdit.vue';
import currencysAndPairs from '~/handlers/currencysAndPairs';

export default {
  middleware: 'auth',
  name: 'CurrencyManagement',
  components: {
    CurrencyAddModal,
    WithdrawalFeeModal,
    BasePagination,
    CurrencyEdit,
    CurrencyInfo,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  data() {
    return {
      pagination: {
        perPage: 10,
        currentPage: 1,
        perPageOptions: [10, 50, 100],
        total: 10,
      },
      tableData: [],
      searchQuery: '',
      searchedData: [],
      oldModel: {
        currentPage: '',
        perPage: '',
        searchQuery: '',
      },
      busyTable: true,
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
      this.getCurrencies();
    },
    searchQuery(newSearchedDate, oldSearchedDate) {
      if (newSearchedDate < oldSearchedDate && newSearchedDate.length < 2 && newSearchedDate.length !== 0) {
        this.pagination.currentPage = 1;
        this.getCurrencies();
        this.get = true;
      } else if (newSearchedDate.length >= 2) {
        this.pagination.currentPage = 1;
        this.getCurrencies();
        this.get = true;
      } else if (newSearchedDate === '') {
        this.getCurrencies();
        this.newTotal = true;
        this.get = true;
      }
    },
    from(value) {
      this.getCurrencies();
    },
  },
  mounted() {
    // this.getCurrencies();
  },
  methods: {
    updateCurrency(pair) {
      this.tableData.map((item) => {
        if (item.id === pair.currencyId) {
          item.address = pair.address;
          item.description = pair.description;
          item.logoURL = pair.logoURL;
          item.title = pair.fullname;
          item.txLimits.maxWithdraw = pair.maxWithdraw;
          item.txLimits.minWithdraw = pair.minWithdraw;
          item.txLimits.withdrawCommissionFixed = pair.withdrawCommissionFixed;
          item.txLimits.withdrawCommissionPercentage = pair.withdrawCommissionPercentage;
        }
        return item;
      });
    },
    async getCurrencies() {
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
          const response = await this.$api.getCurrencies((this.pagination.currentPage - 1) * this.pagination.perPage, this.pagination.perPage, this.searchQuery);
          await currencysAndPairs.prepareArrayCurrencies(response.result.data);
          response.result.data.map((item) => {
            item.symbol = item.symbol.toUpperCase();
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
      this.busyTable = false;
      this.get = false;
    },
    changePerPage() {
      this.pagination.currentPage = 1;
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
</style>
<style lang="scss" scoped>
.on-button {
  display: flex;
  align-items: center;
  &__img {
    width: 50px;
    padding: 15px;
    &_active {
      background-color: #42B883;
    }
    &_disabled {
      background-color: #393B52;
    }
  }
  h4 {
    margin-left: 20px !important;
  }
}
.base-footer {
  align-items: center;
}
.mb-0 {
  margin-bottom: 0;
}
.currency {
  background-color: #2E3044;
  padding: 0 25px 0 0;
  border-radius: 4px;
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  h4 {
    margin: 0;
    font-size: 16px;
  }
  .btns {
    width: 90px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.col-3 {
  .el-select {
    display: block;
  }
}
@media (max-width: 576px) {
  .currency {
    padding: 0 10px 0 10px;
    h3 {
      font-size: 18px;
    }
  }
}
</style>
