import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
export default BaseBusiness.extend(Pagination,{
  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
      code: {
          refreshModel: true
      },
  },
  global_dataLoader: Ember.inject.service('data-loader'),
  detailEdit:true,
  header_title:'智能设备信息',
  //处理设备信息，放入绑定的房间、床位
  setDeviceBind:function(deviceList){
    let allRoomList =this.getCurrentController().get('allRoomList');
    let allBedList = this.getCurrentController().get('allBedList');
    let publicRooms = this.getCurrentController().get('publicRooms');
    let videoBindList = this.getCurrentController().get('videoBindList');//已绑定设备的列表
    deviceList.forEach(function(device){//拼接绑定信息
      if(videoBindList&&videoBindList.findBy('camera.id',device.get('id'))){
        let room = videoBindList.findBy('camera.id',device.get('id')).get('room');
        let bed = videoBindList.findBy('camera.id',device.get('id')).get('bed');
        if(room.get('id')){
          device.set('bindName',room.get('allName'));
          device.set('bindPeople',false);
          let bindUser = '房间：' + room.get('allName');
          device.set('bindUser',bindUser);
        }else if(bed.get('id')){
          device.set('bindPeople',false);
          let bindUser = '床位：' + bed.get('allBedName');
          device.set('bindName',bed.get('allBedName'));
          device.set('bindUser',bindUser);
        }
        device.set('hasBind',true);
        device.set('delFlag',false);
      }else{
        device.set('hasBind',false);
        device.set('delFlag',true);
      }
      device.set('unBindDevice',false);
      device.set('delDeviceMask',false);
      device.set('bindDeviceMask',false);
      device.set('isVideo',true);
      device.set('isBindRoom',true);
      device.set('colorClass','video-color');
    });
  },
  buildQueryParams:function(search){
    let params=this.pagiParamsSet();
    let curController = this.getCurrentController();
    let filter={};
    if(curController&&search){
      if(curController.get('deviceStatusSearch')){
        //如果已选设备状态
        filter = $.extend({}, filter, {status:curController.get('deviceStatusSearch.code')});
      }
      if(curController.get('liveStatusSearch')){
        //如果已选直播状态
        filter = $.extend({}, filter, {deviceStatus:curController.get('liveStatusSearch.code')});
      }
    }

    params.filter = filter;
    this.set('perPage',24);
    return params;
  },
  doQuery(search){
    let _self = this;
    let params=this.buildQueryParams(search);
    let allRoomList = _self.get('global_dataLoader.allRoomList');
    let allBedList = _self.get('global_dataLoader.allBedList');
    //取公共区域列表
    _self.store.query('room',{filter:{isPublicFlag:1}}).then(function(publicRooms){
      _self.getCurrentController().set('publicRooms',publicRooms);
      console.log('all roomList length in device:',allRoomList.get('length'));
      let publicList = new Ember.A();
      publicRooms.forEach(function(item){
        item.set('floorId',item.get('floor.id'));
        publicList.pushObject(item);
      });
      allRoomList.pushObjects(publicList);
      _self.getCurrentController().set('allRoomList',allRoomList);
      console.log('all publicroomList length in device:',allRoomList.get('length'));
      _self.getCurrentController().set('allBedList',allBedList);
      _self.findPaged('camera',params,function(deviceList){

        _self.setDeviceBind(deviceList);
      }).then(function(deviceList){
        _self.getCurrentController().set('deviceList',deviceList);
      },function(err){
        console.log('设备列表请求失败',err);
      });
    });

  },
  model(){
    return{};
  },
  setupController(controller, model){
    let _self = this;
    this._super(controller, model);
    let editMode=this.getCurrentController().get('editMode');
    let id=this.getCurrentController().get('id');
    let code = this.getCurrentController().get('code');
    controller.set('deviceList',null);
    let typecode;
    switch (code) {
      case '04':
        typecode = "video";
        break;
    }
    if(code){
      let deviceType;
        _self.store.query('devicebindmore',{}).then(function(videoBindList){
            controller.set('videoBindList',videoBindList);
            _self.doQuery();
            controller.set('deviceStatusSearch',null);
            controller.set('deviceTypeSearch',null);
        });
      this.store.query('deviceTypeItem',{filter:{type:{codeInfo:typecode}}}).then(function(deviceTypeList){
        controller.set('deviceTypeList',deviceTypeList);
      });
    }
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      this.store.findRecord('device',id).then(function(deviceInfo){
        controller.set('deviceInfo',deviceInfo);
      });
    }else{
      controller.set('deviceInfo',this.store.createRecord('device',{}));
      controller.set('detailEdit',true);
    }
    this.store.query('devicetype',{}).then(function(devicetypeList){
      devicetypeList.forEach(function(devicetype){
        devicetype.set('namePinyin',pinyinUtil.getFirstLetter(devicetype.get("deviceName")));
      });
      controller.set('devicetypeList',devicetypeList);
    });
  }
});
