import Ember from 'ember';

export default Ember.Component.extend({
  store:Ember.inject.service('store'),
  init(){
    this._super();
    var _self = this;
    this.get('store').query('message', { "page[number]": 1, "page[size]": 30}).then(function(messageList) {
      _self.set("messageList",messageList);
    });
  },
  didInsertElement() {
    this._super(...arguments);
    console.log("didInsertElement,messageContainer:",Ember.$('#messageContainer').find("li").length);
  },
  didRender(){
    var _self = this;
    var len = Ember.$('#messageContainer').find("li").length;
    console.log("didRender,messageContainer:" + len);
    if(len===0){
      return;
    }
    console.log("need def");
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
    Ember.run.later(function(){
      console.log("rendered,messageContainer:",Ember.$('#messageContainer').find("li").length);
      var scroll = new IScroll('#messageContainer', { mouseWheel: true });
      _self.set("scroll",scroll);
    },5000);
  }

});
