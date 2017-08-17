<template>
  <div>
    <input type="button" value="随机" @click="shuffleCuts">
    <div class="game-wrap">
      <div class="game-pad">
        <div class="img-wrap" :style="{paddingBottom:imgHeight+'px'}">
          <img ref="imgDom" :src="gameImg">
        </div>
        <canvas ref="gameCanvas" class="play-pad" :style="{width:`${imgWidth}px`, height: `${2*imgHeight}px`}"
                @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"
                :width="imgWidth*canvasRation" :height="imgHeight*2*canvasRation"></canvas>
        <canvas ref="outImgCanvas" class="outer-img" :style="{width:`${imgWidth}px`, height: `${imgHeight}px`}"
                :width="imgWidth*canvasRation" :height="imgHeight*canvasRation"></canvas>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../debris/reset";

  html, body {
    overflow: hidden;
  }

  .game-wrap {
    position: relative;
    .img-wrap {
      font-size: 0;
      line-height: 0;
      width: 100%;
      img {
        width: 100%;
        object-fit: cover;
        filter: grayscale(100%);
      }
    }
    canvas.play-pad {
      position: absolute;
      top: 0;
      left: 0;
    }
    canvas.outer-img {
      position: absolute;
      left: 100%;
    }
  }
</style>
<script>
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
        // 配置参数
        gameImg: undefined,
        rows: 2,
        columns: 3,

        // 页面自使用参数
        imgWidth: 375,
        imgHeight: 375,
        gameStep: -1,
        cuts: [],
        cutPlaces: [],
        canvasImgEntity: undefined,
        canvasRation: 2,
        gameCanvasRect: undefined,
        gameCanvasCtx: undefined,
        outCanvasCtx: undefined,
        // 拖拽控制参数
        draging: false,
        dragIndex: -1,
        dragOffset: {offsetX: 0, offsetY: 0},
        maxZIndex: 6
      }
    },
    components: {},
    mounted() {
      this.loadImage('https://p1.meituan.net/dpnewvc/dd168278f4a8b1fe5cc3d1749a68f4a1193368.png')
        .then(_ => {
          return this.getImageSize();
        })
        .then(_ => {
          let imgCanvas = this.$refs.outImgCanvas, gameCanvas = this.$refs.gameCanvas;
          if (imgCanvas.getContext) {
            this.outCanvasCtx = imgCanvas.getContext('2d');
            this.gameCanvasCtx = gameCanvas.getContext('2d');
            this.gameCanvasRect = gameCanvas.getBoundingClientRect();
            imgCanvas.getContext('2d').drawImage(this.canvasImgEntity, 0, 0, this.imgWidth * this.canvasRation, this.imgHeight * this.canvasRation)
          }
          return Promise.all([this.cutImage(), this.initCutPlaces()]);
        })
        .then(_ => {
          return this.shuffleCuts();
        })
        .then(_ => {
          window.requestAnimationFrame(this.draw)
        })
    },
    computed: {
      cutWidth() {
        return this.imgWidth / this.columns;
      },
      cutHeight() {
        return this.imgHeight / this.rows;
      }
    },
    methods: {
      // 初始化：加载图片
      loadImage(src) {
        return new Promise(res => {
          let img = new Image();
          img.src = src;
          img.onload = () => {
            this.gameImg = src;
            this.gameStep = GAME_STATUS.IMAGE_READY;
            this.canvasImgEntity = img;
            res();
          };
        })
      },
      // 初始化：获取图片高宽
      getImageSize() {
        return new Promise(res => {
          this.$nextTick(_ => {
            let el = this.$refs.imgDom;
            this.imgWidth = el.offsetWidth;
            this.imgHeight = el.offsetHeight;
            res();
          })
        })
      },

      // 初始化：对图片进行切片
      cutImage() {
        return new Promise(res => {
          for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
              this.cuts.push(this.getCut(i, j))
            }
          }
          this.$nextTick(_ => res())
        })
      },
      // 初始化：获取某个切片数据
      getCut(row, column) {
        let cutHeight = this.cutHeight * this.canvasRation,
          cutWidth = this.cutWidth * this.canvasRation;
        return {
          sx: cutWidth * column,
          sy: cutHeight * row,
          sWidth: cutWidth,
          sHeight: cutHeight,
          index: row * this.columns + column,
          pIndex: -1
        }
      },
      // 对切片位置进行打乱,重新生成zIndex
      shuffleCuts() {
        return new Promise(res => {
          this.cuts.map(item => {
            item.ix = item.dx = this.getRandom(0, this.imgWidth - this.cutWidth) * this.canvasRation;
            item.iy = item.dy = this.getRandom(this.imgHeight, this.imgHeight * 2 - this.cutHeight) * this.canvasRation;
            item.zIndex = item.index;
          });
          this.$nextTick(_ => res())
        })
      },
      getRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
        //        return min;
      },

      // 初始化：切片坑位的初始化
      initCutPlaces() {
        return new Promise(res => {
          for (let i = 0; this.rows > i; i++) {
            for (let j = 0; this.columns > j; j++) {
              let cutPlace = this.getCut(i, j);
              cutPlace.cutIndex = -1;
              this.cutPlaces.push(cutPlace)
            }
          }
          this.$nextTick(_ => res())
        })
      },

      // 绘制面板
      draw() {
        this.gameCanvasCtx.clearRect(0, 0, this.imgWidth * this.canvasRation, this.imgHeight * this.canvasRation * 2);
        this.cutPlaces.map(_ => this.drawCutPlace(_));
        let copyOne = this.cuts.slice().sort((a, b) => {
          return a.zIndex >= b.zIndex;
        });
        copyOne.map(_ => this.drawCut(_));
        window.requestAnimationFrame(this.draw)
      },
      // 绘制某个切片
      drawCut({sx, sy, sWidth, sHeight, dx = 0, dy = 0, dWidth, dHeight}) {
        if (this.gameCanvasCtx) {
          this.gameCanvasCtx.drawImage(this.$refs.outImgCanvas, sx, sy, sWidth, sHeight, dx, dy, dWidth || sWidth, dHeight || sHeight)
        }
      },
      // 绘制某个切片坑位
      drawCutPlace({sx, sy, sWidth, sHeight}) {
        if (this.gameCanvasCtx) {
          this.gameCanvasCtx.strokeStyle = "#ccc";
          this.gameCanvasCtx.lineWidth = 2;
          this.gameCanvasCtx.setLineDash([5, 10]);
          this.gameCanvasCtx.strokeRect(sx, sy, sWidth, sHeight)
        }
      },

      // 根据鼠标位置获取当前选中的是哪个切片
      getTargetCut(x, y) {
        let tarIndex = -1, tarZIndex = -1, offset = {};
        this.cuts.map((item, index) => {
          let boundaryInfo = this.inBoundary(x, y, item);
          if (boundaryInfo.inBoundary && item.zIndex > tarZIndex) {
            tarIndex = item.index;
            tarZIndex = item.zIndex;
            offset = boundaryInfo;
          }
        });
        return {index: tarIndex, ...offset};
      },
      // 判断鼠标是否位于这个切片内
      inBoundary(x, y, cut) {
        let width = (cut.dWidth || cut.sWidth) / this.canvasRation,
          height = (cut.dHeight || cut.sHeight) / this.canvasRation;
        let offsetX = x - cut.dx / this.canvasRation, offsetY = y - cut.dy / this.canvasRation;
        return {
          inBoundary: 0 <= offsetX && offsetX <= width && 0 <= offsetY && offsetY <= height,
          offsetX, offsetY
        };
      },
      // 触摸拖动事件
      touchStart(e) {
        let target = this.getTargetCut(e.touches[0].clientX - this.gameCanvasRect.left, e.touches[0].clientY - this.gameCanvasRect.top);
        if (target.index !== -1) {
          this.draging = true;
          let dragIndex = -1;
          this.cuts.map((_, i) => {
            if (_.index === target.index) dragIndex = i;
          });
          this.dragIndex = dragIndex;
          this.dragOffset = {
            offsetX: target.offsetX,
            offsetY: target.offsetY
          };
          this.cuts[dragIndex].zIndex = this.maxZIndex++;
        }
      },
      touchMove(e) {
        if (this.draging && this.dragIndex !== -1) {
          this.cuts[this.dragIndex].dx = (e.touches[0].clientX - this.dragOffset.offsetX - this.gameCanvasRect.left) * this.canvasRation;
          this.cuts[this.dragIndex].dy = (e.touches[0].clientY - this.dragOffset.offsetY - this.gameCanvasRect.top) * this.canvasRation;
        }
      },
      touchEnd(e) {
        if (this.draging && this.dragIndex !== -1) {
          this.fixCutsPos(this.dragIndex);
        }
        this.draging = false;
        this.dragIndex = -1;
      },
      // 拖动结束后，修正切片位置
      fixCutsPos(index) {
        let cut = this.cuts[index], fixed = false;
        this.cutPlaces.map((place, pIndex) => {
          if (this.cutInPlace(cut, place)) {
            fixed = true;
            // 如果坑位已经有cut了，我们叫做oldCut
            if (place.cutIndex !== -1) {
              let oldCut = this.cuts[place.cutIndex];
              // 就把oldCut移动到cut原来的位置
              oldCut.ix = oldCut.dx = cut.ix;
              oldCut.iy = oldCut.dy = cut.iy;
              // 如果oldCut被移动到了坑里
              if (cut.pIndex !== -1) {
                // 把oldCut的坑位标志修改了
                oldCut.pIndex = cut.pIndex;
                this.cutPlaces[cut.pIndex].cutIndex = oldCut.index;
              } else {
                oldCut.pIndex = -1;
              }
            } else {
              // 如果cut原来也在一个坑里,就把这个坑恢复
              if (cut.pIndex !== -1) {
                this.cutPlaces[cut.pIndex].cutIndex = -1;
              }
            }
            cut.ix = cut.dx = place.sx;
            cut.iy = cut.dy = place.sy;
            cut.pIndex = pIndex;
            place.cutIndex = index;
          }
        });
        if (!fixed) {
          cut.ix = cut.dx;
          cut.iy = cut.dy;
          if (cut.pIndex !== -1) {
            this.cutPlaces[cut.pIndex].cutIndex = -1;
          }
          cut.pIndex = -1;
        }
        this.$nextTick(_ => this.checkSuccess())
      },
      // 检查cut是否可以放在这个坑位里
      cutInPlace(cut, place) {
        let halfWidth = place.sWidth / 2, halfHeight = place.sHeight / 2,
          tarPlace = {
            topLeft: {sWidth: halfWidth, sHeight: halfHeight, dx: place.sx, dy: place.sy},
            topRight: {sWidth: halfWidth, sHeight: halfHeight, dx: place.sx + halfWidth, dy: place.sy},
            bottomLeft: {sWidth: halfWidth, sHeight: halfHeight, dx: place.sx, dy: place.sy + halfHeight},
            bottomRight: {sWidth: halfWidth, sHeight: halfHeight, dx: place.sx + halfWidth, dy: place.sy + halfHeight},
          };
        let dx = cut.dx / this.canvasRation,
          dy = cut.dy / this.canvasRation,
          dx2 = (cut.dx + place.sWidth) / this.canvasRation,
          dy2 = (cut.dy + place.sHeight) / this.canvasRation;
        return this.inBoundary(dx, dy, tarPlace.topLeft).inBoundary
          || this.inBoundary(dx2, dy, tarPlace.topRight).inBoundary
          || this.inBoundary(dx, dy2, tarPlace.bottomLeft).inBoundary
          || this.inBoundary(dx2, dy2, tarPlace.bottomRight).inBoundary
      },
      checkSuccess() {
        let placeCheck = this.cutPlaces.filter(_ => _.index !== _.cutIndex).length === 0,
          cutCheck = this.cuts.filter(_ => _.index !== _.pIndex).length === 0;
        if (placeCheck && cutCheck) {
          setTimeout(_ => {
            alert('success');
          }, 100)
        }
      }
    }
  }
</script>
