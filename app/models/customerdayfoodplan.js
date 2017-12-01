import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  dataLoader:Ember.inject.service('data-loader'),
  createUser: DS.belongsTo('user'), //创建人
  diningDate:DS.attr("number"), //用餐日期 如需进行时间查询   filter 添加：queryStartDate 查询开始时间    queryEndDate查询结束时间
  plans:DS.hasMany('customer-food-plan'),//所属计划
  remark:DS.attr('string'),//说明
  diningDateStr:Ember.computed("diningDate", function() {
    var diningDate = this.get("diningDate");
    return diningDate?this.get("dateService").formatDate(diningDate, "yyyy-MM-dd"):'无';
  }),
  diningDateTime:Ember.computed('diningDate',function(){
    let diningDate = this.get("diningDate");
    return diningDate?this.get("dateService").timestampToTime(diningDate):null;
  }),
  diningDateFirstStr:Ember.computed("diningDate", function() {
    var diningDate = this.get("diningDate");
    let formatDateStr = this.get("dateService").formatDate(diningDate, "yyyy-MM-dd");
    return this.get("dateService").getFirstSecondStampOfDayString(formatDateStr);
  }),
  // 早餐:宫保鸡丁,小米粥,米饭,花卷,红薯,蛋花汤,饺子@午餐:蛋花汤,米饭,香菇肉片,小米粥@晚餐:红薯,花卷
  remarkArr:Ember.computed("remark", function() {
    let remark = this.get("remark");
    let remarkArr = remark.split("@");
    return remarkArr;
  }),
  tableList:Ember.computed('remarkArr',function(){
    let remarkArr = this.get('remarkArr');
    let foodTimeList = this.get('dataLoader').findDictList('foodTimeType');
    let list = new Array(0);
    if(remarkArr.length == foodTimeList.get('length')){
      for(let i=0;i<remarkArr.length;i++){
        let name = remarkArr[i].split(':');
        if(name[0]==foodTimeList.objectAt(i).get('typename')){
          list[i] = name[1];
        }
      }
      return list;
    }else if(remarkArr.length < foodTimeList.get('length')){
      for(let i=0;i<foodTimeList.get('length');i++){
        if(i<remarkArr.length){
          let name = remarkArr[i].split(':');
          if(name[0]==foodTimeList.objectAt(i).get('typename')){
            list[i] = name[1];
          }
        }else{
          list[i] = '暂无';
        }
      }
      return list;
    }

  }),
});
