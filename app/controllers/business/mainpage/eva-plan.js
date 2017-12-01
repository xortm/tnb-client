import Ember from 'ember';
import Changeset from 'ember-changeset';
import EvaValidations from '../../../validations/evaluatemodel';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(EvaValidations,{
    statusService: Ember.inject.service("current-status"),
    dataLoader:Ember.inject.service('data-loader'),
    addNewEva:false,
    constants: Constants,
    title:'',
    queryCondition:'',
    showpopInvitePassModal:false,
    modelTypeChoose:true,
    mainController: Ember.inject.controller('business.mainpage'),
    modelTypeList:Ember.computed('evaModel','allTypeList','modelTypeChoose',function(){
      let evaModel = this.get('evaModel');
      let allTypeList = this.get('allTypeList');
      if(!evaModel){
        return ;
      }
      return allTypeList.filter(function(type){
        return type.get('modelSource.id') == evaModel.get('modelSource.id');
      });
    }),
    //判断租户是否为基本租户（tenant111）
    isBaseTenant:Ember.computed('statusService.tenantId',function(){
      let statusService = this.get('statusService');
      let tenantId = statusService.get('tenantId');
      if(tenantId == '111'){
        return true;
      }else{
        return false;
      }
    }),
    evaModel:Ember.computed("evaInfo",function(){
      var model = this.get("evaInfo");
      if (!model) {
        return null;
      }
      return new Changeset(model, lookupValidator(EvaValidations), EvaValidations);
    }),
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
        var curUser = this.get("statusService").getUser();
        let isBaseTenant = this.get('isBaseTenant');
        var newEva=this.store.createRecord('evaluatemodel',{});
        newEva.set('title',this.get('title'));
        newEva.set('createUser',curUser);
        newEva.set('delStatus',1);
        //新增时设置默认的规范类型和评估类型
        let sourceList = this.get('modelSourceList');
        let modelSource;
        if(isBaseTenant){
          modelSource = sourceList.findBy('remark','beijing');
        }else{
          modelSource = sourceList.findBy('remark','qita');
        }
        this.set('evaInfo',newEva);
        this.send('selectModelSource',modelSource);
      },
      //选择模板规范
      selectModelSource(modelSource){
        this.set('evaModel.modelSource',modelSource);
        let isBaseTenant = this.get('isBaseTenant');
        if(isBaseTenant){
          if(modelSource.get('remark')=='beijing'){
            this.set('modelTypeChoose',true);
            let modelType = this.get('modelTypeList.firstObject');
            this.set('evaModel.modelType',modelType);
          }else{
            this.set('modelTypeChoose',false);
          }
        }

      },
      //选择模板评估类型
      selectModelType(modelType){
        this.set('evaModel.modelType',modelType);
      },
      saveNewEva(){
        var _self=this;
        let evaModel = this.get('evaModel');
        evaModel.set('title',this.get('title'));
        evaModel.validate().then(function(){
          if(evaModel.get('errors.length')===0){
            evaModel.save().then(function(newEva){
              _self.set('addNewEva',false);
              _self.set('title','');
              _self.get("mainController").switchMainPage('eva-plan-detail',{editMode:"add",id:evaModel.get('id')});
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
        this.set('title','');
      },
      goDetail(eva){
          let id=eva.get('id');
          this.get("mainController").switchMainPage('eva-plan-detail',{id:id,editMode:"edit"});
      }

    }
});
