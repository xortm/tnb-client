import Ember from 'ember';
import BaseBusiness from '../base-business';
const {publicType} = Constants;

export default BaseBusiness.extend({
  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
  },


  // detailEdit:true,
  header_title:'公共区域信息',
  model(){
    return{};
  },
  setupController(controller, model){
    let _self = this;
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      _self.store.findRecord('room',id).then(function(roomInfo){
        controller.set('roomInfo',roomInfo);
      });
    }else{
      var roomInfo = this.store.createRecord('room',{});
      controller.set('roomInfo',roomInfo);
      roomInfo.set("isPublicFlag",1);//设置为公共区域
      controller.set('detailEdit',true);
    }
    var buildingList = this.store.peekAll('building');
    buildingList.forEach(function(build){
      build.set('namePinyin',build.get("name"));
    });
    controller.set('buildingList',buildingList);

    //扫描器列表
    _self.store.query('device',{
      filter:{
        '[status][typecode]':'deviceStatus1',
        'deviceStatus':1,
        '[deviceType][typecode]':'deviceType2'
      }
    }).then(function(deviceList){
      controller.set('deviceList',deviceList);
    });
  }
});
