<template>
  <div class="add-modal">
    <base-button
      id="pair-info"
      type="info"
      icon
      class="btn"
      data-toggle="modal"
      data-target="#pairInfo"
      @click="openModal()"
    >
      <img
        src="~/static/img/icons/eye.svg"
        alt=""
        style="width: 100%"
      >
    </base-button>
    <modal
      id="PairInfo"
      :show.sync="PairInfo"
      class="modal-black modal show"
      :centered="false"
      :show-close="true"
      :modal-classes="'modal-md fix-height'"
    >
      <h4
        slot="header"
        class="card-title"
      >
        {{ $t('currencyManagement.currencyAddModal.infoTitle') }}
      </h4>
      <div class="pair-info">
        <div class="pair-info__item">
          <h5>{{ $t('currencyManagement.currencyAddModal.ticker') }}</h5>
          <h4>{{ item.symbol }}</h4>
        </div>
        <div class="break-line" />
        <div class="pair-info__item">
          <h5>{{ $t('currencyManagement.currencyAddModal.fullName') }}</h5>
          <h4>{{ item.title }}</h4>
        </div>
        <div class="break-line" />
        <div class="pair-info__item">
          <h5>{{ $t('currencyManagement.currencyAddModal.description') }}</h5>
          <h4>{{ item.description }}</h4>
        </div>
        <div class="break-line" />

        <div class="pair-info__item">
          <h5>ID</h5>
          <h4>{{ item.id }}</h4>
        </div>
        <div class="break-line" />
        <div class="pair-info__item">
          <h5>{{ $t('currencyManagement.currencyAddModal.address') }}</h5>
          <h4>{{ item.address }}</h4>
        </div>
        <div class="break-line" />
        <div class="pair-info__item">
          <h5>{{ $t('currencyManagement.currencyAddModal.blockChain') }}</h5>
          <h4>{{ item.blockChain }}</h4>
        </div>
        <div class="break-line" />
        <div class="pair-info__item">
          <h5>{{ $t('currencyManagement.currencyAddModal.logoURL') }}</h5>
          <h4>{{ item.logoURL }}</h4>
        </div>
        <div class="break-line" />
        <div class="pair-info__item">
          <h5>{{ $t('currencyManagement.currencyAddModal.decimals') }}</h5>
          <h4>{{ item.decimals }}</h4>
        </div>
        <div
          v-if="item.txLimits"
          class="break-line"
        />
        <div
          v-if="item.txLimits"
          class="pair-info__item"
        >
          <h5>{{ $t('currencyManagement.currencyAddModal.maxWithdraw') }}</h5>
          <h4>{{ item.txLimits.maxWithdraw }}</h4>
        </div>
        <div
          v-if="item.txLimits"
          class="break-line"
        />
        <div
          v-if="item.txLimits"
          class="pair-info__item"
        >
          <h5>{{ $t('currencyManagement.currencyAddModal.minWithdraw') }}</h5>
          <h4>{{ item.txLimits.minWithdraw }}</h4>
        </div>
        <div
          v-if="item.txLimits"
          class="break-line"
        />
        <div
          v-if="item.txLimits"
          class="pair-info__item"
        >
          <h5>{{ $t('currencyManagement.currencyAddModal.withdrawCommissionFixed') }}</h5>
          <h4>{{ item.txLimits.withdrawCommissionFixed }}</h4>
        </div>
        <div
          v-if="item.txLimits"
          class="break-line"
        />
        <div
          v-if="item.txLimits"
          class="pair-info__item"
        >
          <h5>{{ $t('currencyManagement.currencyAddModal.withdrawCommissionPercentage') }}</h5>
          <h4>{{ item.txLimits.withdrawCommissionPercentage }}</h4>
        </div>
      </div>
      <div class="btns">
        <base-button
          class="btn"
          type="primary"
          @click="PairInfo = false"
        >
          {{ $t('currencyManagement.currencyAddModal.closeButton') }}
        </base-button>
      </div>
    </modal>
  </div>
</template>

<script>
import { Modal } from '@/components';

export default {
  name: 'CurrencyInfo',
  components: {
    Modal,
  },
  props: {
    item: {
      type: Object,
    },
  },
  data() {
    return {
      PairInfo: false,
      name: '',
    };
  },
  watch: {
    show(val) {
      const documentClasses = document.body.classList;
      if (val) {
        documentClasses.add('modal-open');
        this.$nextTick(this.scrollModalToBottom);
      } else {
        documentClasses.remove('modal-open');
      }
    },
  },
  methods: {
    async openModal() {
      this.PairInfo = true;
    },
  },
};
</script>
<style lang="scss">
.fix-height {
  margin-top: 5%;
  transform: translate(0, 0) !important;
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
.break-line {
  border-bottom: 1px solid #2B3553;
  margin: 10px 0;
}
.pair-info {
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h5 {
      margin: 0;
      font-size: 16px;
      line-height: 20px;
      color: #FFFFFF;
      opacity: 0.3;
      font-style: normal;
      font-weight: normal;
    }
    h4 {
      font-size: 16px;
      line-height: 20px;
      color: #FFFFFF;
      font-weight: 500;
      margin: 0;
    }
  }
}
.pair-add-modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  &_item {
    display: flex;
    margin-bottom: 20px;
  }
  button {
    margin: 0 15px;
    height: 40px;
  }
}
.form-group {
  margin: 0;
  width: 100%;
}
.btns {
  display: flex;
  button {
    margin-top: 20px;
    width: 100%;
  }
}
btn {
  margin: 0;
}
.add-modal {
  display: flex;
  justify-content: flex-end;
  margin-top: 0;
  img {
    margin-right: 5px;
  }
  button {
    margin: 0;
    padding: 5px;
    img {
      margin: 0;
    }
  }
}
.col {
  button {
    margin: 0;
    border-radius: 0.25rem;
  }
}
</style>
