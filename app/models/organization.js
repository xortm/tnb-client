import DS from 'ember-data';
import Ember from 'ember';
/*权限菜单列表*/
var Organization = DS.Model.extend({
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

    admin: DS.belongsTo('user'),

    type: DS.belongsTo('dicttype'),
    order: DS.attr('number'),
    delStatus: DS.attr('number'), //删除状态 1已删除0未删除
    children: DS.hasMany('organization', {
        inverse: 'parent'
    }),
    parent: DS.belongsTo('organization', {
        inverse: 'children'
    }),
    avatarUrl: Ember.computed('licenseImg',function(){
      var avatar = this.get('licenseImg');
      if(!avatar){
        avatar = "timg.jpg"; 
      }
      console.log("this.pathConfiger",this.get("pathConfiger"));
      return this.get("pathConfiger").getAvatarRemotePath(avatar);
    }),
});
export default Organization;
