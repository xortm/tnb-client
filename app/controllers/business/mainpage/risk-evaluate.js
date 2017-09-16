import Ember from 'ember';
import Changeset from 'ember-changeset';
import EvaValidations from '../../../validations/evaluatemodel';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(EvaValidations,{
    statusService: Ember.inject.service("current-status"),
    dataLoader: Ember.inject.service("data-loader"),
    addNewEva:false,
    constants: Constants,
    title:'',
    queryCondition:'',
    showpopInvitePassModal:false,
    mainController: Ember.inject.controller('business.mainpage'),
    actions:{
      useEva(eva){
        let _self = this;
        if(eva.get('useFlag')==1){
          App.lookup('controller:business.mainpage').showConfirm("是否确定启用该模板",function(){
            _self.send('cancelPassSubmit',eva,'模板已启用');
          });
        }else{
          App.lookup('controller:business.mainpage').showConfirm("是否确定禁用该模板",function(){
            _self.send('cancelPassSubmit',eva,'模板已禁用');
          });
        }
      },
      cancelPassSubmit(eva,str){
        if(eva.get('useFlag')==1){
          eva.set('useFlag',0);
        }else{
          eva.set('useFlag',1);
        }
        eva.save().then(function(){
          App.lookup('controller:business.mainpage').showPopTip(str);
        });
      },
      invalid() {
          //alert("error");
      },
      addEva(){
        this.set('addNewEva',true);
      },
      saveNewEva(){
        var _self=this;
        var curUser = this.get("statusService").getUser();
        var newEva=this.store.createRecord('evaluatemodel',{});
        let assessId = this.get('assessId');
        let riskModel = this.store.peekRecord('risk-assess-model',assessId);
        newEva.set('riskAssessModel',riskModel);
        //设置模板类型，护理类
        let type = this.get("dataLoader").findDict("evaluateType1");
        console.log('模板类型：',type.get('typename'));
        newEva.set('type',type);
        newEva.set('title',this.get('title'));
        newEva.set('createUser',curUser);
        newEva.set('delStatus',1);
        let evaModel = new Changeset(newEva,lookupValidator(EvaValidations), EvaValidations);
        evaModel.set('title',this.get('title'));
        this.set('evaModel',evaModel);
        evaModel.validate().then(function(){
          if(evaModel.get('errors.length')===0){
            newEva.save().then(function(newEva){
              _self.set('addNewEva',false);
              _self.set('title','');
              _self.get("mainController").switchMainPage('risk-evaluate-detail',{editMode:"add",id:newEva.get('id')});
            },function(err){
              let error = err.errors[0];
              if(error.code==="4"){
                evaModel.validate().then(function(){
                  evaModel.addError('title',['该名称已被占用']);
                  evaModel.set("validFlag",Math.random());
                  App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
                });
              }
            });
          }else{
            evaModel.set("validFlag",Math.random());
          }
        });

      },
      invitation(){
        this.set('addNewEva',false);
      },
      goDetail(eva){
          let id=eva.get('id');
          let assessId = this.get('assessId');
          this.get("mainController").switchMainPage('risk-evaluate-detail',{id:id,editMode:"edit"});
      }

    }
});
