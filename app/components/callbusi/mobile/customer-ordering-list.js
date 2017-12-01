import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';

export default BaseUiItem.extend({
  store: Ember.inject.service("store"),
  feedBus: Ember.inject.service("feed-bus"),
  classStatic: true,
  isHide:true,
  classNameBindings: ['classStatic:line-item-task','isExpand:expand','outerClass'],
  outerClass:"",
  /*控制相关属性*/
  recognizers:"tap pan",
  constants:Constants,

  remarkArr:Ember.computed("item", function() {
    // let remarkObj = new Ember.A();
    let remark = this.get("item.remark");
    console.log("remark in model:",remark);
    let remarkArr = remark.split("@");
    console.log("remarkArr in model:",remarkArr);
    return remarkArr;
  }),

  actions:{
    //跳转到detail页面
    gotoDetail(){
      console.log("go customer warning detail");
      var _self = this;
      var params = {};
      params= {itemId:_self.get("item.id"),source:"look",itemIdFlag:Math.random()};
      console.log("gotoDetail params",params);
      var itemId = "customerOrderingList_" + this.get("item.id");
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          //通过全局服务进行上下文传值
          console.log("item in list:",_self.get("item"));
          _self.get("feedBus").set("customerOrderingData",_self.get("item"));
          // console.log("isConsumer in goto:",_self.get("isConsumer"));
          if(_self.get("isConsumer")){
            mainpageController.switchMainPage('customer-ordering-look',params);
          }else{
            mainpageController.switchMainPage('customer-ordering-detail',params);
          }
        },100);
      },200);
    },

  }

});
