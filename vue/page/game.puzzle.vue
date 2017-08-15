<template>
  <div>
    <input type="button" :value="gameStep===1?'开始游戏':'重新开始'" @click="shuffleCuttings">
    <div class="game-wrap">
      <div class="game-bg-pad">
        <img :class="{bg:gameStep!==0}" :src="gameImg">
      </div>
      <drag v-model="splitImgs" :move="handleMove" :options="{disabled:gameStep!==2}" @end="handleRelease">
        <transition-group name="list" tag="div" class="game-play-pad">
          <div class="img-cutting" v-for="img in splitImgs" :key="img.index" :style="img.style"></div>
        </transition-group>
      </drag>
    </div>
  </div>
</template>
<style lang="sass">
  @import "../debris/reset"
  .game-wrap
    position: relative
    .game-bg-pad
      font-size: 0
      line-height: 0
      img
        max-width: 100%
        transition: 300ms linear filter
        &.bg
          filter: grayscale(100%)
    .game-play-pad
      position: absolute
      width: 100%
      height: 200%
      top: 0
      font-size: 0
      line-height: 0
      .img-cutting
        display: inline-block
        font-size: 20px
        line-height: 1
        color: red

  .list-move
    transition: transform 1s ease
</style>
<script>
  import drag from 'vuedraggable'

  const GAME_STATUS = {
    IMAGE_READY: 0,
    READY: 1,
    START: 2,
    SUCCESS: 3,
    FAIL: 4
  };
  export default {
    data() {
      return {
        gameImg: undefined,
        gameStep: -1,
        splitImgs: [],
        dragToIndex: -1,
        emptyCutting: {}
      }
    },
    components: {drag},
    mounted() {
      this.initCutting(2, 3, 'https://p1.meituan.net/dpnewvc/dd168278f4a8b1fe5cc3d1749a68f4a1193368.png');
    },
    watch: {
      gameStep(to) {
        if (to === GAME_STATUS.SUCCESS) {
          console.log('你赢了')
        }
      }
    },
    methods: {
      loadImage(src) {
        return new Promise(res => {
          let img = new Image();
          img.src = src;
          img.onload = () => {
            this.gameImg = src;
            this.gameStep = GAME_STATUS.IMAGE_READY;
            res();
          };
        })
      },
      initCutting(irows, icolumns, iimage) {
        return new Promise(res => {
          let rows = irows || 2,
            columns = icolumns || 3,
            image = iimage || 'https://p1.meituan.net/dpnewvc/dd168278f4a8b1fe5cc3d1749a68f4a1193368.png';
          this.loadImage(image)
            .then(_ => {
              let pad = document.querySelector('.game-bg-pad');
              let WIDTH = pad.offsetWidth, HEIGHT = pad.offsetHeight;
              let width = WIDTH / columns, height = HEIGHT / rows;

              let images = [];
              this.emptyCutting = {
                style: `width: ${width}px;height: ${height}px`
              };
              for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                  images.push({
                    style: `background-image:url(${image});background-position:-${j * width}px -${i * height}px;`
                    + `background-size:${WIDTH}px ${HEIGHT}px;width: ${width}px;height: ${height}px`,
                    index: i * columns + j
                  })
                }
              }
              for (let i = 0; i < rows * columns; i++) {
                images.push(Object.assign({index: 13 + i}, this.emptyCutting))
              }
              this.splitImgs = [];
              this.splitImgs = images;
              this.$nextTick(_ => {
                this.gameStep = GAME_STATUS.READY;
                res(images)
              });
            });
        })
      },
      shuffleCuttings() {
        if (this.gameStep !== GAME_STATUS.READY) this.resetGame();
        let arr = this.splitImgs.slice(0, 6);
        for (let i = arr.length - 1; i >= 0; i--) {
          let randomIndex = Math.floor(Math.random() * (i + 1)),
            tempItem = arr[randomIndex];
          arr[randomIndex] = arr[i];
          arr[i] = tempItem;
        }
        this.splitImgs.splice(0, 6);
        this.splitImgs.splice(6, 0, ...arr);
        this.gameStep = GAME_STATUS.START;
      },
      resetGame() {
        location.reload();
      },
      checkSuccess() {
        this.$nextTick(()=>{
          if (this.splitImgs.slice(0, 6).every((_, i) => _.index === i)) {
            console.log('成功')
            this.gameStep = GAME_STATUS.SUCCESS;
          }
        });
      },
      handleMove(e) {
        this.dragToIndex = e.relatedContext.index;
        return false;
      },
      handleRelease(e) {
        this.$nextTick(() => {
          let oldIndex = e.oldIndex, newIndex = this.dragToIndex;
          if (this.splitImgs[oldIndex].index >= 13) {
            return;
          }
          let tempItem = this.splitImgs[newIndex];
          this.splitImgs[newIndex] = this.splitImgs[oldIndex];
          this.splitImgs.splice(oldIndex, 1, tempItem)
        });
        this.checkSuccess();
      },
    },
    computed: {}
  }
</script>
