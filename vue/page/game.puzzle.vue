<template>
  <div>
    <input type="button" :value="gameStep===1?'开始游戏':'重新开始'" @click="shuffleCuts">
    <div class="game-wrap">
      <div class="game-bg-pad">
        <img :class="{bg:gameStep!==0}" :src="gameImg">
      </div>
      <drag v-model="splitImgs" :move="handleMove" :options="{disabled:gameStep!==2}" @end="handleRelease">
        <transition-group name="list" tag="div" class="game-play-pad">
          <div v-for="img,index in splitImgs" :key="img.index" :style="img.style" class="img-cut"
               :class="[index>=cutCounts?('random-'+index):'', index<cutCounts&&img.index>=emptyCutMinIndex?'border':'']"></div>
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
      .img-cut
        display: inline-block
        font-size: 20px
        line-height: 1
        color: red
        position: relative
        &.border
          border: 1px dashed #ccc
          box-sizing: border-box
        &.random-6
          transform: translate3d(0, 10px, 0) rotate(-20deg)
        &.random-7
          transform: translate3d(-20px, 20px, 0)
          z-index: 1
        &.random-8
          transform: translate3d(-15px, 10px, 0)
        &.random-9
          transform: translate3d(20px, 10px, 0)
        &.random-10
          transform: translate3d(10px, -10px, 0)
        &.random-11
          transform: translate3d(0, 0, 0)

  .list-move
    transition: transform 300ms ease
    border-color: transparent !important
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
        emptyCut: {},
        rows: 2,
        columns: 3
      }
    },
    components: {drag},
    mounted() {
      this.initCut(2, 3, 'https://p1.meituan.net/dpnewvc/dd168278f4a8b1fe5cc3d1749a68f4a1193368.png');
    },
    computed: {
      emptyCutMinIndex() {
        return this.rows * (this.columns + 1)
      },
      cutCounts() {
        return this.rows * this.columns;
      }
    },
    watch: {
      gameStep(to) {
        if (to === GAME_STATUS.SUCCESS) {
          setTimeout(_ => {
            alert('you win')
          }, 300)
        }
      }
    },
    methods: {
      // 加载图片
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
      // 初始化拼图切片
      initCut(irows, icolumns, iimage) {
        return new Promise(res => {
          let rows = irows || 2,
            columns = icolumns || 3,
            image = iimage || 'https://p1.meituan.net/dpnewvc/dd168278f4a8b1fe5cc3d1749a68f4a1193368.png';
          this.rows = rows;
          this.columns = columns;
          this.loadImage(image)
            .then(_ => {
              let pad = document.querySelector('.game-bg-pad');
              let WIDTH = pad.offsetWidth, HEIGHT = pad.offsetHeight;
              let width = WIDTH / columns, height = HEIGHT / rows;

              let images = [];
              this.emptyCut = {
                style: {
                  width: `${width}px`,
                  height: `${height}px`,
                  zIndex: 0
                }
              };
              for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                  images.push({
                    style: {
                      backgroundImage: `url(${image})`,
                      backgroundPosition: `-${j * width}px -${i * height}px`,
                      backgroundSize: `${WIDTH}px ${HEIGHT}px`,
                      width: `${width}px`,
                      height: `${height}px`,
                      zIndex: 1
                    },
                    index: i * columns + j
                  })
                }
              }
              for (let i = 0; i < rows * columns; i++) {
                images.push(Object.assign({index: this.emptyCutMinIndex + i}, this.emptyCut))
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
      // 打乱切片位置
      shuffleCuts() {
        if (this.gameStep !== GAME_STATUS.READY) this.resetGame();
        let totalSpices = this.rows * this.columns;
        let arr = this.splitImgs.slice(0, totalSpices);
        for (let i = arr.length - 1; i >= 0; i--) {
          let randomIndex = Math.floor(Math.random() * (i + 1)),
            tempItem = arr[randomIndex];
          arr[randomIndex] = arr[i];
          arr[i] = tempItem;
        }
        this.splitImgs.splice(0, totalSpices);
        this.splitImgs.splice(totalSpices, 0, ...arr);
        this.gameStep = GAME_STATUS.START;
      },
      // 重新开始游戏
      resetGame() {
        location.reload();
      },
      // 检查游戏是否成功
      checkSuccess() {
        this.$nextTick(() => {
          if (this.splitImgs.slice(0, this.splitImgs.length / 2).every((_, i) => _.index === i)) {
            console.log('成功');
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
          if (this.splitImgs[oldIndex].index >= this.emptyCutMinIndex) {
            return;
          }
          let tempItem = this.splitImgs[newIndex];
          this.splitImgs[newIndex] = this.splitImgs[oldIndex];
          this.splitImgs.splice(oldIndex, 1, tempItem)
          this.checkSuccess();
        });
      }
    }
  }
</script>
