<template>
  <div class="content">
    <markdown-editor
      v-if="selectedMarkdown !== null"
      :markdown-data="selectedMarkdown"
      :language="selectedLang"
      @backToList="backToList"
    />
    <b-overlay
      v-else
      :variant="'transparent'"
      :blur="'5px'"
      :opacity="1"
      rounded="sm"
      :show="isLoading"
    >
      <card

        card-body-classes="table-full-width"
      >
        <h4
          slot="header"
          class="card-title"
        >
          {{ $t('faq-editor.faq') }}
        </h4>
        <div>
          <div
            class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap pad"
          >
            <base-button
              :class="{'disabled-component': role !== (3 || 2)}"
              type="primary"
              @click="add()"
            >
              {{ $t('faq-editor.add') }}
            </base-button>
            <div class="d-flex">
              <el-select
                v-model="pagination.perPage"
                class="select-primary pagination-select pr-2"
                placeholder="Per page"
              >
                <el-option
                  v-for="item in pagination.perPageOptions"
                  :key="item"
                  class="select-primary"
                  :label="item"
                  :value="item"
                />
              </el-select>

              <!--            <base-input>-->
              <!--              <el-input-->
              <!--                v-model="searchQuery"-->
              <!--                type="search"-->
              <!--                class="search-input"-->
              <!--                clearable-->
              <!--                prefix-icon="el-icon-search"-->
              <!--                placeholder="Search records"-->
              <!--                aria-controls="datatables"-->
              <!--              />-->
              <!--            </base-input>-->
            </div>
          </div>
          <el-table :data="queriedData">
            <el-table-column
              :label="$t('faq-editor.tableTitle')"
            >
              <div slot-scope="{ row }">
                <span
                  v-for="(lang, i) in langs"
                  :key="`edit-title-${lang}`"
                >
                  <span>
                    {{ row.data[lang].title }}
                  </span>
                  <span v-if="i !== langs.length - 1">
                    /
                  </span>
                </span>
              </div>
            </el-table-column>
            <el-table-column
              :min-width="135"
              align="right"
              :label="$t('faq-editor.tableActions')"
            >
              <div slot-scope="props">
                <base-button
                  v-for="lang in langs"
                  :key="`edit-btn-${lang}`"
                  :class="{'disabled-component': role !== (3 || 2)}"
                  size="sm"
                  class="ml-1 mr-1"
                  @click="selectMarkDown(lang, props)"
                >
                  <i class="tim-icons icon-pencil" />
                  {{ lang.toLocaleUpperCase() }}
                </base-button>
                <base-button
                  :class="{'disabled-component': role !== (3 || 2)}"
                  class="remove btn-link"
                  type="danger"
                  size="sm"
                  icon
                  @click.native="clickDelete(props.row)"
                >
                  <i class="tim-icons icon-simple-remove" />
                </base-button>
              </div>
            </el-table-column>
          </el-table>
        </div>
        <div
          slot="footer"
          class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
        >
          <base-pagination
            v-model="pagination.currentPage"
            class="pagination-no-border"
            :per-page="pagination.perPage"
            :total="total"
          />
        </div>
      </card>
    </b-overlay>
  </div>
</template>
<script>
import {
  Table, TableColumn, Select, Option,
} from 'element-ui';
import { BasePagination } from '@/components';
import Fuse from 'fuse.js';
import swal from 'sweetalert2';

import MarkdownEditor from '@/components/MarkdownEditor';
import { mapGetters } from 'vuex';

export default {
  name: 'Paginated',
  middleware: 'auth',
  components: {
    BasePagination,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    MarkdownEditor,
  },
  async asyncData({ store }) {
    await store.dispatch('markdown/fetchAllMarkdownItems');
  },
  data() {
    return {
      isLoading: true,
      selectedKey: null,
      selectedLang: null,
      selectedMarkdown: null,
      langs: [
        'en',
        'ru',
      ],
      pagination: {
        perPage: 5,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: 0,
      },
      searchQuery: '',
      propsToSearch: ['title'],
      tableColumns: [
        {
          prop: 'title',
          label: 'Title',
          minWidth: 200,
        },
      ],
      searchedData: [],
      fuseSearch: null,
    };
  },
  computed: {
    ...mapGetters({
      getAllMarkdownItems: 'markdown/getAllMarkdownItems',
      role: 'user/userRole',
    }),
    tableData() {
      return this.getAllMarkdownItems;
    },
    queriedData() {
      let result = this.tableData;
      if (this.searchedData.length > 0) {
        result = this.searchedData;
      }
      return result.slice(this.from, this.to);
    },
    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.total < highBound) {
        highBound = this.total;
      }
      return highBound;
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    total() {
      return this.searchedData.length > 0
        ? this.searchedData.length
        : this.tableData.length;
    },
  },
  watch: {
    searchQuery(value) {
      let result = this.tableData;
      if (value !== '') {
        result = this.fuseSearch.search(this.searchQuery);
      }
      this.searchedData = result;
    },
  },
  mounted() {
    this.isLoading = false;
    // Fuse search initialization.
    this.fuseSearch = new Fuse(this.tableData, {
      keys: ['title'],
      threshold: 0.3,
    });
  },
  methods: {
    clearSelect() {
      this.selectedMarkdown = null;
      this.selectedLang = null;
    },
    backToList() {
      this.clearSelect();
    },
    selectMarkDown(lang, item) {
      this.selectedMarkdown = item.row;
      this.selectedLang = lang;
    },
    async add() {
      const { value: formValues } = await swal.fire({
        title: this.$t('faq-editor.modal.enterFaqName'),
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="En">'
            + '<input id="swal-input2" class="swal2-input" placeholder="Ru">',
        focusConfirm: false,
        preConfirm: () => [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
        ],
      });
      if (formValues) {
        if (formValues[0] && formValues[1]) {
          this.isLoading = true;
          await this.$store.dispatch('markdown/createMarkdown', {
            en: formValues[0],
            ru: formValues[1],
          });
          await this.$store.dispatch('markdown/fetchAllMarkdownItems');
          this.isLoading = false;
          swal.fire('Success');
        } else {
          this.$notify({
            type: 'danger',
            message: this.$t('transactions.modals.null'),
            icon: 'tim-icons icon-alert-circle-exc',
          });
        }
      }
    },
    async clickDelete(item) {
      swal({
        title: this.$t('faq-editor.modal.sure'),
        text: this.$t('faq-editor.modal.notRevert'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success btn-fill',
        cancelButtonClass: 'btn btn-danger btn-fill',
        confirmButtonText: this.$t('faq-editor.modal.deleteIt'),
        cancelButtonText: this.$t('faq-editor.modal.cancel'),
        buttonsStyling: false,
      }).then(async (result) => {
        if (result.value) {
          this.isLoading = true;
          await this.$store.dispatch('markdown/deleteMarkdown', item.id);
          await this.$store.dispatch('markdown/fetchAllMarkdownItems');
          this.isLoading = false;
          swal({
            title: this.$t('faq-editor.modal.deleted'),
            text: `${this.$t('faq-editor.modal.deleteSuccess')} ${item.data.en.title}`,
            type: 'success',
            confirmButtonClass: 'btn btn-success btn-fill',
            buttonsStyling: false,
          });
        }
      });
    },
  },
};
</script>
<style lang="scss">
  .disabled-component {
    opacity: 0.3;
    pointer-events: none;
  }
  .pad {
    padding: 0;
    align-items: center;
  }
</style>
<style scoped lang="scss">
.pagination-select,
.search-input {
  width: 200px;
}
</style>
