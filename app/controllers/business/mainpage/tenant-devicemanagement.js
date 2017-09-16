import Ember from 'ember';
import Changeset from 'ember-changeset';
import ConsultValidations from '../../../validations/consult';
import VistValidations from '../../../validations/vist';
import lookupValidator from 'ember-changeset-validations';
export default Ember.Controller.extend({
  queryParams: {
      id: {
          refreshModel: true
      },
  },
  showAdd:false,
  destination:"",
  constants: Constants,
  queryCondition: '',
  mainController: Ember.inject.controller('business.mainpage'),
  refreshPage:function(){
    var route = App.lookup('route:business.mainpage.tenant-devicemanagement');
      App.lookup('controller:business.mainpage').refreshPage(route);
  },
  actions:{
    showAddDevice:function(){
      this.set("showAdd",true);
    } ,
    //弹窗取消按钮
    cancelAddDevice:function(){
      console.log("cancelAddDevice");
      this.set('showAdd',false);
    },
    saveDevice:function(){
      var self=this;
      var id=self.get("id");
      var tenant =self.get("store").peekRecord("tenant",id);
      var oldDeviceType=self.get("store").peekRecord("devicetype",self.get("devicetype").get("id"));

      self.get("devicetypeModel").set("tenant",tenant);
      self.get("devicetypeModel").set("remark",oldDeviceType.get("remark"));
      self.get("devicetypeModel").set("vender",oldDeviceType.get("vender"));
      self.get("devicetypeModel").set("deviceName",oldDeviceType.get("deviceName"));
      self.get("devicetypeModel").set("price",oldDeviceType.get("price"));
      self.get("devicetypeModel").set("status",oldDeviceType.get("status"));
      self.get("devicetypeModel").set("apiFile",oldDeviceType.get("apiFile"));
      self.get("devicetypeModel").set("codeInfo",oldDeviceType.get("codeInfo"));

      App.lookup('controller:business.mainpage').openPopTip("正在保存");
      self.get("devicetypeModel").save().then(function(data){
        App.lookup('controller:business.mainpage').showPopTip("保存成功");
        self.set('showAdd',false);
        self.refreshPage();
        self.set("devicetype", {});
      });
    },
    delete:function(deviceType){
        var self=this;
        var deleteModel=self.get("store").peekRecord("devicetype",deviceType.get("id"));
        App.lookup('controller:business.mainpage').showConfirm("是否确定删除此跟进记录", function() {
            App.lookup('controller:business.mainpage').openPopTip("正在删除");
              deleteModel.set("delStatus", 1);
              deleteModel.save().then(function() {
              self.set('showAdd',false);
              App.lookup('controller:business.mainpage').showPopTip("删除成功");
              self.refreshPage();
            });
        });
    },
    deviceTypeSelect:function(deviceType){
      this.set("devicetype", deviceType);
    }
  }
});
