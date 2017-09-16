import DS from 'ember-data';
import Ember from 'ember';

var Department = DS.Model.extend({
  dataService: Ember.inject.service("date-service"),
    code: DS.attr('number'),
    remark: DS.attr('string'),
    name: DS.attr('string'),
    sortOrder: DS.attr('number'), //排序号
    delStatus: DS.attr('number'), //删除状态 1已删除0未删除
    children: DS.hasMany('department', {
        inverse: 'parent'
    }),
    parent: DS.belongsTo('department', {
        inverse: 'children'
    }),

    createDateTime: DS.attr('number'), //创建时间
    createUser: DS.belongsTo('user'), //创建人
    lastUpdateDateTime: DS.attr('number'), //更新时间
    lastUpdateUser: DS.belongsTo('user'), //更新人
    shortName:DS.attr("string"),    //简称
    // leaderUser:DS.belongsTo("employee"),  //部门领导

    // 创建时间
    createTimeDate:Ember.computed("createDateTime",function(){
      var createDate1= this.get("createDateTime");
      return this.get("dataService").timestampToTime(createDate1);
    }),
    createDateString:Ember.computed("createDateTime", function(){
      var createDate1 = this.get("createDateTime");
      if(createDate1=== null){
        return this.get("dataService").getCurrentTime();
      }
      return this.get("dataService").formatDate(createDate1,"yyyy-MM-dd hh:mm");


      }),

      //更新时间
      lastTimeDate:Ember.computed("lastUpdateDateTime",function(){
        var lastTime = this.get("lastUpdateDateTime");
        return this.get("dataService").timestampToTime(lastTime);
      }),
      lastTimeString:Ember.computed("lastUpdateDateTime",function(){
        var lastTime = this.get("lastUpdateDateTime");
        if(lastTime === null){
          return his.get("dataService").getCurrentTime();
        }
        return this.get("dataService").formatDate(lastTime,"yyyy-MM-dd hh:mm");

      }),


});




export default Department;
