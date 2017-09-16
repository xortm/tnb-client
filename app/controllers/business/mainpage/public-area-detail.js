import Ember from 'ember';
import Changeset from 'ember-changeset';
import AreaValidations from '../../../validations/area';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(AreaValidations,{
  constants:Constants,
  defaultBuilding:Ember.computed('roomInfo.build',function(){
    if(this.get('roomInfo.build')){
      return this.get('roomInfo.build');
    }else{
      return this.get('roomInfo.floor.building');
    }
  }),
  roomModel:Ember.computed("roomInfo",function(){
    var model = this.get("roomInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(AreaValidations), AreaValidations);
  }),

  actions:{
    invalid() {
    },
    //编辑按钮
    detailEditClick:function(){
      let _self = this;
      _self.set('detailEdit',true);

    },
    //取消按钮
    detailCancel:function(){
      var id=this.get('id');
      var editMode=this.get('editMode');
      let _self = this;
      if(id&&editMode=='edit'){
        this.set('detailEdit',false);
        this.get('roomInfo').rollbackAttributes();
        var route=App.lookup('route:business.mainpage.public-area-detail');
        App.lookup('controller:business.mainpage').refreshPage(route);//刷新页面
        this.set('roomInfo.build',null);

      }else{
        this.set('roomInfo.floor','');
        this.get('roomInfo').rollbackAttributes();
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('public-area');
      }
    },
    //保存公共区域
    saveArea(){
      var _self=this;
      var editMode=this.get('editMode');
      var roomModel=this.get('roomModel');
        roomModel.validate().then(function(){
          if(roomModel.get('errors.length')===0){
            App.lookup('controller:business.mainpage').openPopTip("正在保存");
            roomModel.set('isPublicFlag',1);
            roomModel.save().then(function(){
              App.lookup('controller:business.mainpage').showPopTip("保存成功");
              if(editMode=='add'){
                var mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('public-area');
              }else{
                  _self.set('detailEdit',false);
              }
            },function(err){
              App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
              let code = err.errors[0].code;
              let startStr = code.substring(0,3);
              if(startStr == '14-'){
                let num = code.substring(3,code.length);
                let str = num + '号设备已绑定' ;
                App.lookup('controller:business.mainpage').showAlert(str);
              }
            });
          }else{
            roomModel.set("validFlag",Math.random());
          }
      });
    },


    //删除按钮
    delById : function(room) {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除公共信息",function(){
        _self.send('cancelPassSubmit',_self.get('roomInfo'));
      });
    },
    //选择楼层
    selectFloor(floor) {
        this.set('roomInfo.floor', floor);
        this.set('roomModel.floor',floor);
    },
    selectBuilding(building) {
      this.set('roomInfo.build',building);
      this.set('roomModel.build',building);
      this.set('roomInfo.floor',null);
      let _self=this;
      this.store.query('floor',{filter:{'[building][id]':building.get('id')}}).then(function(floorList){
        floorList.forEach(function(floor){
          floor.set('namePinyin',pinyinUtil.getFirstLetter(floor.get("name")));
        });
        _self.set('floorList',floorList);
      });
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit(room){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("showpopInvitePassModal",false);
      room.set("delStatus", 1);
      room.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('public-area');

      },function(data){//网络错误容错
        App.lookup("controller:business.mainpage").closePopTip();
        App.lookup("controller:business.mainpage").showAlert("出现未知错误删除失败，请重试");
      });
		},
    //华米扫描器
    selectScanner(scanner){
      this.set('roomModel.scanner',scanner);
      this.set('roomInfo.scanner',scanner);
      this.set('roomModel.scannerID',scanner.get('id'));
      this.set('roomInfo.scannerID',scanner.get('id'));
    },
  }
});
