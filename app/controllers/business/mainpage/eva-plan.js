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
              _self.get("mainController").switchMainPage('eva-plan-detail',{editMode:"add",id:newEva.get('id')});
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
          this.get("mainController").switchMainPage('eva-plan-detail',{id:id,editMode:"edit"});
      }

    }
});
