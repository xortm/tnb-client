import Ember from 'ember';

export default Ember.Controller.extend({
  allServiceList:Ember.computed('serviceList',function(){
    let serviceList = this.get('serviceList');
    if(serviceList){
      return serviceList;
    }

  }),
  actions:{
    //保存
    saveNewService: function() {
      var _self=this;
      App.lookup('controller:business.mainpage').openPopTip("正在保存");
      this.get('roleInfo').save().then(function(){
        App.lookup('controller:business.mainpage').showPopTip("保存成功");
        var mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('role-management');
      });
    },
    //取消
    detailCancel:function(){
      let mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('role-management');
    },
  }
});
