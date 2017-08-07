<template>
  <p>
    <span ref="content" contenteditable @change="handleChange"></span>
  </p>
</template>
<style lang="scss" scope>
  p{
    margin-top: 20px;
    background: #eee;
    width: 100%;
    span{
      width: 100%;
      display: block;
      &:empty:after{
        content: '\200B';
      }
    }
  }
</style>
<script>
  export default {
    data() {
      return {}
    },
    methods: {
      handleChange(e){
        console.log(e)
      }
    }
  }
</script>
