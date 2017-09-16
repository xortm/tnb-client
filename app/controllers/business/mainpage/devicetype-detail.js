import Ember from 'ember';
import Changeset from 'ember-changeset';
import DevicetypeValidations from '../../../validations/devicetype';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(DevicetypeValidations,{
  constants:Constants,//引入字典常量
  count:false,
  deviceModel: Ember.computed("deviceInfo", function() {
      var model = this.get("deviceInfo");
      if (!model) {
          return null;
      }
      return new Changeset(model, lookupValidator(DevicetypeValidations), DevicetypeValidations);
  }),
  mainController: Ember.inject.controller('business.mainpage'),
  editModel: null,
  actions:{
    invalid() {
        //alert("error");
    },
    //编辑按钮
    detailEditClick:function(){
      this.set('detailEdit',true);
    },
    //取消按钮
    detailCancel:function(){
      var id=this.get('id');
      var editMode=this.get('editMode');
      if(id&&editMode=='edit'){
        this.set('detailEdit',false);
        this.get('deviceInfo').rollbackAttributes();
        var route=App.lookup('route:business.mainpage.devicetype-detail');
        route.refresh();//刷新页面
      }else{
        this.get('deviceInfo').rollbackAttributes();
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('devicetype-management');
      }
    },
    savedevice(){

      var _self=this;
      var editMode=this.get('editMode');
      var deviceModel=this.get('deviceModel');
      deviceModel.validate().then(function(){
        if(deviceModel.get('errors.length')===0){
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          deviceModel.save().then(function(){
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            if(editMode=='add'){
              var mainpageController = App.lookup('controller:business.mainpage');
              mainpageController.switchMainPage('devicetype-management');
            }else{
                _self.set('detailEdit',false);
            }
        });
      }else{
        deviceModel.set("validFlag",Math.random());
      }
    });
    },
    //删除按钮
    delById : function() {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此项目记录",function(){
        _self.send('cancelPassSubmit',_self.get('deviceInfo'));
      });
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit(device){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("showpopInvitePassModal",false);
      device.set("delStatus", 1);
      device.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('devicetype-management');

      });
		},
  }
});
