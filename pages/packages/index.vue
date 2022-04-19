<template>
  <card>
    <div class="flex-container head">
      <h4
        slot="header"
        class="card-title"
      >
        Packages
      </h4>
    </div>
    <div
      class="row"
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
      <div class="col-auto">
        <CurrencyPairAddModal />
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
        v-for="(item, index) in mockCurrencies"
        :key="index"
        class="currencies"
      >
        <div class="currency">
          <div class="on-button">
            <div
              class="on-button__img"
              :class="{ 'on-button__img_active': item.status,'on-button__img_disabled': !item.status }"
              @click="changePairStatus(item)"
            >
              <img
                src="~/static/img/icons/on.svg"
                alt=""
              >
            </div>
            <h4>
              {{ item.name }}
            </h4>
          </div>
          <div class="btns">
            <PackageEdit
              :item="item"
              @updatePackage="updatePackage"
            />
            <PairInfo
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
    </div>
  </card>
</template>

<script>
import DiscountModal from '@/components/ui/discountModal';
import { Option, Select } from 'element-ui';
import CurrencyPairAddModal from '~/components/ui/CurrencyPairAddModal.vue';
import { BasePagination } from '~/components';
import PackageEdit from '~/components/ui/PackageEdit.vue';
import PairInfo from '~/components/ui/PairInfo.vue';
import currencysAndPairs from '~/handlers/currencysAndPairs';

export default {
  middleware: 'auth',
  name: 'Index',
  components: {
    PackageEdit,
    PairInfo,
    DiscountModal,
    CurrencyPairAddModal,
    BasePagination,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  data() {
    return {
      pagination: {
        perPage: 5,
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
      // TODO change
      busyTable: false,
      editModel: {
        currentPage: '',
        perPage: '',
        searchQuery: '',
      },
      mockCurrencies: [{
        name: '7000 HDP',
        status: true,
      },
      {
        name: '10000 HDP',
        status: true,
      },
      {
        name: '12000 HDP',
        status: false,
      }],
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
      this.getPairs();
    },
    searchQuery(newSearchedDate, oldSearchedDate) {
      if (newSearchedDate < oldSearchedDate && newSearchedDate.length < 2 && newSearchedDate.length !== 0) {
        this.pagination.currentPage = 1;
        this.getPairs();
        this.get = true;
      } else if (newSearchedDate.length >= 2) {
        this.pagination.currentPage = 1;
        this.getPairs();
        this.get = true;
      } else if (newSearchedDate === '') {
        this.getPairs();
        this.newTotal = true;
        this.get = true;
      }
    },
    from(value) {
      this.getPairs();
    },
  },
  mounted() {
    // this.getPairs();
  },
  methods: {
    async changePairStatus(pair) {
      try {
        const pairModel = {
          id: pair.id,
          takerFee: pair.takerFee,
          makerFee: pair.makerFee,
          priceMin: pair.settings.price_min,
          priceMax: pair.settings.price_max,
          priceTick: pair.settings.price_tick,
          lotSizeMin: pair.settings.lot_size_min,
          lotSizeMax: pair.settings.lot_size_max,
          lotSizeTick: pair.settings.lot_size_tick,
          fullname: pair.fullName,
          description: pair.description,
          status: '',
        };
        if (pair.status === 1) {
          pairModel.status = 0;
          await this.$api.editPair(pairModel);
          pair.status = 0;
          this.$notify({
            type: 'success',
            message: this.$t('currencyPairsManagement.pairDisabled'),
            icon: 'tim-icons icon-check-2',
          });
        } else if (pair.status === 0) {
          pairModel.status = 1;
          await this.$api.editPair(pairModel);
          pair.status = 1;
          this.$notify({
            type: 'success',
            message: this.$t('currencyPairsManagement.pairEnabled'),
            icon: 'tim-icons icon-check-2',
          });
        }
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
    },
    updatePair(pair) {
      this.tableData.map((item) => {
        if (item.id === pair.id) {
          item.description = pair.description;
          item.fullName = pair.fullname;
          item.takerFee = pair.takerFee;
          item.makerFee = pair.makerFee;
          item.settings.price_min = pair.priceMin;
          item.settings.price_max = pair.priceMax;
          item.settings.price_tick = pair.priceTick;
          item.settings.lot_size_min = pair.lotSizeMin;
          item.settings.lot_size_max = pair.lotSizeMax;
          item.settings.lot_size_tick = pair.lotSizeTick;
        }
        return item;
      });
    },
    async getPairs() {
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
          const response = await this.$api.getAllPairs((this.pagination.currentPage - 1) * this.pagination.perPage, this.pagination.perPage, this.searchQuery);
          await currencysAndPairs.prepareArrayPairs(response.result.data);
          response.result.data.map((item) => {
            item.name = item.name.toUpperCase();
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
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    cursor: pointer;
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
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
