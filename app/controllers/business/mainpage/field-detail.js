import Ember from 'ember';
import Changeset from 'ember-changeset';
import RiskValidations from '../../../validations/risk-field';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(RiskValidations,{
  constants:Constants,
  riskModel:Ember.computed('riskInfo',function(){
    var model = this.get("riskInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(RiskValidations), RiskValidations);
  }),
  actions:{
    invalid() {},
    selectParent(parent){
      this.set('riskModel.parent',parent);
    },
    valueTypeSelect(valueType){
      this.set('riskModel.valueType',valueType);
    },
    //保存
    saveRiskLevel: function() {
      let editMode=this.get('editMode');
      let riskModel=this.get('riskModel');
      let _self=this;
      let model = this.store.peekRecord('risk-record-model',this.get('recordId'));
      riskModel.set('model',model);
      riskModel.validate().then(function(){
        if(riskModel.get('errors.length')===0){
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          riskModel.save().then(function(){
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            if(editMode=='add'){
              var mainpageController = App.lookup('controller:business.mainpage');
              mainpageController.switchMainPage('field-list');
            }else{
                _self.set('detailEdit',false);
            }
        },function(err){
          App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
        });
      }else{
        riskModel.set("validFlag",Math.random());
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
        this.get('riskInfo').rollbackAttributes();
      }else{
        this.get('riskInfo').rollbackAttributes();
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('field-list');
      }
    },
    //选择房间
    selectRisk(risk) {
        this.set('riskInfo.assess',risk);
        this.set('riskModel.assess',risk);
    },
    //删除按钮
    delById : function() {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此记录",function(){
        _self.send('cancelPassSubmit',_self.get('riskInfo'));
      });
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit(risk){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("showpopInvitePassModal",false);
      risk.set("delStatus", 1);
      risk.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('field-list');
      },function(err){
        App.lookup('controller:business.mainpage').showPopTip("删除失败",false);
      });
		},
  }
});
