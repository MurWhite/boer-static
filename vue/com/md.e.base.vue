<script>
  export default {
    data() {
      return {
        observe: new MutationObserver((muts) => {
          muts.forEach((mut) => {
            if (mut.type === 'characterData') {
              this.handleTextChange(mut.target.textContent, mut.target)
            }
          })
        }),
        obConfig: {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true,
          characterDataOldValue: true
        },
        ref: undefined
      }
    },
    methods: {
      handleTextChange(text) {
        console.log(text)
      }
    },
    watch: {
      ref(to) {
        if (to !== undefined) {
          this.observe.observe(this.ref, this.obConfig);
        }
      }
    },
    mounted() {

    },
    beforeDestroyed() {
      this.observe.disconnect();
    }
  }
</script>
