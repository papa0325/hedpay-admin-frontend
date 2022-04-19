<template>
  <div class="add-modal">
    <base-button
      id="add-withdrawal"
      type="primary"
      icon
      class="btn"
      data-toggle="modal"
      data-target="#addWithdrawal"
      @click="WithdrawalAddModalVisible = true"
    >
      <i class="tim-icons icon-settings-gear-63" />
    </base-button>
    <modal
      id="addWithdrawal"
      :show.sync="WithdrawalAddModalVisible"
      class="modal-black modal show"
      :centered="false"
      :show-close="true"
      :modal-classes="'modal-md'"
    >
      <h4
        slot="header"
        class="card-title"
      >
        {{ $t('currencyManagement.withdrawalFeeModal.title') }}
      </h4>
      <form @submit.prevent>
        <el-select
          v-model="selects.simple"
          class="select-primary"
          size="large"
          :placeholder="$t('currencyManagement.withdrawalFeeModal.currencyName')"
        >
          <el-option
            v-for="option in selects.role"
            :key="option.label"
            class="select-primary"
            :value="option.value"
            :label="option.label"
            @click="model.role = option.value"
          />
        </el-select>
        <base-input
          class="withdraw__input"
          :placeholder="$t('currencyManagement.withdrawalFeeModal.commission')"
        />
        <div class="btns">
          <base-button
            class="btn"
            type="primary"
            @click="WithdrawalAddModalVisible = false"
          >
            {{ $t('currencyManagement.currencyAddModal.closeButton') }}
          </base-button>
          <base-button
            class="btn"
            type="primary"
          >
            {{ $t('currencyManagement.currencyAddModal.addButton') }}
          </base-button>
        </div>
      </form>
    </modal>
  </div>
</template>

<script>
import { Modal } from '@/components';
import { Option, Select } from 'element-ui';

export default {
  name: 'WithdrawalFeeModal',
  components: {
    Modal,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  data() {
    return {
      WithdrawalAddModalVisible: false,
      selects: {
        role: [
          { value: '1', label: this.$t('management.addAdminModal.options.first') },
          { value: '2', label: this.$t('management.addAdminModal.options.second') },
        ],
      },
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
};
</script>

<style scoped lang="scss">
  .select-primary {
    width: 100%;
    margin-bottom: 20px;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .admin-add-modal-button {
    width: 100%;
  }
  btn {
    margin: 0;
  }
  .add-modal {
    display: flex;
    justify-content: flex-end;
    img {
      margin-right: 5px;
    }
    button {
      margin: 0;
      padding: 15px 10px;
      i {
        font-size: 25px !important;
        padding: 0 !important;
      }
    }
  }
  .col {
    button {
      margin: 0;
      border-radius: 0.25rem;
    }
  }
  .withdraw__input {
    margin-bottom: 70px;
  }
  @media (max-width: 380px) {
    .card-title {
      width: 200px;
      margin-bottom: 0;
    }
  }
</style>
