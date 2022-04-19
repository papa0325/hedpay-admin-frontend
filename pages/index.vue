<template>
  <div class="row">
    <!-- Stats Cards -->
    <div
      class="col-lg-4 col-md-6"
    >
      <b-overlay
        :show="busyStatsReg"
        rounded
        opacity="0.6"
        spinner-small
        spinner-variant="primary"
        class="d-inline-block stats-card-busy"
      >
        <stats-card
          :title="dashboard.registeredUsers || '0'"
          :sub-title="$t('main.usersCount')"
          :type="'warning'"
          :img="'G'"
        >
          <div
            slot="footer"
            v-html="`<i class='tim-icons icon-refresh-01'></i> ${this.$t('main.usersCountText')}`"
          />
        </stats-card>
      </b-overlay>
    </div>
    <div
      class="col-lg-4 col-md-6"
    >
      <b-overlay
        :show="busyStatsUsers"
        rounded
        opacity="0.6"
        spinner-small
        spinner-variant="primary"
        class="d-inline-block stats-card-busy"
      >
        <stats-card
          :title="dashboard.usersOnline || '0'"
          :sub-title="$t('main.usersOnline')"
          :type="'warning'"
          :img="'P'"
        >
          <div
            slot="footer"
            v-html="`<i class='tim-icons icon-refresh-01'></i> ${this.$t('main.newUsersText')}`"
          />
        </stats-card>
      </b-overlay>
    </div>
    <div
      class="col-lg-4 col-md-6"
    >
      <b-overlay
        :show="busyStatsOnline"
        rounded
        opacity="0.6"
        spinner-small
        spinner-variant="primary"
        class="d-inline-block stats-card-busy"
      >
        <stats-card
          :title="dashboard.usersByPeriod || '0'"
          :sub-title="$t('main.newUsers')"
          :type="'warning'"
          :img="'B'"
        >
          <div
            slot="footer"
            v-html="`<i class='tim-icons icon-refresh-01'></i> ${this.$t('main.newUsersText')}`"
          />
        </stats-card>
      </b-overlay>
    </div>
    <!--    <div-->
    <!--      class="col-lg-3 col-md-6"-->
    <!--    >-->
    <!--      <stats-card-->
    <!--        :title="dashboard.Fee || '0'"-->
    <!--        :sub-title="$t('main.fee')"-->
    <!--        :type="'warning'"-->
    <!--        :img="'O'"-->
    <!--      >-->
    <!--        <div-->
    <!--          slot="footer"-->
    <!--          v-html="`<i class='tim-icons icon-refresh-01'></i> ${this.$t('main.feeText')}`"-->
    <!--        />-->
    <!--      </stats-card>-->
    <!--    </div>-->
    <!-- Big Chart -->
    <div class="col-12">
      <b-overlay
        :show="busyPairsData"
        rounded
        opacity="0.6"
        spinner-small
        spinner-variant="primary"
        class="d-inline-block chart-card-busy"
      >
        <card type="chart">
          <template slot="header">
            <div class="row">
              <div
                class="col-sm-6"
                :class="isRTL ? 'text-right' : 'text-left'"
              >
                <h5 class="card-category">
                  {{ this.$t('main.tradingVolume') }}
                </h5>
              </div>
              <div class="col-sm-6 d-flex d-sm-block change-options">
                <div
                  v-if="currentPairs[0]"
                  class="btn-group btn-group-toggle btn-group-flexed"
                  :class="isRTL ? 'float-left' : 'float-right'"
                  data-toggle="buttons"
                  style="margin-right: 30px"
                >
                  <label
                    v-for="(option, index) in bigLineChartCategories"
                    :id="index"
                    :key="option.name"
                    class="btn btn-sm btn-primary btn-simple"
                    :class="{ active: bigLineChart.activeIndex === index }"
                  >
                    <input
                      type="radio"
                      name="options"
                      autocomplete="off"
                      :checked="bigLineChart.activeIndex === index"
                      @click="initBigChart(index)"
                    >
                    <span class="d-none d-sm-block">{{ option.name }}</span>
                    <span class="d-block d-sm-none">
                      <i :class="option.icon" />
                    </span>
                  </label>
                </div>
                <div
                  v-if="currentPairs[0]"
                  class="pair-change"
                >
                  <el-select
                    v-model="whichPair"
                    class="select-primary pagination-select pair-change-drop"
                    :placeholder="currentPairs[0].name"
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
            </div>
          </template>
          <div class="chart-area">
            <div
              v-if="!currentBigChartData.length && !busyPairsData"
              class="null-data-chart"
            >
              {{ $t('main.nullData') }}
            </div>
            <line-chart
              ref="bigChart"
              style="height: 100%"
              :chart-data="bigLineChart.chartData"
              :gradient-colors="bigLineChart.gradientColors"
              :gradient-stops="bigLineChart.gradientStops"
              :extra-options="bigLineChart.extraOptions"
            />
          </div>
        </card>
      </b-overlay>
    </div>
  </div>
