import Ember from 'ember';

export default Ember.Controller.extend({
    constants: Constants,
    queryCondition:'',
    mainController: Ember.inject.controller('business.mainpage'),

    actions:{
      //跳转至编辑页
      toDetailPage(bed){
        if(bed){
          let id=bed.get('id');
          this.get("mainController").switchMainPage('bed-detail',{id:id,editMode:"edit"});
        }else{
          this.get("mainController").switchMainPage('bed-detail',{editMode:"add",id:''});
        }
      },
    }

});
