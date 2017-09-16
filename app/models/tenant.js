import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({

  desc: DS.attr('string'),
  name: DS.attr('string'),
  type: DS.attr('number'),

  pathConfiger: Ember.inject.service("path-configer"),
  orgCode: DS.attr('string'),
  orgName: DS.attr('string'),
  orgShortName: DS.attr('string'),
  licenseImg: DS.attr('string'),
  orgTel: DS.attr('string'),
  address: DS.attr('string'),
  remark: DS.attr('string'),
  legalPerson: DS.attr('string'),

  linkMan: DS.attr('string'),
  linkManTel: DS.attr('string'),
  linkManQQ: DS.attr('string'),
  linkManMail: DS.attr('string'),

  privileges: DS.hasMany('tenantprivilege'),
  status: DS.belongsTo('dicttype'),
  order: DS.attr('number'),
  delStatus: DS.attr('number'), //删除状态 1已删除0未删除
  allJuJia:DS.attr('number'),//分配全部居家权限
  allJiGou:DS.attr('number'),//分配全部机构权限
  allPublic:DS.attr('number'),//分配全部公众号角色
  systemType:Ember.computed('privileges',function(){
      return privileges[0]?1:privileges[0].get("systemType");
  }),
  avatarUrl: Ember.computed('licenseImg',function(){
    var avatar = this.get('licenseImg');
    if(!avatar){
      avatar = "anonymous.png";
    }
    console.log("this.pathConfiger",this.get("pathConfiger"));
    return this.get("pathConfiger").getAvatarRemotePath(avatar);
  }),
  privilegeList:new Ember.A(),
});
