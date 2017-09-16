import Ember from 'ember';
/*
 * controller业务基础类
 */
export default Ember.Controller.extend({
  DISPLAY_initFlag: false,//标志是否已初始化

  init: function(){
    let _self = this;
    this._super(...arguments);
    console.log("ctr init");
  },
  //列表页加载提示，子类实现
  tableLoadingShow(){
    var mainpageController = App.lookup('controller:business.mainpage');
    mainpageController.showTableLoading($(this.get("tableSelector")));
  }
});
