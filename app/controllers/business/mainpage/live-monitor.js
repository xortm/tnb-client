import Ember from 'ember';

export default Ember.Controller.extend({
  dataLoader: Ember.inject.service("data-loader"),
  global_curStatus: Ember.inject.service("current-status"),
  deviceObjFlag:0,

  // deviceObj:new Ember.A(),
  DataObs:function(){
    let _self = this;
    let devicebindmores = this.get("devicebindmores");
    if(!devicebindmores){return;}
    let customerList = this.get("dataLoader").get("customerList");
    console.log("customerList in video:",customerList);
    let deviceList = new Ember.A();
    devicebindmores.forEach(function(item){
      if(item.get("room.id")){
        console.log("room in item",item.get("room"));
        let obj = Ember.Object.create({
          // itemId:item.get("id"),
          // bedId:null,
          // roomId:item.get("room.id"),
          // floorId:item.get("room.floor.id"),
          // buildingId:item.get("room.floor.building.id"),
          type:"room",
          bedName:0,
          roomName:item.get("room.name"),
          floorSeq:item.get("room.floor.name"),
          buildingSeq:item.get("room.floor.building.name"),
          deviceId:item.get("camera.id"),
          hasSelected:false,
          item: item,
        });
        deviceList.pushObject(obj);
      }else if (item.get("bed.id")) {
        console.log("bed in item",item.get("bed"));
        let customer = customerList.findBy("bedId",item.get("bed.id"));
        console.log("customer in video:",customer);
        let obj = Ember.Object.create({
          // itemId:item.get("id"),
          // bedId:item.get("bed.id"),
          // roomId:item.get("bed.room.id"),
          // floorId:item.get("bed.room.floor.id"),
          // buildingId:item.get("bed.room.floor.building.id"),
          type:"bed",
          customer:customer,
          bedName:item.get("bed.name"),
          roomName:item.get("bed.room.name"),
          floorSeq:item.get("bed.room.floor.name"),
          buildingSeq:item.get("bed.room.floor.building.name"),
          deviceId:item.get("camera.id"),
          hasSelected:false,
          item: item,
        });
        deviceList.pushObject(obj);
      }
    });
    let deviceListSort = deviceList.sortBy("buildingSeq","floorSeq","roomName","bedName");
    console.log("deviceListSort:",deviceListSort);

    let videoList = new Ember.A();
    let curBuilding = null;
    let curFloor = null;
    deviceListSort.forEach(function(deviceItem){
      let buildingSeqInloop = deviceItem.get("buildingSeq");
      if(!curBuilding||curBuilding.get("buildingSeq")!==buildingSeqInloop){
        curBuilding = Ember.Object.create({
          buildingSeq:buildingSeqInloop,
          // item:deviceItem,
          floors: new Ember.A(),
        });
        videoList.pushObject(curBuilding);
        _self.set("changeBuildingSeq",true);
      }

      let floorSeqInloop = deviceItem.get("floorSeq");
      console.log("floorSeqInloop:",floorSeqInloop);
      let changeBuildingSeq = _self.get("changeBuildingSeq");
      if(changeBuildingSeq||!curFloor||curFloor.get("floorSeq")!==floorSeqInloop){
        curFloor = Ember.Object.create({
          floorSeq:floorSeqInloop,
          devices: new Ember.A(),
        });
        curBuilding.get("floors").pushObject(curFloor);
        _self.set("changeBuildingSeq",false);
      }
      curFloor.get("devices").pushObject(deviceItem);
    });
    console.log("videoList after:",videoList);
    this.set("videoList",videoList);
    let deviceObj = new Ember.A();
    // let deviceObj = _self.get("global_curStatus.deviceObj");
    _self.set("deviceObj",deviceObj);

  }.observes('devicebindmores'),

  actions:{
    selectDevice(device) {
      let _self = this;
      console.log("hasSelected:",device.get('hasSelected'));
      let deviceObj = this.get("deviceObj");
      console.log("deviceObj in action:",deviceObj);
      if(device.get('hasSelected')){
        deviceObj.removeObject(device);
        device.set('hasSelected',false);
      }else{
        if(deviceObj.get("length") >= _self.get("global_curStatus.maxDeviceNumber")){
          App.lookup("controller:business.mainpage").showAlert("您最多可以选择四个监控设备同时播放！");
          return ;
        }else{
          device.set('hasSelected',true);
          deviceObj.pushObject(device);
          console.log("deviceObj in action after:",deviceObj);
        }
      }
    },
    playAction(){
      let _self = this;
      let deviceObj = this.get("deviceObj");
      console.log("deviceObj length:",deviceObj.get("length"));
      if(!deviceObj.get("length")){
        App.lookup("controller:business.mainpage").showAlert("请至少选择一个摄像头设备！");
        return ;
      }
      // this.set("deviceObj",deviceObj);
      this.incrementProperty("deviceObjFlag");
      this.set("global_curStatus.deviceObj",deviceObj);
      App.lookup('controller:business.mainpage').showPcVideoBox(this.get("deviceObjFlag"),deviceObj);
      // _self.get('store').query('device', {
      //   filter: {
      //     queryType: deviceIdStr
      //   }
      // }).then(function(customerList) {
      //   _self.hideAllLoading();
      //   _self.directInitScoll(true);
      // App.lookup('controller:business.mainpage').showMobileLoading();
      // });
    },
    backToList(){

    },

  },
});
