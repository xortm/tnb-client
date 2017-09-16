import Ember from 'ember';
import Changeset from 'ember-changeset';
import BuildingValidations from '../../../validations/building';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(BuildingValidations,{
  constants:Constants,
  buildModel:Ember.computed('buildingInfo',function(){
    var model = this.get("buildingInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(BuildingValidations), BuildingValidations);
  }),
  actions:{
    invalid() {
        //alert("error");
    },
    // choose0(buildingId){//0 生成
    //   var _self = this;
    //   this.store.findRecord('building',buildingId).then(function(buildingInfo){
    //     buildingInfo.set("create4Flag",0);
    //     _self.set("choose1",false);
    //     _self.set("choose0",true);
    //     buildingInfo.save().then(function(){});
    //   });
    // },
    // choose1(buildingId){//1不生成
    //   var _self = this;
    //   this.store.findRecord('building',buildingId).then(function(buildingInfo){
    //     buildingInfo.set("create4Flag",1);
    //     _self.set("choose0",false);
    //     _self.set("choose1",true);
    //     buildingInfo.save().then(function(){});
    //   });
    // },
    //编辑按钮
    detailEditClick:function(){
      this.set('detailEdit',true);
    },
    //取消按钮
    detailCancel:function(){
      var editMode=this.get('editMode');
      if(editMode=='edit'){
        this.set('detailEdit',false);
      }else{
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('building-management');
      }
    },
    //保存楼宇
    saveBuilding(){
      var _self=this;
      var buildModel=this.get('buildModel');
      var editMode=this.get('editMode');
      var cbState = this.get("cbState");
      if(cbState){
        this.set("buildModel.create4Flag",1);
      }
      if(!buildModel.get('downLandFloorNum')){
        buildModel.set('downLandFloorNum',0);
      }
      buildModel.validate().then(function(){
        if(buildModel.get('errors.length')===0){
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          buildModel.save().then(function(){
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            if (editMode=='add') {
              var mainpageController = App.lookup('controller:business.mainpage');
              mainpageController.switchMainPage('building-management');
            }else {
              _self.set('detailEdit',false);
              // _self.get('buildingInfo').rollbackAttributes();
            }
          },function(err){
            let error = err.errors[0];
            if(error.code==="4"){
              buildModel.validate().then(function(){
                buildModel.addError('name',['该楼宇名称已被占用']);
                buildModel.set("validFlag",Math.random());
                App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
              });
            }
          });
        }else{
          buildModel.set("validFlag",Math.random());
        }
      });


    },
    //删除按钮
    delById : function(building) {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此楼宇信息",function(){
          _self.send('cancelPassSubmit',_self.get('buildingInfo'));
      });
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit(building){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("showpopInvitePassModal",false);
      building.set("delStatus", 1);
      building.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('building-management');

      },function(err){//网络错误容错
        App.lookup('controller:business.mainpage').showPopTip("删除失败",false);
        let error = err.errors[0];
        if(error.code==='8'){
          App.lookup('controller:business.mainpage').showAlert("已有老人入住的楼宇无法删除！");
        }

      });
		},
  }
});
