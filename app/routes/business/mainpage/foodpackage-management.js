import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataService: Ember.inject.service("date-service"),
    dataLoader:Ember.inject.service('data-loader'),
    feedBus:Ember.inject.service('feed-bus'),
    header_title: '套餐管理',
    model() {
        return {};
    },
    buildQueryParams() {
        var _self = this;
        var params = this.pagiParamsSet();
        var curController = this.getCurrentController();
        var filter = {};
        var sort;
        if (curController) {
          if (curController.get('queryCondition')) {
            filter = $.extend({}, filter, {'name@$like@$or1':curController.get('queryCondition')});
          }
        }
        params.filter = filter;
        params.sort = sort;
        return params;
    },
    doQuery: function() {
        var params = this.buildQueryParams();
        var foodpackageList = this.findPaged('foodpackage', params, function(foodpackageList) {});
        this.getCurrentController().set("foodpackageList", foodpackageList);
    },
    actions:{
      search:function(){
        this.doQuery();
      },
    },
    setupController: function(controller, model) {
      let _self = this;
      this._super(controller, model);
      let queryCondition = controller.get('input');
      controller.set('queryCondition', queryCondition);
      //提前将所有的食物列表放入全局
      this.store.query('food',{}).then(function(foodList){
        _self.set('feedBus.allFoodList',foodList);
      });
      let foodTimeList = this.get('dataLoader').findDictList('foodTimeType');
      controller.set('foodTimeList',foodTimeList);
      this.doQuery();
    }
});
