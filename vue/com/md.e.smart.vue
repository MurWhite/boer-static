<template>
  <component :is="component"></component>
</template>
<style></style>
<script>
  import paragraph from './md.e.p.vue';

  export default {
    data() {
      return {
        component: 'paragraph'
      }
    },
    components: {paragraph}
  }
</script>
