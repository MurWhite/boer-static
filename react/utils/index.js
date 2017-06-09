/**
 * Created by B on 2017/6/8.
 */
module.exports = {
  throttle(fn, delay, minRunDelay){
    let timer = null, t_start;
    return () => {
      let args = arguments, t_now = +new Date();
      clearTimeout(timer);
      if (!t_start) {
        t_start = t_now;
      }
      if (t_now - t_start >= minRunDelay) {
        fn(args);
        t_start = t_now;
      } else {
        timer = setTimeout(() => {
          fn(args);
        }, delay)
      }
    }
  }
};
