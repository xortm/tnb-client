import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  mainController: Ember.inject.controller('business.mainpage'),
  nocustomerId:false,
  infiniteContainerName:"resultResultRecordContainer",
  scrollPrevent:true,
  customerObs: function(){
    var _self = this;
    let resultId = this.get('resultId');
    console.log('resultId in risk-record-result',resultId);
    let recordId = this.get('recordId');
    var customerId = this.get("global_curStatus.healtyCustomerId");
    if(!recordId){
      return;
    }
      //取所属记录模板的所有内容项数据
      this.store.query('risk-record-field',{filter:{model:{id:recordId}},sort:{sort:'asc'}}).then(function(fieldList){
        _self.set('feedService.allFieldList',fieldList);//将该表的所有内容项放入全局
        let template = _self.store.peekRecord('risk-record-result',resultId);//当前结果
        _self.store.query('risk-field-result',{filter:{recordResult:{id:resultId,customer:{id:customerId}}}}).then(function(resultFieldList){
          let list = new Ember.A();
          resultFieldList.forEach(function(item){
            list.pushObject(item);
          });

          let recordModel = _self.get('feedService.recordModelList').findBy('id',recordId);//当前所用记录模板
          let parentFieldList = new Ember.A();//父级内容项
          fieldList.forEach(function(field){
            let newField ;
            if(resultFieldList.findBy('fieldId',field.get('id'))){//已有的记录
              newField = resultFieldList.findBy('field.id',field.get('id'));
            }else{//没有的记录
              newField = _self.store.createRecord('risk-field-result',{});
              newField.set('field',field);
              newField.set('result',template);
              list.pushObject(newField);
            }
            _self.set('feedService.curResultFieldList',list);//当前已有的记录集合
            if(newField.get('field.valueType.typecode')=='fieldType4'){
              if(newField.get('value')==true){
                newField.set('hasSelcted',true);
              }
            }
            if(field.get('children.length')>0){
              newField.set('hasChild',true);
            }
            if(!newField.get('field.parent.id')){//将最高级的元数据放入列表
              parentFieldList.pushObject(newField);
            }
          });
          template.set('recordModel',recordModel);
          template.set('parentFieldList',parentFieldList);
          _self.set('feedService.curResult',template);
          _self.set('template',template);
          _self.set('user',template.get('user'));
          _self.set('dateStr',template.get('recordTimeStr'));
        });
      });
    this.set("nocustomerId",false);
    this.set("customerId",customerId);
    _self.hideAllLoading();

  }.observes("global_curStatus.healtyCustomerId",'resultId','recordId','global_curStatus.formChange','global_curStatus.pageBackTime').on("init"),
  actions:{
    saveRecord(){
      let result = this.get('template');
      let _self = this;
      let recordId = this.get('recordId');

      let elementId = "#save-result-record";
      $(elementId).addClass("tapped");
      Ember.run.later(function(){
        $(elementId).removeClass("tapped");
        Ember.run.later(function(){
          result.set('model',_self.get('feedService.recordModelList').findBy('id',recordId));
          result.save().then(function(){
             App.lookup("controller:business").popTorMsg("保存成功");
             _self.get("mainController").switchMainPage('risk-form-management');
             _self.set('formEditModel',null);
             _self.incrementProperty('global_curStatus.pageBackTime');
          });
        },100);
      },200);
    },
    toNextPage(parent){
      this.get("mainController").switchMainPage('record-detail',{parentFieldId:parent.get('field.id'),resultId:this.get('template.id')});
    },
    chooseParent(parent){
      let editModel = this.get('editModel');
      let recordModel = this.get('feedService.recordModelList').findBy('id',this.get('recordId'));
      let result ;
      let field ;
      if(editModel="add"){//新增记录的模式下
        result = this.get('template');
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
      parent.save().then(function(){
        App.lookup("controller:business").popTorMsg("保存成功");
      });

    },
    toRecordDetailChild(parent){
      let _self = this;

      let elementId = '#risk-result-record-' + parent.get('field.id');
      $(elementId).addClass("tapped");
      Ember.run.later(function() {
          $(elementId).removeClass("tapped");
          Ember.run.later(function() {
              _self.get("mainController").switchMainPage('record-detail-child',{parentFieldId:parent.get('field.id')});
          }, 100);
      }, 200);
    },
    switchShowAction(){
      this.directInitScoll();
    },
    //跳转选择 self-choose
    toChoose: function(str,elementId) {
        let _self = this;
        let flag ;
        if(str=='user'){
          flag = 'staff';
        }
        if(str=='date'){
          flag = 'date'
        }
        let params = {
            source: str,
            resultId: _self.get('template.id'),
            editType: flag
        };
        let itemId = elementId;
        $("#" + itemId).addClass("tapped");
        Ember.run.later(function() {
            $("#" + itemId).removeClass("tapped");
            Ember.run.later(function() {
                let mainController = App.lookup("controller:business.mainpage");
                mainController.switchMainPage('forem-template-edit', params);
            }, 100);
        }, 200);
    },
  },
});
