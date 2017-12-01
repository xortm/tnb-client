import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  global_dataLoader: Ember.inject.service('data-loader'),
  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
  },
  detailEdit:true,
  header_title:'房间信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    console.log('********room detail in route in dist********');
    let _self = this;
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    let allBedList = this.get('global_dataLoader.allBedList');
    let buildingList = this.store.peekAll("building");

      buildingList.forEach(function(build){
        build.set('namePinyin',pinyinUtil.getFirstLetter(build.get("name")));
      });
      controller.set('buildingList',buildingList);

      if(editMode=='edit'){
        controller.set('addModel',false);
        controller.set('detailEdit',false);

        // _self.store.query('bed',{filter:{room:{id:id}}}).then(function(bedList){
        //   controller.set('bedList',bedList);
        //   let roomInfo = _self.store.peekRecord('room',id);
        //     controller.set('roomInfo',roomInfo);
        // });
        let bedList = allBedList.filter(function(bed){
          return bed.get('roomId') == id ;
        });
        controller.set('bedList',bedList);
        let roomInfo = _self.store.peekRecord('room',id);
            controller.set('roomInfo',roomInfo);
      }else{
        controller.set('roomInfo',Ember.Object.create({}));
        controller.set('addModel',true);
        controller.set('detailEdit',true);
        controller.set('bedList',new Ember.A());

      }
      //查询所有硬件类型为华米-button的设备
     _self.store.query('device',{
       filter:{
         '[status][typecode]':'deviceStatus1',
         'deviceStatus':1,
         '[deviceType][typecode]':'deviceType3'
       }
     }).then(function(deviceList){
       controller.set('buttonList',deviceList);
     });
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