</template>
<script>
import LineChart from '@/components/Charts/LineChart';
import BarChart from '@/components/Charts/BarChart';
import * as chartConfigs from '@/components/Charts/config';
import TaskList from '@/components/Dashboard/TaskList';
import UserTable from '@/components/Dashboard/UserTable';
import CountryMapCard from '@/components/Dashboard/CountryMapCard';
import StatsCard from '@/components/Cards/StatsCard';
import config from '@/config';
import { mapGetters } from 'vuex';
import login from '@/pages/login';
import { Option, Select } from 'element-ui';

const bigChartData = [
  [],
  [],
];
const bigChartLabels = [];
const bigChartDatasetOptions = {
  fill: true,
  borderColor: config.colors.primary,
  borderWidth: 2,
  borderDash: [],
  borderDashOffset: 0.0,
  pointBackgroundColor: config.colors.primary,
  pointBorderColor: 'rgba(255,255,255,0)',
  pointHoverBackgroundColor: config.colors.primary,
  pointBorderWidth: 20,
  pointHoverRadius: 4,
  pointHoverBorderWidth: 15,
  pointRadius: 4,
};

export default {
  name: 'Dashboard',
  middleware: 'auth',
  components: {
    LineChart,
    BarChart,
    StatsCard,
    TaskList,
    CountryMapCard,
    UserTable,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  data() {
    return {
      busyStatsReg: true,
      busyStatsUsers: true,
      busyStatsOnline: true,
      busyPairsData: true,
      currentId: null,
      currentPairs: [],
      whichPair: '',
      dashboard: {
        registeredUsers: '',
        usersOnline: '',
        usersByPeriod: '',
      },
      // Большой чарт
      bigLineChart: {
        activeIndex: 0,
        chartData: {
          datasets: [{
            ...bigChartDatasetOptions,
            data: bigChartData[0],
          }],
          labels: bigChartLabels,
        },
        extraOptions: chartConfigs.purpleChartOptions,
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0],
        categories: [],
      },
      chartDataTest: '',
      currentBigChartData: 0,
    };
  },
  watch: {
    whichPair(value) {
      this.changePair(value);
    },
  },
  computed: {
    ...mapGetters({
      registeredUsers: 'dashboard/getRegisteredUsers',
      usersOnline: 'dashboard/getUsersOnline',
      usersByPeriod: 'dashboard/getUsersByPeriod',
      pairs: 'dashboard/getPairs',
    }),
    enableRTL() {
      return this.$route.query.enableRTL;
    },
    isRTL() {
      return this.$rtl.isRTL;
    },
    bigLineChartCategories() {
      return [
        { name: this.$t('main.total') },
        { name: this.$t('main.count') }];
    },
  },
  async mounted() {
    // TODO add new dashboard items
    // await this.getPairs();
    // await this.getPairsData();
    // await this.getRegisteredUsers();
    // await this.getUsersOnline();
    // await this.getUsersByPeriod();
    this.initBigChart(0);
  },
  methods: {
    async getPairs() {
      try {
        this.currentPairs = await this.$store.dispatch('dashboard/getPairs');
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
    },
    async getPairsData() {
      try {
        this.currentBigChartData = await this.$store.dispatch('dashboard/getBigChartData', this.currentPairs[0].id);
        bigChartData[0].splice(0, bigChartData[0].length);
        bigChartData[1].splice(0, bigChartData[1].length);
        bigChartLabels.splice(0, bigChartLabels.length);
        await this.currentBigChartData.map((item) => {
          bigChartData[0].unshift(item.total);
          bigChartData[1].unshift(item.count);
          const date = item.day.split('/')[1];
          bigChartLabels.unshift(date);
          return item;
        });
        this.currentId = this.currentPairs[0].id;
        this.busyPairsData = false;
      } catch (e) {
        if (e.response) {
          this.$notify({
            type: 'danger',
            message: e.response.data.message,
            icon: 'tim-icons icon-alert-circle-exc',
          });
        }
      }
    },
    async changePair(id) {
      if (id !== this.currentId) {
        this.busyPairsData = true;
        try {
          this.currentBigChartData = await this.$store.dispatch('dashboard/getBigChartData', id);
          bigChartData[0].splice(0, bigChartData[0].length);
          bigChartData[1].splice(0, bigChartData[1].length);
          bigChartLabels.splice(0, bigChartLabels.length);
          await this.currentBigChartData.map((item) => {
            bigChartData[0].unshift(item.total);
            bigChartData[1].unshift(item.count);
            const date = item.day.split('/')[1];
            bigChartLabels.unshift(date);
            return item;
          });
          this.initBigChart(this.bigLineChart.activeIndex);
          this.busyPairsData = false;
        } catch (e) {
          bigChartData[0].splice(0, bigChartData[0].length);
          bigChartData[1].splice(0, bigChartData[1].length);
          this.initBigChart(this.bigLineChart.activeIndex);
          this.$notify({
            type: 'danger',
            message: e.response.data.message,
            icon: 'tim-icons icon-alert-circle-exc',
          });
        }
        this.currentId = id;
      }
    },
    async getRegisteredUsers() {
      try {
        const response = await this.$api.getRegisteredUsers();
        this.dashboard.registeredUsers = response.result.count.toString();
        this.busyStatsReg = false;
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
    },
    async getUsersOnline() {
      try {
        const response = await this.$api.getUsersOnline();
        this.dashboard.usersOnline = response.result.count.toString();
        this.busyStatsUsers = false;
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
    },
    async getUsersByPeriod() {
      try {
        const response = await this.$api.getUsersByPeriod();
        this.dashboard.usersByPeriod = response.result.count.toString();
        this.busyStatsOnline = false;
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: e.response.data.message,
          icon: 'tim-icons icon-alert-circle-exc',
        });
      }
    },
    initBigChart(index) {
      const chartData = {
        datasets: [{
          ...bigChartDatasetOptions,
          data: bigChartData[index],
        }],
        labels: bigChartLabels,
      };
      this.bigLineChart.chartData = chartData;
      this.bigLineChart.activeIndex = index;
    },
  },
};
</script>
<style lang="scss">
  .stats-card-busy {
    width: 100%;
    height: 50px;
    min-height: 102px !important;
    margin-bottom: 30px;
    .bg-light {
      background-color: transparentize($color: #31334B, $amount: 0.2) !important;
    }
  }
  .chart-card-busy {
    width: 100%;
    margin-bottom: 30px;
    .bg-light {
      background-color: transparentize($color: #31334B, $amount: 0.2) !important;
    }
    .card {
      margin-bottom: 0;
    }
  }
  .change-options {
    display: flex !important;
    justify-content: flex-end;
  }
.pair-change-drop {
  width: 100%;
}
.pair-change {
  display: flex !important;
  justify-content: flex-end;
  margin-left: 0;
}
  .btn-group-flexed {
    label {
      display: flex;
      align-items: center;
      height: 40px;
      margin: 0;
    }
  }
  .null-data-chart {
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 60px;
  }
</style>
