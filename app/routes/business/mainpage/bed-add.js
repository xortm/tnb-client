import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  header_title:'增加床位',
  model(){
    return {};
  },
  setupController:function(controller,model){
    controller.set('roomList',null);
    this._super(controller,model);
    this.store.query('room',{}).then(function(roomList){
      controller.set('roomList',roomList);
    });
  }
});
