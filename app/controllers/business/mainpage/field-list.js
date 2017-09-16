import Ember from 'ember';

export default Ember.Controller.extend({
    queryCondition:'',
    mainController: Ember.inject.controller('business.mainpage'),
    riskList:Ember.computed('allRiskList',function(){
      let allRiskList = this.get('allRiskList');
      let parentList = new Ember.A();
      let childrenList = new Ember.A();
      if(!allRiskList){
        return null;
      }
      allRiskList.forEach(function(risk){
        if(!risk.get('parent.id')){
          parentList.pushObject(risk);
        }else{
          childrenList.pushObject(risk);
        }
      });
      parentList.forEach(function(parent){
        let children = new Ember.A();
        childrenList.forEach(function(child){
          if(child.get('parent.id')==parent.get('id')){
            children.pushObject(child);
          }
        })
        parent.set('children',children.sortBy('sort'));
      });
      return parentList.sortBy('sort');
    }),
    actions:{
      //跳转至编辑页
      toDetailPage(risk){
        let recordId = this.get('recordId');
        if(risk){
          let id=risk.get('id');
          this.get("mainController").switchMainPage('field-detail',{id:id,editMode:"edit",recordId:recordId});
        }else{
          this.get("mainController").switchMainPage('field-detail',{editMode:"add",id:'',recordId:recordId});
        }
      },
    }

});
