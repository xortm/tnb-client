import Ember from 'ember';
const {leaveStatus1,leaveStatus2,leaveStatus3,leaveStatus4,leaveStatus5,consultStatus6,consultStatus7} = Constants;
export default Ember.Controller.extend({
  dataLoader: Ember.inject.service("data-loader"),
  queryScheduled:true,
  queryAll:false,
  saveRefresh: function() {
      this.refresh();
  },
  actions:{
    queryAll(){
      App.lookup("route:business.mainpage.stay-back").doQueryAll();
      this.set('queryAll',true);
      this.set('queryScheduled',false);
    },
    toStayBackDetail:function(customerflowId){
      var params = {};
      var mainpageController = App.lookup('controller:business.mainpage');
      if(customerflowId){
        this.store.findRecord('customerbusinessflow',customerflowId).then(function(customerflow){
          var thisLeaveStatusTypecode = customerflow.get("leaveStatus").get("typecode");
          if(thisLeaveStatusTypecode==Constants.leaveStatus2|| thisLeaveStatusTypecode ==Constants.leaveStatus3||thisLeaveStatusTypecode==Constants.leaveStatus5){
            params = {
              customerflowId:customerflowId,
              editMode:"look"
            };
          }else{
            params = {
              customerflowId:customerflowId,
              editMode:"edit"
            };
          }
          mainpageController.switchMainPage('stay-back-detail',params);
        });
      }else {
        params = {
          editMode:"add",
        };
        mainpageController.switchMainPage('stay-back-detail',params);
      }
    },

    settlementSubmit(customer){//结算弹窗的  确认按键执行的方法
      var _self = this;
      App.lookup('controller:business.mainpage').openPopTip("正在结算");
      var leaveStatusObj = _self.get("dataLoader").findDict(Constants.leaveStatus3);
      customer.set("leaveStatus",leaveStatusObj);

      customer.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("结算成功");
      },function(data){//网络错误容错
        App.lookup("controller:business.mainpage").closePopTip();
        App.lookup("controller:business.mainpage").showAlert("出现未知错误未能结算成功，请重试");
      });
		},

    settlementSubmitTwo(customer){//申请退住 变为 审核通过，  后台0点生成账单后，会改为 费用结算中...
      var _self = this;
      var leaveStatusObj = this.get("dataLoader").findDict(Constants.leaveStatus4);
      customer.set("leaveStatus",leaveStatusObj);
      customer.save().then(function(){
        var route=App.lookup('route:business.mainpage.stay-back');
        route.refresh();//刷新页面
      });
		},
    chengeState:function(customer){
      var _self = this;
      var leaveStatusObj,
          leaveStatusTypecode = customer.get("leaveStatus").get("typecode");
      if(leaveStatusTypecode === Constants.leaveStatus1){//申请退住 变为 结算中   点击审核通过执行的方法
        App.lookup('controller:business.mainpage').showConfirm("确定审核通过该申请？",function(){//加弹窗
          _self.send('settlementSubmitTwo',customer);
        });
      }
    },

    theToVoid:function(customer){
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定作废此退住记录",function(){
        _self.send('cancelPassSubmit',customer);
      });
    },
    closeModel:function(){
      this.set("toVoidModal",false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit:function(customer){
      App.lookup('controller:business.mainpage').openPopTip("正在作废");
			this.set("showpopInvitePassModal",false);
      var _self = this;
      var leaveStatusObj = this.get("dataLoader").findDict(Constants.leaveStatus5);
      customer.set("leaveStatus",leaveStatusObj);
      customer.save().then(function(){
        App.lookup('controller:business.mainpage').showPopTip("作废成功");
        _self.saveRefresh();
      },function(data){//网络错误容错
        App.lookup("controller:business.mainpage").closePopTip();
        App.lookup("controller:business.mainpage").showAlert("出现未知错误作废失败，请重试");
      });
    },
    completeFlow(customer){
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定该老人完成退住",function(){
        _self.send('complete',customer);
      });
    },
    complete(customer){
      App.lookup('controller:business.mainpage').openPopTip("正在退住");
			this.set("showpopInvitePassModal",false);
      var _self = this;
      var leaveStatusObj = this.get("dataLoader").findDict(Constants.leaveStatus3);
      customer.set("leaveStatus",leaveStatusObj);
      customer.save().then(function(){
        App.lookup('controller:business.mainpage').showPopTip("退住成功");
        _self.saveRefresh();
      },function(data){//网络错误容错
        App.lookup("controller:business.mainpage").closePopTip();
        App.lookup("controller:business.mainpage").showAlert("出现未知错误退住失败，请重试");
      });
    },
  },
});
