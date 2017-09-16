import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

var Staff = BaseModel.extend({
  pathConfiger: Ember.inject.service("path-configer"),

  appPassWord: DS.attr('string'),
  certificateImage: DS.attr('string'),
  staffName: DS.attr('string'),
  curAddress: DS.attr('string'),
  hbeaconID: DS.attr('string'),
  staffMail: DS.attr('string'),
  staffTel: DS.attr('string'),
  profession:DS.attr('string'),
  schoolName: DS.attr('string'),
  staffBirth: DS.attr('number'),
  staffCardCode: DS.attr('string'),
  certificateName: DS.attr('string'),
  createDateTime: DS.attr('number'),
  lastUpdateDateTime: DS.attr('number'),
  isGroupFlag: DS.attr('number'),
  isNurseFlag: DS.attr('number'),
  remark: DS.attr('string'),
  role:DS.belongsTo('role'),
  lastUpdateUser:DS.belongsTo('user'),
  //crateUser:DS.belongsTo('user'),
  staffSex: DS.belongsTo('dicttype'),
  hireType:DS.belongsTo('dicttype'),
  org:DS.belongsTo('organization'),
  privilege:DS.belongsTo('privilege'),
  staffStatus:DS.belongsTo('dicttype'),
  staffMaritalStatus:DS.belongsTo('dicttype'),
  staffEducation:DS.belongsTo('dicttype'),
  staffContactRelation:DS.belongsTo('dicttype'),
  staffContactName:DS.attr("string"),
  staffContactTel:DS.attr("string"),
  staffCensus:DS.attr("string"),
  staffNation:DS.attr("string"),
  sysPassWord:DS.attr("string"),
  showName:DS.attr("string"),
  toPositionDate:DS.attr("number"),
  nurseGroup:DS.belongsTo("nursegroup",{inverse:'staffs'}),

  birthdayShow: Ember.computed('staffBirth',function() {
    var dateOri = this.get("staffBirth");
    if(!dateOri) {
      return '';
    }
    else {
      var date = new Date(dateOri*1000);
      date = date.getFullYear()+"-"+this.toDbl(date.getMonth()+1)+"-"+this.toDbl(date.getDate());
      return date;
    }
  }),
  createTimeShow: Ember.computed('createDateTime',function() {
    var dateOri = this.get("createDateTime");
    var date = new Date(dateOri*1000);
    if(date === 'Invalid Date'){
      date = '';
    }
    else{
      date = date.getFullYear()+"-"+this.toDbl(date.getMonth()+1)+"-"+this.toDbl(date.getDate())+" "+this.toDbl(date.getHours())+":"+this.toDbl(date.getMinutes());
    }
    return date;
  }),
  updateTimeShow: Ember.computed('lastUpdateDateTime',function() {
    var dateOri = this.get("lastUpdateDateTime");
    var date = new Date(dateOri*1000);
    if(date === 'Invalid Date'){
      date = '';
    }
    else{
      date = date.getFullYear()+"-"+this.toDbl(date.getMonth()+1)+"-"+this.toDbl(date.getDate())+" "+this.toDbl(date.getHours())+":"+this.toDbl(date.getMinutes());
    }
    return date;
  }),
  toDbl: function(value) {
		if(value<10)
		{
			return '0'+value;
		}
		else
		{
			return ''+value;
		}
	}
});
export default Staff;
