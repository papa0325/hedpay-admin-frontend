<template>
  <b-overlay
    :variant="'transparent'"
    :blur="'5px'"
    :opacity="1"
    rounded="sm"
    :show="isLoading"
  >
    <card class="mb-0">
      <div class="pb-4 d-flex justify-content-between">
        <div>
          <base-button
            type="primary"
            @click="$emit('backToList')"
          >
            <i class="tim-icons icon-minimal-left" />
            {{ $t('faq-editor.editor.back') }}
          </base-button>
        </div>
        <base-button
          type="info"
          @click="save()"
        >
          <i class="tim-icons icon-check-2" />
          {{ $t('faq-editor.editor.save') }}
        </base-button>
      </div>
      <div class="pb-3">
        <h4>
          {{ $t('faq-editor.editor.selectedLanguage') }} {{ language }}
        </h4>
        <el-input
          v-model="markdownDataLocal.data[language].title"
          type="text"
        />
      </div>
      <div class="row markdown">
        <div class="col-6">
          <div class="markdown__editor">
            <vue-simplemde v-model="markdownDataLocal.data[language].body" />
          </div>
        </div>
        <div class="col-6">
          <div class="markdown__content">
            <vue-markdown
              :html="false"
              :source="markdownDataLocal.data[language].body"
            />
          </div>
        </div>
      </div>
    </card>
  </b-overlay>
</template>
<script>
import VueMarkdown from 'vue-markdown';
import swal from 'sweetalert2';

export default {
  components: {
    VueMarkdown,
  },
  props: {
    markdownData: {
      type: Object,
      default: () => {},
    },
    language: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    markdownDataLocal: null,
    isLoading: false,
  }),
  watch: {
    markdownData: {
      immediate: true,
      handler(value) {
        this.markdownDataLocal = this.safeCopy(value);
      },
    },
  },
  methods: {
    safeCopy(value) {
      return JSON.parse(JSON.stringify(value));
    },
    async save() {
      const md = this.safeCopy(this.markdownDataLocal);
      const payload = JSON.parse(JSON.stringify(md));
      this.isLoading = true;
      const response = await this.$store.dispatch('markdown/updateMarkdown', payload);
      if (response.ok) {
        await this.$store.dispatch('markdown/fetchAllMarkdownItems');
        this.$emit('backToList');
        swal.fire(this.$t('faq-editor.modal.success'));
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.markdown {
  &__editor {
    background: #FFFFFF;
    border-radius: 4px;
  }
}
</style>
