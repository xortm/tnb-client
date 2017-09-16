import Ember from 'ember';

export default Ember.Controller.extend({
    queryCondition:'',
    mainController: Ember.inject.controller('business.mainpage'),
    actions:{
      //跳转至编辑页
      toDetailPage(risk){
        let assessId = this.get('assessId');
        if(risk){
          let id=risk.get('id');
          this.get("mainController").switchMainPage('risk-level-detail',{id:id,editMode:"edit",assessId:assessId});
        }else{
          this.get("mainController").switchMainPage('risk-level-detail',{editMode:"add",id:'',assessId:assessId});
        }
      },
    }

});
