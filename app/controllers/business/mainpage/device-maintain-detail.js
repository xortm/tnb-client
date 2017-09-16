import Ember from 'ember';
import Changeset from 'ember-changeset';
import DeviceTypeValidations from '../../../validations/devicetypeitem';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(DeviceTypeValidations,{
  detailEdit:false,
  dataLoader: Ember.inject.service("data-loader"),
  deviceModel:Ember.computed('deviceInfo',function(){
    var model = this.get("deviceInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(DeviceTypeValidations), DeviceTypeValidations);
  }),
  deviceProject:null,
  deviceProList:Ember.computed('devicetypeList',function(){
    let list = new Ember.A();
    let deviceTypeList = this.get('devicetypeList');
    if(!deviceTypeList){
      return null;
    }
      deviceTypeList.forEach(function(deviceType){
          let item = Ember.Object.create({});
          switch (deviceType.get('codeInfo')) {
            case 'daerma':
              item.set('typename','床垫');
              item.set('code','03');
              item.set('typecode','daerma');
              item.set('typeId',3);
              break;
            case 'yitikang':
              item.set('typename','体检');
              item.set('code','01');
              item.set('typecode','yitikang');
              item.set('typeId',1);
              break;
            case 'huami':
              item.set('typename','呼叫');
              item.set('code','02');
              item.set('typecode','huami');
              item.set('typeId',2);
              break;
          }
          if(!list.findBy('code',item.get('code'))){
            list.pushObject(item);
          }
      });
      return list;
  }),
  actions:{
    invalid() {
        //alert("error");
    },
    detailEditClick(){
      this.set('detailEdit',true);
      let deviceInfo = this.get('dataLoader').findDict(this.get('deviceTypeItem.item.typecode'));
      deviceInfo.set('name',this.get('deviceTypeItem.item.typename'));
      deviceInfo.set('code',this.get('deviceTypeItem.item.typecode'));
      this.set('deviceInfo',deviceInfo);

    },
    //新增保存
    detailSaveClick: function() {
      let _self = this;
      let deviceModel = this.get('deviceModel');
      let deviceInfo = this.get('deviceInfo');
      deviceModel.set('type',this.get('deviceProject'));
      deviceModel.validate().then(function(){
        if(deviceModel.get('errors.length')===0){
          let typegroup = _self.get('dataLoader').findDict('deviceType6').get('typegroup');
          deviceInfo.set('typegroup',typegroup);
          deviceInfo.set('typename',deviceModel.get('name'));
          deviceInfo.set('typecode',deviceModel.get('code'));
          deviceInfo.set('remark',deviceModel.get('remark'));
          let deviceTypeId = _self.get('deviceProject.typeId');
          let str = 'deviceType' + ',' + deviceTypeId;
          deviceInfo.set('operateType',str);
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          deviceInfo.save().then(function(){
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            var mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('device-maintain-management');
          },function(err){
            let error = err.errors[0];
            if(error.code==="4"){
              deviceModel.validate().then(function(){
                deviceModel.addError('customerCardCode',['类型名称已占用']);
                deviceModel.set("validFlag",Math.random());
                App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
              });
            }
            if(error.code==="12"){
              deviceModel.validate().then(function(){
                deviceModel.addError('customerCardCode',['类型编码已占用']);
                deviceModel.set("validFlag",Math.random());
                App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
              });
            }
          });
        }else{
          deviceModel.set("validFlag",Math.random());
        }
      });
    },
    //编辑保存
    editSaveClick(){
      let _self = this;
      let deviceInfo = this.get('deviceInfo');
      let deviceModel = this.get('deviceModel');
      deviceModel.set('type',this.get('deviceTypeItem.type'));
      deviceModel.validate().then(function(){
        if(deviceModel.get('errors.length')===0){
          deviceInfo.set('typename',deviceModel.get('name'));
          deviceInfo.set('typecode',deviceModel.get('code'));
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          deviceInfo.save().then(function(){
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            var mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('device-maintain-detail');
            _self.set('detailEdit',false);
          },function(err){
            let error = err.errors[0];
            if(error.code==="4"){
              deviceModel.validate().then(function(){
                deviceModel.addError('name',['类型名称已占用']);
                deviceModel.set("validFlag",Math.random());
                App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
              });
            }
            if(error.code==="12"){
              deviceModel.validate().then(function(){
                deviceModel.addError('code',['类型编码已占用']);
                deviceModel.set("validFlag",Math.random());
                App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
              });
            }
          });
        }else{
          deviceModel.set("validFlag",Math.random());
        }
      });
    },
    deviceProSelect(device){
      this.set('deviceProject',device);
    },
    //取消
    detailCancel:function(){
      let editMode = this.get('editMode');
      if(editMode == 'edit'){
        this.set('detailEdit',false);
      }else{

        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('device-maintain-management');
      }

    },
    //删除按钮
    delById : function() {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此记录",function(){
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
      let str = 'deviceType';
      device.set('operateType',str);
      device.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('device-maintain-management');
      },function(err){
        let error = err.errors[0];
        if(error.code==="8"){
          device.validate().then(function(){
            App.lookup('controller:business.mainpage').showAlert("设备类型已占用，无法删除！");
          });
        }
      });
		},
  }
});
