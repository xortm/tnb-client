import DS from 'ember-data';
import BaseModel from './base-model';
import Ember from 'ember';
export default BaseModel.extend({
  dateService:Ember.inject.service('date-service'),
  code: DS.attr('string'),//编码
  title: DS.attr('string'),//标题
  content: DS.attr('string'),//内容
  task:DS.belongsTo('task'),//任务
  taskId: DS.attr('number'),//任务id
  remark: DS.attr('string'),//备注
  delStatus: DS.attr('number'),//删除状态 1已删除0未删除
  updateTime: DS.attr('number'),//最后修改的时间
  updateDateComp:Ember.computed(function(){
   var dateOri = this.get("updateTime");
  //  var date = new Date(dateOri*1000);
  //     if(date == 'Invalid Date'){
  //    date = '待定';
  //  }
  //  else{
    //  date=date.getFullYear() + "-" +(date.getMonth()+1) + "-" + date.getDate() + " " +date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  //  }
   return this.get('dateService').formatDate(dateOri,"yyyy-MM-dd hh:mm:ss");
 }),
});
