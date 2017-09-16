import Ember from 'ember';
import Changeset from 'ember-changeset';
import EvaValidations from '../../../validations/evaluatemodel';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(EvaValidations,{
    statusService: Ember.inject.service("current-status"),
    addNewEva:false,
    constants: Constants,
    title:'',
    queryCondition:'',
    showpopInvitePassModal:false,
    mainController: Ember.inject.controller('business.mainpage'),
    actions:{
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
              _self.get("mainController").switchMainPage('evaluate-plan-detail',{editMode:"add",id:newEva.get('id')});
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
      //跳转楼层编辑页
      goDetail(eva){
          let id=eva.get('id');
          this.get("mainController").switchMainPage('evaluate-plan-detail',{id:id,editMode:"edit"});
      }

    }
});
