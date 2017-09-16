import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
  },
  header_title:'床位信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      this.store.findRecord('bed',id).then(function(bedInfo){
        controller.set('bedInfo',bedInfo);
      });
    }else{
      controller.set('detailEdit',true);
      controller.set('bedInfo',this.store.createRecord('bed',{}));
    }
    this.store.query('room',{}).then(function(roomList){
      roomList.forEach(function(room){
        room.set('namePinyin',pinyinUtil.getFirstLetter(room.get("name")));
      });
      controller.set('roomList',roomList);
      controller.set('roomListFirst',roomList.get('firstObject'));
    });

  }
});
