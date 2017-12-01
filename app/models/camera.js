import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
var Recharge = BaseModel.extend({
  // createTime: DS.attr('number'),//创建时间
  // createUser:DS.belongsTo('user'),//创建人
  // updateTime: DS.attr('number'),//更改时间
  // lastUpdateUser:DS.belongsTo('user'),//更改者id
  code:DS.attr('string'),//序列号
  accessName:DS.attr('string'),//接入用户名
  accessPass:DS.attr('string'),//接入密码
  ip:DS.attr('string'),//ip地址
  port:DS.attr('number'),//端口号
  status:DS.attr('number'),//连接状态，1 已连接 ，0 未连接
  liveStatus:DS.attr('number'),//拉流状态 1 远程拉流已开启 0 未开启
  remark:DS.attr('string'),
  operateFlag:DS.attr('string'),//绑定操作bind解绑操作removeBind
  operateTarget:DS.attr('string'),//绑定的人或房间ID
  bindStatus:DS.belongsTo('dicttype'),//绑定状态
  uri:DS.attr('string'),//标识编码
  audienceNum:DS.attr('number'),//直播观看人数
  statusFlag:Ember.computed('status',function(){
    let status = this.get('status');
    if(status==1){
      this.set('statusName','');
      return true;
    }else if(status===0){
      this.set('statusName','无法使用');
      return false;
    }
  }),
  liveStatusFlag:Ember.computed('liveStatus',function(){
    let liveStatus = this.get('liveStatus');
    if(liveStatus===0){
      return false;
    }else if(liveStatus==1){
      return true;
    }
  }),
});
export default Recharge;
