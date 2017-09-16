import DS from 'ember-data';
import BaseModel from './base-model';
export default BaseModel.extend({
  createDateTime:DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新人
  remark:DS.attr('string'),//备注
  seq:DS.attr('string'),//编号
  type:DS.belongsTo('devicetype'),//类型
  status:DS.belongsTo('dicttype'),//状态(空闲等。。。)
  deviceType:DS.belongsTo('dicttype'),//硬件类别
  deviceStatus:DS.attr('number'),//硬件状态,0,无法使用，1，可用
  statusDate:DS.attr('number'),//最近获取状态的时间
  bindStatus:DS.belongsTo('dicttype'),//绑定状态
  operateFlag:DS.attr('string'),//绑定操作bind解绑操作removeBind
  operateTarget:DS.attr('string'),//绑定的人或房间ID
  deviceStatusName:Ember.computed('deviceStatus',function(){
    let deviceStatus = this.get('deviceStatus');
    if(deviceStatus==1){
      return '';
    }
    if(deviceStatus===0){
      return '无法使用';
    }
  }),
  deviceStatusFlag:Ember.computed('deviceStatus',function(){
    let deviceStatus = this.get('deviceStatus');
    if(deviceStatus==1){
      return false;
    }
    if(deviceStatus===0){
      return true;
    }
  }),
  //判断设备是否是按键，是否未复位
  notReset:Ember.computed('deviceStatus','deviceType','status',function(){
    let status = this.get('status');
    if(status.get('typecode')=='deviceStatus3'){
      this.set('noResetName','未复位');
      return true;
    }

  }),
  //判断床垫
  noWifi:Ember.computed('status',function(){
    let status = this.get('status');
    if(status.get('typecode')=='deviceStatus4'){
      this.set('noResetName','wifi断线');
      return true;
    }
  }),
  //能否删除的标识
  delFlag:Ember.computed('bindStatus',function(){
    let bindStatus = this.get('bindStatus');
    if(!bindStatus){
      return true;
    }
    if(bindStatus.get('typecode')=='bindStatus1'){
      return false;
    }else{
      return true;
    }
  }),
  //根据不同设备类型，选择不同的颜色
  colorClass:Ember.computed('deviceType',function(){
    let deviceType = this.get('deviceType');
    if(!deviceType){
      return null;
    }
    let colorClass;
    switch (deviceType.get('typecode')) {
      case 'deviceType2':
        colorClass =  'scanner-color';
        break;
      case 'deviceType3':
        colorClass =  'button-color';
        break;
      case 'deviceType4':
        colorClass =  'bracelet-color';
        break;
      case 'deviceType5':
        colorClass =  'mattress-color';
        break;
      case 'deviceType6':
        colorClass =  'card-color';
        break;
      default:
    }
    return colorClass;
  }),

});
