<template>
  <p >
    <span ref="content" contenteditable @keydown="keyDown"></span>
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
      keyDown(e) {
        console.log(e)
        let dom = this.$refs.content;
        console.log(dom.innerHTML)
        if(dom && dom.innerHTML){

        }
      }
    }
  }
</script>
