import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  mainController: Ember.inject.controller('business.mainpage'),
  nocustomerId:false,
  infiniteContainerName:"resultDetailChildContainer",
  scrollPrevent:true,
  fieldInfoObs:function(){//观察ID变化，更新fieldInfo数据
    let _self = this;
    let parentFieldId = this.get('parentFieldId');
    let allFieldList = this.get('feedService.allFieldList');
    let resultFieldList = this.get('feedService.curResultFieldList');
    let parentField = allFieldList.findBy('id',parentFieldId);
    let result = this.get('feedService.curResult');//当前的记录
    if(!parentFieldId){
      return;
    }
    if(parentField.get('children.length')>0){//有子项的
      let childFields = new Ember.A();
      parentField.get('childrenList').forEach(function(field){
        console.log('field name:',field.get('name'),field.get('id'));
        let newField = resultFieldList.findBy('fieldId',field.get('id'));
        let valueType = newField.get('field.valueType.typecode');
        console.log('newField value:',newField.get('value'),valueType);
        if(valueType == 'fieldType1'){
          newField.set('numType',true);
        }
        if(valueType == 'fieldType2'){
          newField.set('stringType',true);
        }
        if(valueType=='fieldType3'){
          newField.set('enumType',true);
        }
        if(valueType=='fieldType4'){
          newField.set('booleanType',true);
          if(newField&&newField.get('value')=='true'){
            console.log('come?');
            newField.set('hasSelcted',true);
          }else{
            newField.set('hasSelcted',false);
          }
        }
        childFields.pushObject(newField);
      });
      parentField.set('childFields',childFields);
      _self.set('lastLevel',false);
      _self.set('fieldInfo',parentField);
    }else{//没有子项，未最后一级
      _self.set('lastLevel',true);
      let newField = resultFieldList.findBy('fieldId',parentFieldId);
      let valueType =newField.get('field.valueType.typecode');
      if(valueType == 'fieldType1'){
        newField.set('numType',true);
      }
      if(valueType == 'fieldType2'){
        newField.set('stringType',true);
      }
      if(valueType=='fieldType3'){
        newField.set('enumType',true);
      }
      if(valueType=='fieldType4'){
        newField.set('booleanType',true);
        if(newField&&newField.get('value')=='true'){
          console.log('new Field id'+newField.get('id'));
          newField.set('hasSelcted',true);
        }else{
          newField.set('hasSelcted',false);
        }
      }
      _self.set('fieldInfo',newField);
    }
  }.observes('parentFieldId',"global_curStatus.healtyCustomerId",'feedService.curResult','global_curStatus.formChange','global_curStatus.pageBackTime').on('init'),
  customerObs: function(){
    var _self = this;
    var customerId = this.get("global_curStatus.healtyCustomerId");
    if(!customerId){
      this.set("nocustomerId",true);
      _self.hideAllLoading();
      return;
    }else{
      this.set("stopScroll",false);
    }
    this.set("nocustomerId",false);
    this.set("customerId",customerId);
    _self.hideAllLoading();
  }.observes("global_curStatus.healtyCustomerId",).on("init"),
  actions:{
    saveRecord(){},
    chooseParent(parent){
      let _self = this;
      let result = this.get('feedService.curResult');
      let field = this.get('feedService.curResultFieldList').findBy('fieldId',parent.get('id'));//取以前有的
      //
      // if(!field){//以前没有的记录，重新生成新的
      //   field = this.store.createRecord('risk-field-result',{});
      //   field.set('field',parent);
      // }
      if(parent.get('hasSelcted')){
        parent.set('hasSelcted',false);
        parent.set('value',false);
      }else{
        parent.set('hasSelcted',true);
        parent.set('value',true);
      }
      parent.set('recordResult',result);
      console.log('chooseParent',parent.get('field.id'),parent.get('value'));
      parent.save().then(function(list){
        _self.get('feedService.curResultFieldList').pushObject(list);
      });
    },
    toNextPage(parent){
        this.get("mainController").switchMainPage('record-child-detail',{parentFieldId:parent.get('field.id'),fromRoute:'child'});
    },
    switchShowAction(){
    },
  },
});
