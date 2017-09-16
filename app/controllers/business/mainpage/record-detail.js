import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  mainController: Ember.inject.controller('business.mainpage'),
  pageConstructure:Ember.inject.service('page-constructure'),
  nocustomerId:false,
  infiniteContainerName:"recordDetailContainer",
  scrollPrevent:true,
  filedObs:function(){
    let _self = this;
    let parentFieldId = this.get('parentFieldId');
    let allFieldList = this.get('feedService.allFieldList');
    let parentField = allFieldList.findBy('id',parentFieldId);
    let resultFieldList = this.get('feedService.curResultFieldList');
    if(!parentFieldId){
      return ;
    }
    if(parentField.get('children.length')>0){//有子项的
      let childFields = new Ember.A();
      parentField.get('childrenList').forEach(function(field){
        let newField = resultFieldList.findBy('fieldId',field.get('id'));
        let valueType = newField.get('field.valueType.typecode');
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
    let result = this.get('feedService.curResult');
    this.set('result',result);
  }.observes('feedService.curResult','parentFieldId').on('init'),
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
    saveValue(field){
      let result = this.get('result');
      let _self = this;
      let elementId = "#save-record-detail";
      $(elementId).addClass("tapped");
      Ember.run.later(function(){
        $(elementId).removeClass("tapped");
        Ember.run.later(function(){
          field.set('recordResult',result);
          field.save().then(function(){
             App.lookup("controller:business").popTorMsg("保存成功");
             _self.get("mainController").switchMainPage('risk-result-record');
             _self.incrementProperty('global_curStatus.formChange');
          });
        },100);
      },200);
    },
    toNextPage(parent){
        this.get("mainController").switchMainPage('record-detail',{parentFieldId:parent.get('id')});
    },
    toRecordDetailChild(parent){
      this.get("mainController").switchMainPage('record-detail-child',{parentFieldId:this.get('parentFieldId'),childFieldId:parent.get('id')});
    },
    chooseParent(parent){
      let editModel = this.get('editModel');
      let recordModel = this.get('feedService.recordModelList').findBy('id',this.get('recordId'));
      let result = this.get('result');
      let field ;
      if(editModel="add"){//新增记录的模式下
        field = this.store.createRecord('risk-field-result',{});
        field.set('field',parent);
        field.set('recordResult',result);
      }else{
        field = this.get('feedService.curResultFieldList').findBy('field.id',parent.get('id'));
      }

      if(parent.get('hasSelcted')){
        parent.set('hasSelcted',false);
        field.set('value',false);
      }else{
        field.set('value',true);
        parent.set('hasSelcted',true);
      }
      field.save().then(function(){
        App.lookup("controller:business").popTorMsg("保存成功");
      });
    },
    switchShowAction(){
    },
  },
});
