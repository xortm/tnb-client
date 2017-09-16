import Ember from 'ember';
/*下拉菜单*/
export default Ember.Component.extend({
  tagName: "div",
  classNames:["menu-item"],
  text:null,//显示的文字
  code:null,//标识

  //移动端点击事件
  touchStart() {
    console.log("touchStart in");
    if (this.get('touchStartAction')) {
      var touchStartAction = this.get('touchStartAction');
      console.log("touchStartAction:" + touchStartAction);
      this.sendAction(touchStartAction,this.get("code"));
    }
  },
});
