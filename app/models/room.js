import DS from 'ember-data';
import BaseModel from './base-model';

var Room = BaseModel.extend({
  dataLoader: Ember.inject.service("data-loader"),

  name:DS.attr('string'),//名称
  seq:DS.attr('number'),//编号
  price:DS.attr('string'),//价格
  createDateTime:DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新人
  scannerID:DS.attr('number'),//小米scanner id
  floor:DS.belongsTo('floor'),//所属楼层
  roomType:DS.belongsTo('dicttype'),//房屋类型
  // nursingType:DS.belongsTo('dicttype'),//护理类型
  remark:DS.attr('string'),//备注
  beds:DS.hasMany("bed"),
  scanner:DS.belongsTo('device'),//华米扫描器
  orientation:DS.belongsTo('dicttype'),//房屋朝向
  oldType:DS.belongsTo('dicttype'),//老人护理类型
  isGroupFlag:DS.attr('string'),//是否有护理组护理
  facility:DS.attr('string'),//房屋配备设施
  area:DS.attr('number'),//房屋面积
  publicType:DS.belongsTo('dicttype'),//公共区域类别
  isPublicFlag:DS.attr('number'),//是否公共区域 1：公共区域 0：正常房屋
  toilet:DS.attr('string'),//卫生间
  balcony:DS.attr('string'),//阳台
  bedNum:DS.attr('number'),//床位数量
  // parent: DS.belongsTo('floor', {
  //     inverse: 'children'
  // }),
  // children: DS.hasMany('bed', {
  //     inverse: 'parent'
  // }),

  bedInNum:Ember.computed('beds',function(){
    let beds = this.get('beds');
    beds = beds.filter(function(bed){
      if(bed.get('status.typecode')){
        return  bed.get('status.typecode') !== 'bedStatusIdle' ;
      }
    });
    return beds.get('length');
  }),
  roomIn:Ember.computed('bedInNum',function(){
    let bedInNum = this.get('bedInNum');
    if(bedInNum>0){
      return true;
    }else{
      return false;
    }
  }),
  roomFull:Ember.computed('bedInNum','beds',function(){
    let beds = this.get('beds');
    let bedInNum = this.get('bedInNum');
    if(bedInNum==beds.get('length')){
      return true;
    }else{
      return false;
    }
  }),
  lastBedNum:Ember.computed('bedInNum','beds',function(){
    let beds = this.get('beds');
    let bedInNum = this.get('bedInNum');
    return beds.get('length') - bedInNum;
  }),
  hasToilet:Ember.computed('toilet',function(){
    let toilet = this.get('toilet');
    if(toilet){
      return '是';
    }else{
      return '否';
    }
  }),
  hasBalcony:Ember.computed('balcony',function(){
    let balcony = this.get('balcony');
    if(balcony){
      return '是';
    }else{
      return '否';
    }
  }),
  isPbulic:Ember.computed('isPublicFlag',function(){
    let isPublicFlag = this.get('isPublicFlag');
    if(isPublicFlag == 1){
      return true;
    }else{
      return false;
    }
  }),
  nurseGroup:DS.belongsTo('nursegroup'),//护工组ID

  // nurseGroup:DS.belongsTo('nursegroup',{
  //   inverse:'rooms'
  // }),//护工组ID

  allName:Ember.computed('name','floor','dataLoader.allRoomList',function(){
    //如果此时房间信息没有加载完毕，则返回空信息
    if(!this.get("dataLoader").get("allRoomList")){
      return "";
    }
    if(!this.get("dataLoader").get("allFloorList")){
      return "";
    }
    //如果没有取得上级对象，先从全局查一下
    if(!this.get("floor.building")){
      // console.log("floor empty and id:" + this.get("floor.id"));
      var room = this.get("dataLoader").get("allRoomList").findBy("id",this.get("id"));
      var floor = this.get("dataLoader").get("allFloorList").findBy("id",room.get("floorId"));
      console.log("rebuild room floor:" + floor.get("name"));
      this.set("floor",floor);
    }
    //如果没有building，再次重建
    if(!this.get("floor.building")||!this.get("floor.building.name")){
      console.log("building empty and id:" + this.get("floor.buildingId"));
      if(!this.get("dataLoader").get("allBuildingList")){
        return this.get('floor.name')+'-'+this.get('name');
      }
      var building = this.get("dataLoader").get("allBuildingList").findBy("id",this.get("floor.buildingId"));
      this.get("floor").set("building",building);
    }
    var name=this.get('floor.building.name')+'-'+this.get('floor.name')+'-'+this.get('name');
    return name;
  }),
});

export default Room;
