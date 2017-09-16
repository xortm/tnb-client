import Ember from 'ember';

export default Ember.Controller.extend({
  constants: Constants,
  queryCondition:'',
  mainController: Ember.inject.controller('business.mainpage'),
  actions:{
    //跳转房间编辑页
    toDetailPage(room){
      if(room){
        let id=room.get('id');
        this.get("mainController").switchMainPage('room-detail',{id:id,editMode:"edit"});//详情页
      }else{
        this.get("mainController").switchMainPage('room-detail',{editMode:"add",id:''});//新增页
      }
    },
  }
});
