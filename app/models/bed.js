import DS from 'ember-data';
import BaseModel from './base-model';

var Bed = BaseModel.extend({
  dataLoader: Ember.inject.service("data-loader"),

  button:DS.belongsTo('device'),//小米按键ID
  name:DS.attr('string'),//床位名称
  price:DS.attr('string'),//日价格
  totalPrice:DS.attr('string'),//月价格
  status:DS.belongsTo('dicttype'),//状态  已分配、未分配
  createDateTime:DS.attr('number'),//创建时间
  lastUpdateDateTime:DS.attr('number'),//更新时间
  room:DS.belongsTo('room'),//所属房屋
  bedType:DS.belongsTo('dicttype'),//床位类型
  lastUpdateUser:DS.belongsTo('user'),//更新操作者userid
  nursingType:DS.belongsTo('dicttype'),//护理类型
  createUser:DS.belongsTo('user'),//创建者ID
  // parent: DS.belongsTo('room', {
  //     inverse: 'children'
  // }),
  // groups:DS.hasMany('nursegroup'),//所属护理组
  //床位使用状态
  useStatus:Ember.computed('status',function(){
    let status = this.get('status');
    if(status.get('typecode')=='bedStatusIdle'||!status.get('typecode')){
      return '未使用';
    }else{
      return '使用中';
    }
  }),
  hasIn:Ember.computed('status',function(){
    let status = this.get('status');
    if(status.get('typecode')=='bedStatusIdle'){
      return false;
    }else{
      return true;
    }
  }),
  //是否可以删除
  del:Ember.computed('useStatus',function(){
    let useStatus = this.get('useStatus');
    if(useStatus=='未使用'){
      return true;
    }else{
      return false;
    }
  }),
  roomBedName:Ember.computed("room","name",function(){
    var bedName=this.get("name");
    if(!this.get("room.id")||!this.get("room.name")){
      // console.log("floor empty and id:" + this.get("floor.id"));
      if(!this.get("dataLoader").get("allRoomList")){
        return "";
      }
      var room = this.get("dataLoader").get("allRoomList").findBy("id",this.get("roomId"));
      this.set("room",room);
    }
    let roomName = this.get('room.name');
    return roomName + '-' + bedName;
  }),
  roomName:Ember.computed("roomBedName",function(){
    var roomBedName=this.get("roomBedName");
    return roomBedName.split("-").join("");
  }),
  allBedName:Ember.computed("name","room",function(){
    var bedName=this.get("name");
    console.log('bedmodel:room',this.get('id')+','+this.get('room.id') + " and roomId:" + this.get("roomId"));
    //如果没有取得上级对象，先从全局查一下
    if(!this.get("room.id")||!this.get("room.name")){
      // console.log("floor empty and id:" + this.get("floor.id"));
      if(!this.get("dataLoader").get("allRoomList")){
        return "";
      }
      var room = this.get("dataLoader").get("allRoomList").findBy("id",this.get("roomId"));
      this.set("room",room);
    }
    var allName=this.get("room.allName");
    return allName+"-"+bedName;
  }),
  buildingRoomBed:Ember.computed('name','room',function(){
    let bedName = this.get('name');
    let roomName = this.get('room.name');
    let buildingName = this.get('room.floor.building.name');
    return buildingName+'   '+roomName+'-'+bedName+'床';
  }),
  drugBedName:Ember.computed('name','room',function(){
    let bedName = this.get('name');
    let roomName = this.get('room.name');
    let buildingName = this.get('room.floor.building.name');
    return buildingName+'   '+roomName+'-'+bedName;
  }),
  buildingFloorName:Ember.computed('name','room',function(){
    let buildingName = this.get('room.floor.building.name');
    let floorName=this.get('room.floor.name');
    
      if(!this.get("room.floorId")||!this.get("room.floor.name")){
        if(!this.get("dataLoader").get("allFloorList")){
          return "";
        }
        let bed = this.get('dataLoader.beds').findBy('id',this.get('id'));
        let room = this.get('dataLoader.allRoomList').findBy("id",bed.get("roomId"));
        var floor = this.get("dataLoader").get("allFloorList").findBy("id",room.get("floorId"));
        this.set("floor",floor);
        floorName = this.get('floor.name');
        buildingName = floor.get('building.name');
      }
      if(!buildingName){
        if(!this.get("dataLoader").get("allBuildingList")){
          return "";
        }
        let floor = this.get("dataLoader").get("allFloorList").findBy("id",this.get("room.floor.building.id"));
        this.set("build",build);
        buildingName = build.get('building.name');
      }

      return buildingName+'-'+floorName;


  })
});

export default Bed;
