<template>
  <p>
    <span ref="content"></span>
  </p>
</template>
<style lang="scss" scope>
  p {
    margin-top: 20px;
    background: #eee;
    width: 100%;
    span {
      width: 100%;
      display: block;
      &:empty:after {
        content: '\200B';
      }
    }
  }
</style>
<script>
  import base from './md.e.base.vue'

  export default {
    extends: base,
    data() {
      return {
        ref: undefined
      }
    },
    methods: {
      handleTextChange(text, node) {
        console.log('this is children/s:', text)
        this.$emit('change', text)
      }
    },
    mounted() {
      this.ref = this.$refs.content;
    },
    beforeDestroyed() {
    }
  }
</script>
