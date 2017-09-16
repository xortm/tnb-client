import Ember from 'ember';
import Changeset from 'ember-changeset';
import FloorValidations from '../../../validations/floor';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend({
  //默认楼宇
  defaultBuilding:Ember.computed('floorInfo.building',function(){
      return this.get('floorInfo.building');
  }),
  floorModel:Ember.computed('floorInfo',function(){
    var model = this.get("floorInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(FloorValidations), FloorValidations);
  }),
  actions:{
    invalid() {
        //alert("error");
    },
    //编辑按钮
    detailEditClick:function(floor){
      this.set('detailEdit',true);
      this.set('building',this.get('floorInfo').get('building'));
    },
    //取消按钮
    detailCancel:function(){
      var editMode=this.get('editMode');
      if(editMode=='edit'){
        this.set('detailEdit',false);
      }else{
        this.get('floorInfo').rollbackAttributes();
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('building-management');
      }

    },
    //存储楼层
    saveFloor(floorInfo){
      var _self=this;
      var floorModel=this.get('floorModel');
      var editMode=this.get('editMode');
      floorModel.set('building',this.get('defaultBuilding'));
      floorModel.validate().then(function(){
        if(floorModel.get('errors.length')===0){

          floorModel.save().then(function(){
            if (editMode=='add') {
              var mainpageController = App.lookup('controller:business.mainpage');
              mainpageController.switchMainPage('building-management');
            }else {
              _self.set('detailEdit',false);
              _self.get('floorInfo').rollbackAttributes();
            }
          });
        }else{
          floorModel.set("validFlag",Math.random());
          //alert("校验失败");
        }
      });


    },
    //选择楼宇
    selectBuilding(building) {
        this.set('floorInfo.building', building);
        this.set('floorModel.building',building);
    },
    //删除按钮
    delById : function() {
      this.set('showpopInvitePassModal',true);

    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit(floor){
			this.set("showpopInvitePassModal",false);
      floor.set("delStatus", 1);
      floor.save().then(function() {
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('building-management');
      });
		},
  }
});
