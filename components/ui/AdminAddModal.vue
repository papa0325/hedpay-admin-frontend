<template>
  <div class="admin-add-modal">
    <base-button
      id="add-admin-button"
      class="btn"
      type="primary"
      data-toggle="modal"
      data-target="#addAdminModal"
      @click="openAdminModal()"
    >
      {{ $t('management.addAdmin') }}
    </base-button>
    <modal
      id="addAdminModal"
      :show.sync="adminAddModalVisible"
      class="modal-black modal show"
      :centered="false"
      :show-close="true"
      :modal-classes="'modal-sm'"
      @close="closeModal"
    >
      <h4
        slot="header"
        class="card-title"
      >
        {{ $t('management.addAdminModal.title') }}
      </h4>
      <form @submit.prevent>
        <div>
          <base-input
            v-model.trim="model.email"
            v-validate="'required|email'"
            name="email"
            :error="getError('email')"
            :placeholder="$t('login.email')"
          />
          <div class="row mt-3">
            <div class="col">
              <el-select
                v-model="selects.simple"
                class="select-primary"
                size="large"
                :placeholder="$t('management.addAdminModal.options.role')"
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
            </div>
            <div class="col">
              <b-overlay
                :show="busyAdd"
                rounded
                opacity="0.6"
                spinner-small
                spinner-variant="primary"
                class="d-inline-block button-add-busy"
              >
                <base-button
                  class="admin-add-modal-button"
                  native-type="submit"
                  type="primary"
                  @click="addAdmin(selects.simple)"
                >
                  {{ $t('management.addAdminModal.addButton') }}
                </base-button>
              </b-overlay>
            </div>
          </div>
        </div>
      </form>
    </modal>
  </div>
</template>
<script>
import { Modal } from '@/components';
import { Select, Option } from 'element-ui';
import login from '@/pages/login';

export default {
  name: 'AdminAddModal',
  components: {
    Modal,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  data() {
    return {
      busyAdd: false,
      adminAddModalVisible: false,
      sm: 'sm',
      selects: {
        role: [
          { value: '2', label: this.$t('management.addAdminModal.options.admin') },
          { value: '1', label: this.$t('management.addAdminModal.options.operator') },
        ],
      },
      model: {
        email: '',
        role: '',
      },
    };
  },
  computed: {
    whichRole() {
      return Option.computed.currentValue();
    },
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
    async openAdminModal() {
      this.adminAddModalVisible = true;
      await this.$validator.errors.clear();
    },
    async closeModal() {
      this.model = {
        email: '',
        role: '',
      };
      this.selects.simple = '';
      await this.$validator.errors.clear();
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async addAdmin(role) {
      const isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        this.busyAdd = true;
        this.model.role = role;
        const { model } = this;
        if (model.role && model.email) {
          try {
            await this.$api.addAdmin(model);
            this.adminAddModalVisible = false;
            this.$notify({
              type: 'success',
              message: this.$t('management.addAdminModal.successMessage'),
              icon: 'tim-icons icon-check-2',
            });
            this.model = {
              email: '',
              role: '',
            };
            this.selects.simple = '';
          } catch (e) {
            this.$notify({
              type: 'danger',
              message: e.response.data.message,
              icon: 'tim-icons icon-alert-circle-exc',
            });
          }
        } else {
          this.$notify({
            type: 'danger',
            message: this.$t('management.addAdminModal.nullRole'),
            icon: 'tim-icons icon-alert-circle-exc',
          });
        }
      }
      this.busyAdd = false;
    },
  },
};
</script>

<style scoped lang="scss">
  .button-add-busy {
    width: 100%;
  }
.admin-add-modal-button {
  width: 100%;
}
btn {
  margin: 0;
}
.admin-add-modal {
  button {
    margin: 0;
  }
}
.col {
  button {
    margin: 0;
    border-radius: 0.25rem;
  }
}
</style>
