<template>
  <component :is="component" @change="handleChange"></component>
</template>
<style></style>
<script>
  import paragraph from './md.e.p.vue';
  import marked from 'marked';
  import opts from './md.e.marked.opts';

  marked.setOptions(opts);

  export default {
    data() {
      return {
        component: 'paragraph'
      }
    },
    components: {paragraph},
    methods: {
      handleChange(e) {
        console.log(marked(e))
        this.$emit('')
      }
    }
  }
</script>
