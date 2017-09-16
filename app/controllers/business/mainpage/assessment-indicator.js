import Ember from 'ember';
import BaseController from './base-controller';
import Changeset from 'ember-changeset';
import AssessmentValidations from '../../../validations/assessment-indicator';
import lookupValidator from 'ember-changeset-validations';

export default BaseController.extend(AssessmentValidations,{
  detailFlag: false,
  indicatorModel: null,
  dataloader: Ember.inject.service('data-loader'),
  mainController: Ember.inject.controller('business.mainpage'),
  childrenList:Ember.computed('allAssessmentList','curParent',function(){
    let allAssessmentList = this.get('allAssessmentList');
    if(!allAssessmentList){
      return ;
    }
    let curParent = this.get('curParent');
    let list = new Ember.A();
    allAssessmentList.forEach(function(item){
      if(item.get('parent.id')==curParent.get('id')){
        list.pushObject(item);
      }
    });

    return list;
  }),
  assessmentModel:Ember.computed("newAssessment",function(){
    var model = this.get("newAssessment");
    if (!model) {
      return null;
    }
    return new Changeset(model, lookupValidator(AssessmentValidations), AssessmentValidations);
  }),
  actions: {
    //新增考核
    toAddParent(str){
      if(str=='child'){
        this.set('childModel',true);
      }else{
        this.set('parentModel',true);
        this.set('modelName','新增');
      }
      this.set('newAssessment',this.store.createRecord('assessment-indicator',{}));
    },
    invitation(){
      this.set('parentModel',false);
      this.set('childModel',false);
      this.set('newAssessment',null);
    },
    //保存考核指标
    saveNewAssessment(str){
      let assessment = this.get('newAssessment');
      let _self = this;
      let assessmentModel = this.get('assessmentModel');
      if(str=="child"){
        assessment.set('parent',this.get('curParent'));
        assessment.set('level',1);
      }else{
        assessment.set('level',0);
      }
      assessmentModel.validate().then(function(){
        if(assessmentModel.get('errors.length')==0){
          App.lookup('controller:business.mainpage').showPopTip('正在保存');
          assessment.save().then(function(){

            _self.set('parentModel',false);
            _self.set('childModel',false);
            App.lookup('controller:business.mainpage').showPopTip('保存成功');
            var route = App.lookup('route:business.mainpage.assessment-indicator');
            App.lookup('controller:business.mainpage').refreshPage(route);
          },function(err){
            App.lookup('controller:business.mainpage').showPopTip('保存失败',false);
          });
        }else{
          assessmentModel.set("validFlag",Math.random());
        }
      });
    },
    //选择考核指标
    chooseParent(assessment){
      this.get('assessmentList').forEach(function(item){
        item.set('hasChoosed',false);
      });
      assessment.set('hasChoosed',true);
      this.set('curParent',assessment);
    },
    //编辑指标名称
    detailEditClick(item){
      this.set('parentModel',true);
      this.set('modelName','编辑');
      this.set('newAssessment',item);
    },
    //编辑考核细节
    editChild(child,str){
      if(str=='name'){
        child.set('editScore',false);
        child.set('editName',true);
      }
      if(str=='score'){
        child.set('editName',false);
        child.set('editScore',true);
      }
    },
    saveChild(child){

      if(!child.get('name')){
        App.lookup('controller:business.mainpage').showAlert('名称不能为空');
        return;
      }
      if(!child.get('maxScore')){
        App.lookup('controller:business.mainpage').showAlert('分数不能为空');
        return ;
      }
      if(child.get('name')&&child.get('maxScore')){
        child.set('editScore',false);
        child.set('editName',false);
        child.save().then(function(){
          App.lookup('controller:business.mainpage').showSimPop("保存成功");
        });
      }
    },
    //删除指标
    delById(assessment){
      let _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此考核",function(){
        _self.send('cancelPassSubmit',assessment);
      });
    },
    cancelPassSubmit(item){
      item.set('delStatus',1);
      item.save().then(function(){
        var route = App.lookup('route:business.mainpage.assessment-indicator');
        App.lookup('controller:business.mainpage').refreshPage(route);
      },function(err){
        let error = err.errors[0];
        if(error.code==0){
          App.lookup('controller:business.mainpage').showPopTip("已有考核结果，无法删除",false);
        }
      });
    },
    //悬浮
    hoverAssessment(assessment){
      assessment.set('hover',true);
    },
    leaveAssessment(assessment){
      assessment.set('hover',false);
    },
    //保存指标名称
    saveAssessment(assessment){
      assessment.save().then(function(){
        console.log('保存成功');
        assessment.set('edit',false);
      });
    },


  }
});
