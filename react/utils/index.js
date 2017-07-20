/**
 * Created by B on 2017/6/8.
 */

module.exports = {
  scrollTo(ele, targetPos, duration, cb){
    let nowPos = ele.scrollTop,
      curTime = new Date(),
      distance = targetPos - nowPos;
    let interval = setInterval(() => {
      let p = (new Date() - curTime) / duration;
      if (p >= 1) p = 1;
      ele.scrollTop = nowPos + distance * p;
      if (p >= 1) {
        setTimeout(() => {
          cb && cb();
        }, 100);
        clearInterval(interval);
      }
    }, 13)
  }
};
