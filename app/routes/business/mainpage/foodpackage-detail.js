import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  feedBus:Ember.inject.service('feed-bus'),
  dataLoader:Ember.inject.service('data-loader'),
  queryParams: {
      id: {
          refreshModel: true
      }
  },
  header_title:'套餐信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    let foodPackage = this.store.peekRecord('foodpackage',id);
    let allFoodList = this.get('feedBus.allFoodList');//所有的食物列表
    let foodTypeList = this.get('dataLoader').findDictList('foodType');//食物种类
    let foodTimeList = this.get('dataLoader').findDictList('foodTimeType');//用餐时间种类
    controller.set('foodTimeList',foodTimeList);
    controller.set('foodTypeList',foodTypeList);
    controller.set('foodPackage',foodPackage);
    controller.set('allFoodList',allFoodList);
      //已有套餐餐记录，拼接页面对象
      this.store.query('foodpackageitem',{filter:{foodPackage:{id:id}}}).then(function(hasfoodList){
        controller.set('hasFoodList',hasfoodList);
      });
    }
});
