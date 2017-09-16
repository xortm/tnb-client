import Ember from 'ember';
import BaseBusiness from '../base-business';
const { taskStatus_begin,taskStatus_isPassed,taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail,taskApplyStatus_invited,taskApplyStatus_SuccNotLocateSeat,taskApplyStatus_refuseInvitation,fieldType1,fieldType2,fieldType3,fieldType4} = Constants;

export default BaseBusiness.extend({

  pageyModelListName: "content",
  feedService: Ember.inject.service('feed-bus'),
  header_title: Ember.computed("global_curStatus.healtyCustomerId",function() {
    let healtyCustomer  = this.get("global_curStatus.healtyCustomer");
    let customerName = healtyCustomer.get("name");
    return '业务子内容项(' + customerName +')';
  }),
  queryParams: {
    parentFieldId: {
        refreshModel: true
    }
  },

  model() {
    return {};
  },
  setupController(controller, model){
    var _self = this;
    this._super(controller, model);
    let parentFieldId = this.getCurrentController().get('parentFieldId');
    let allFieldList = this.get('feedService.allFieldList');
    let parentField = allFieldList.findBy('id',parentFieldId);
    let resultFieldList = this.get('feedService.curResultFieldList');
    if(parentField.get('children.length')>0){//有子项的
      parentField.get('children').forEach(function(field){
        let valueType = field.get('valueType.typecode');
        let item;
        if(resultFieldList){
          item = resultFieldList.findBy('field.id',field.get('id'));
        }
        field.set('editModel','add');
        if(valueType == 'fieldType1'){
          field.set('numType',true);
          if(item){
            field.set('value',item.get('value'));
            field.set('editModel','edit');
          }
        }
        if(valueType == 'fieldType2'){
          field.set('stringType',true);
          if(item){
            field.set('value',item.get('value'));
            field.set('editModel','edit');
          }
        }
        if(valueType=='fieldType3'){
          field.set('enumType',true);
        }
        if(valueType=='fieldType4'){
          field.set('booleanType',true);
          if(item){
            field.set('hasSelcted',true);
          }
        }
      });
      controller.set('lastLevel',false);
      controller.set('fieldInfo',parentField);
    }else{//没有子项，未最后一级
      controller.set('lastLevel',true);
      let item = resultFieldList.findBy('field.id',parentField.get('id'));
      let valueType = parentField.get('valueType.typecode');
      if(valueType == 'fieldType1'){
        parentField.set('numType',true);
        if(item){
          parentField.set('value',item.get('value'));
          parentField.set('editModel','edit');
        }
      }
      if(valueType == 'fieldType2'){
        parentField.set('stringType',true);
        if(item){
          parentField.set('value',item.get('value'));
          parentField.set('editModel','edit');
        }
      }
      if(valueType=='fieldType3'){
        parentField.set('enumType',true);
      }
      if(valueType=='fieldType4'){
        parentField.set('booleanType',true);
        if(item){
          field.set('hasSelcted',true);
        }
      }
      controller.set('fieldInfo',parentField);
    }
  },
});
