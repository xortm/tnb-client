import Ember from 'ember';
import Changeset from 'ember-changeset';
import merchValidations from '../../../validations/merch';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(merchValidations,{
  constants:Constants,
  merchModel:Ember.computed('merchInfo',function(){
    var model = this.get("merchInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(merchValidations), merchValidations);
  }),
  actions:{
    invalid() {
        //alert("error");
    },
    merchUnitSelect(merchUnit){
      this.set('merchModel.merchUnit',merchUnit);
    },
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
        mainpageController.switchMainPage('nursemerch-management');
      }
    },
    typeSelect(type){
      this.set('merchModel.type',type);
    },
    //保存物品
    savemerch(){
      var _self=this;
      var merchModel=this.get('merchModel');
      var editMode=this.get('editMode');
      merchModel.validate().then(function(){
        if(merchModel.get('errors.length')===0){
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          merchModel.save().then(function(){
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            if (editMode=='add') {
              var mainpageController = App.lookup('controller:business.mainpage');
              mainpageController.switchMainPage('nursemerch-management');
            }else {
              _self.set('detailEdit',false);
            }
          },function(err){
            let error = err.errors[0];
            if(error.code==="4"){
              merchModel.validate().then(function(){
                merchModel.addError('code',['该物品编号已被占用']);
                merchModel.set("validFlag",Math.random());
                App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
              });
            }
          });
        }else{
          merchModel.set("validFlag",Math.random());
        }
      });
    },
    //删除按钮
    delById : function(merch) {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此物品信息",function(){
          _self.send('cancelPassSubmit',_self.get('merchInfo'));
      });
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit(merch){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("showpopInvitePassModal",false);
      merch.set("delStatus", 1);
      merch.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('nursemerch-management');

      },function(err){//网络错误容错
        App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
        let error = err.errors[0];
        if(error.code==="8"){
          App.lookup('controller:business.mainpage').showAlert("物品已占用无法删除");
        }
      });
		},
  }
});
