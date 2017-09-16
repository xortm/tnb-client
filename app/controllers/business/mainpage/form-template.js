import Ember from 'ember';
import Changeset from 'ember-changeset';
import RiskValidations from '../../../validations/risk-record-model';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(RiskValidations,{
    queryCondition:'',
    mainController: Ember.inject.controller('business.mainpage'),
    riskModel:Ember.computed("riskInfo",function(){
      var model = this.get("riskInfo");
      if (!model) {
        return null;
      }
      return new Changeset(model, lookupValidator(RiskValidations), RiskValidations);
    }),
    actions:{
      //跳转至编辑页
      toDetailPage(risk){

        if(risk){
          this.set('riskInfo',risk);
          this.set('modelName','编辑');
        }else{
          this.set('riskInfo',this.store.createRecord('risk-record-model',{}));
          this.set('modelName','新增');
        }
        this.set('addModel',true);
      },
      //跳转设置字段
      toField(risk){
        let id=risk.get('id');
        this.get("mainController").switchMainPage('field-list',{recordId:id});
      },
      invitation(){
        this.set('addModel',false);
      },
      saveNewRisk(){
        let _self = this;
        let riskModel = this.get('riskModel');
        let assessType = this.store.peekRecord('risk-assess-model',_self.get('assessId'));
        riskModel.set('riskModel',assessType)
        riskModel.validate().then(function(){
          if(riskModel.get('errors.length')===0){
            App.lookup('controller:business.mainpage').showPopTip('正在保存');
            riskModel.save().then(function(){
              App.lookup('controller:business.mainpage').showPopTip('保存成功');
              _self.set('addModel',false);
              let route = App.lookup('route:business.mainpage.form-template');
              App.lookup('controller:business.mainpage').refreshPage(route);
            },function(err){
              App.lookup('controller:business.mainpage').showPopTip('保存失败',false);
            });
          }else{
            riskModel.set("validFlag",Math.random());
          }
        });
      },
      delById(risk){
        let _self = this;
        App.lookup('controller:business.mainpage').showConfirm("是否确定删除此记录",function(){
          _self.send('cancelPassSubmit',risk);
        });
      },
      cancelPassSubmit(risk){
        let _self = this;
        risk.set('delStatus',1);
        risk.save().then(function(){
          App.lookup('controller:business.mainpage').showPopTip('删除成功');
          let route = App.lookup('route:business.mainpage.form-template');
          App.lookup('controller:business.mainpage').refreshPage(route);
        },function(err){
          App.lookup('controller:business.mainpage').showPopTip('删除失败',false);
        });
      }
    }

});
