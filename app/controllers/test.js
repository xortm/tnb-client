import Ember from 'ember';

export default Ember.Controller.extend({
  init: function () {
    var _self = this;
    console.log("body in init:", this.get("body"));
    // console.log("public_vars:", public_vars);
    Ember.run.schedule("afterRender",this,function() {
      // document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);//禁用这个用下面的
      document.addEventListener('touchmove', function(e) {//升级最新chrome 会给这个preventDefault返回了naive，不再是清除浏览器默认行为了。
          // 判断默认行为是否可以被禁用
          if (e.cancelable) {
              // 判断默认行为是否已经被禁用
              if (!e.defaultPrevented) {
                  e.preventDefault();
              }
          }
      }, false);
      var scroll = new IScroll('#wrapper', { mouseWheel: true });
      // scroll.on("scrollStart",function () { console.log('scroll started'); });
      scroll.on("scrollEnd",function () { console.log('scroll end'); });
    });
  },
});
