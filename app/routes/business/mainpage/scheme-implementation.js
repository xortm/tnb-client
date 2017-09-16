import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataLoader: Ember.inject.service("data-loader"),
    model() {
        return {};
    },
    actions: {
    },
    buildDietParams: function() {
        var params = this.pagiParamsSet();
        var curController = this.getCurrentController();
        var filter = {
          type:{typecode:"schemeType1"}
        };
        var sort;
        if (curController) {
            //按活动来查
            var customerId=curController.get('customerId');
            console.log("customerId init:",customerId);
            if(customerId){
            //var activityId=curController.get('activityId');
              filter = $.extend({}, filter, {
                  customer:{id:customerId}
              });
            }
        }
        params.filter = filter;
        sort = {
            createTime : 'desc',
        };
        params.sort = sort;
        return params;
    },
    buildSportsParams: function() {
        var params = this.pagiParamsSet();
        var curController = this.getCurrentController();
        var filter = {
          type:{typecode:"schemeType2"}
        };
        var sort;
        if (curController) {
            //按活动来查
            var customerId=curController.get('customerId');
            console.log("customerId init:",customerId);
            if(customerId){
            //var activityId=curController.get('activityId');
              filter = $.extend({}, filter, {
                  customer:{id:customerId}
              });
            }
        }
        params.filter = filter;
        sort = {
            createTime : 'desc',
        };
        params.sort = sort;
        return params;
    },
    buildMedicationParams: function() {
        var params = this.pagiParamsSet();
        var curController = this.getCurrentController();
        var filter = {};
        var sort;
        if (curController) {
            //按活动来查
            var customerId=curController.get('customerId');
            console.log("customerId init:",customerId);
            if(customerId){
            //var activityId=curController.get('activityId');
              filter = $.extend({}, filter, {
                  customer:{id:customerId}
              });
            }
        }
        params.filter = filter;
        sort = {
            createTime : 'desc',
        };
        params.sort = sort;
        return params;
    },
    doQuery: function() {
        var dietParams = this.buildDietParams();
        var sportsParams = this.buildSportsParams();
        var medicationParams = this.buildMedicationParams();
        var curController = this.getCurrentController();
        console.log("dietParams is", dietParams);
        console.log("sportsParams is", sportsParams);
        console.log("medicationParams is", medicationParams);
        // var messageList = this.findPaged('message', params, function(messageList) {});
        // this.getCurrentController().set("messageList", messageList);
        // 查找所有膳食记录
        this.findPaged('scheme-record',dietParams).then(function(dietList){
          console.log("dietList",dietList);
          curController.set("dietList",dietList);
        });
        // 查找所有运动记录
        this.findPaged('scheme-record',sportsParams).then(function(sportsList){
          console.log("sportsList",sportsList);
          curController.set("sportsList",sportsList);
        });
        // 查找所有用药记录
        this.findPaged('drug-record',medicationParams).then(function(medicationList){
          console.log("medicationList",medicationList);
          curController.set("medicationList",medicationList);
        });
    },
    setupController: function(controller, model) {
      controller.set('customer', null);
      controller.set('customerId', null);
      this.doQuery();
      var _self = this;
      //查看方案-点击参数
      controller.set('dietParams',true);
      controller.set('sportsParams',false);
      controller.set('medicationParams',false);
      this._super(controller, model);
      // 查找所有老人，用于下拉筛选
      this.store.query('customer',{}).then(function(customerList){
        customerList.forEach(function(obj){
          obj.set('namePinyin',obj.get('title'));
        });
        controller.set('customerList',customerList);
        console.log('customerList:',customerList);
      });

    },
});
