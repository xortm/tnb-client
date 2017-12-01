import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service('date-service'),
  dataLoader: Ember.inject.service("data-loader"),
  feedBus: Ember.inject.service("feed-bus"),
  pathConfiger: Ember.inject.service("path-configer"),
  global_curStatus: Ember.inject.service("current-status"),
  mainController: Ember.inject.controller('business.mainpage'),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"serviceCheckDetailContainer",
  preventInfinite: true,
  customerListFlag: 0,
  constants:Constants,
  serviceCheckInfoObs:function(){
    var _self = this;
    _self._showLoading();
    var itemId = this.get("itemId");
    var itemIdFlag = this.get("itemIdFlag");
    var source = this.get("source");
    if(!source||!itemIdFlag){return;}
    if(source === "add"){
      let staff = this.get('global_curStatus').getUser();//取当前登录的管理员
      console.log('staffName',staff.get('employee.name'),staff);
      let serviceCheckInfo = _self.store.createRecord('servicecheck',{staff:staff.get('employee')});
      serviceCheckInfo.save().then(function(servicecheck){
        _self.set("serviceCheck",servicecheck);
        // _self.set("serviceCheck",serviceCheckInfo);
        _self.hideAllLoading();
        _self.directInitScoll(true);
      });
    }else if(source === "look"){
      //从全局上下文服务里拿到外层传递的数据
      let serviceCheckItem = _self.get("feedBus").get("serviceCheckData");
      //与传参进行比较，一致才设置
      if(serviceCheckItem.get("id") === itemId){
        _self.set("serviceCheck",serviceCheckItem);
        _self.hideAllLoading();
        _self.directInitScoll(true);
      }
    }
  }.observes("itemIdFlag").on('init'),

  mobileAlertMess: function(text) {
    var _self = this;
    this.set('responseInfo',text);
    this.set('theTextOfModel',true);
    setTimeout(()=>{
      _self.set("theTextOfModel", false);
    },2000);
  },

  actions:{
    //跳转选择 self-choose
    toChooseType(assessment,str){
      let itemId ;
      let serviceCheck = this.get('serviceCheck');
      let params = {serviceCheckId:serviceCheck.get('id'),strType:str};
      let _self = this;
      if(str=='remark'){
        itemId = "#serviceCheck_remark";
      }
      if(str=="serviceCheckItem"){
        itemId = "#serviceCheck_type";
      }
      $(itemId).addClass("tapped");
      Ember.run.later(function(){
        $(itemId).removeClass("tapped");
        Ember.run.later(function(){
          //通过全局服务进行上下文传值
          _self.set("feedBus.serviceCheckData",_self.get('serviceCheck'));
          _self.get("mainController").switchMainPage('service-check-select',params);
        },100);
      },200);
    },
    switchShowAction(){
    },

  }
});
