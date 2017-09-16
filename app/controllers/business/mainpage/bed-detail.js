import Ember from 'ember';
import Changeset from 'ember-changeset';
import BedValidations from '../../../validations/bed';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(BedValidations,{
  constants: Constants,
  //默认房间
  defaultRoom:Ember.computed('bedInfo.room',function(){
      return this.get('bedInfo.room');
  }),
  bedModel:Ember.computed('bedInfo',function(){
    var model = this.get("bedInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(BedValidations), BedValidations);
  }),
  actions:{
    invalid() {
        //alert("error");
    },
    //保存
    detailSaveClick: function(bedInfo) {

      var editMode=this.get('editMode');
      var bedModel=this.get('bedModel');
      var _self=this;
      bedModel.validate().then(function(){
        App.lookup('controller:business.mainpage').openPopTip("正在保存");
        if(bedModel.get('errors.length')===0){
          bedModel.save().then(function(){
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            if(editMode=='add'){
              var mainpageController = App.lookup('controller:business.mainpage');
              mainpageController.switchMainPage('bed-management');
            }else{
                _self.set('detailEdit',false);
            }
        });
      }else{
        bedModel.set("validFlag",Math.random());
      }
      });
    },
    //编辑按钮
    detailEditClick:function(){
      this.set('detailEdit',true);
    },
    //取消
    detailCancel:function(){
      var id=this.get('id');
      var editMode=this.get('editMode');
      if(id&&editMode=='edit'){
        this.set('detailEdit',false);
        this.get('bedInfo').rollbackAttributes();
      }else{
        this.get('bedInfo').rollbackAttributes();
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('bed-management');
      }

    },
    //选择房间
    selectRoom(room) {
        this.set('bedInfo.room',room);
        this.set('bedModel.room',room);
    },
    //删除按钮
    delById : function() {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此床位记录",function(){
        _self.send('cancelPassSubmit',_self.get('bedInfo'));
      });
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit(bed){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("showpopInvitePassModal",false);
      bed.set("delStatus", 1);
      bed.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('bed-management');

      });
		},
  }
});
