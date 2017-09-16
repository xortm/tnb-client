import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataLoader: Ember.inject.service("data-loader"),
    queryParams: {
        flag: {
            refreshModel: true
        },
    },
    model() {
        return {};
    },
    actions: {
    },
    buildDietParams: function() {
        var params = this.pagiParamsSet();
        var filter = {
          type:{typecode:"schemeType1"}
        };
        var sort;
        params.filter = filter;
        sort = {
            createTime : 'desc',
        };
        params.sort = sort;
        return params;
    },
    buildSportsParams: function() {
        var params = this.pagiParamsSet();
        var filter = {
          type:{typecode:"schemeType2"}
        };
        var sort;
        params.filter = filter;
        sort = {
            createTime : 'desc',
        };
        params.sort = sort;
        return params;
    },
    buildmedicineParams: function() {
        var params = this.pagiParamsSet();
        var filter = {
          type:{typecode:"schemeType5"}
        };
        var sort;
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
        var medicineParams = this.buildmedicineParams();
        var curController = this.getCurrentController();
        console.log("dietParams is", dietParams);
        console.log("sportsParams is", sportsParams);
        // 查找所有膳食记录
        this.findPaged('scheme',dietParams).then(function(dietList){
          console.log("dietList",dietList);
          curController.set("dietList",dietList);
        });
        // 查找所有运动记录
        this.findPaged('scheme',sportsParams).then(function(sportsList){
          console.log("sportsList",sportsList);
          curController.set("sportsList",sportsList);
        });
        // 查找所有中医记录
        this.findPaged('scheme',medicineParams).then(function(medicineList){
          console.log("medicineList",medicineList);
          curController.set("medicineList",medicineList);
        });
    },
    setupController: function(controller, model) {
      this.doQuery();
      var _self = this;
      //查看方案-点击参数
      controller.set('dietParams',false);
      controller.set('sportsParams',false);
      controller.set('medicineParams',false);
      var flag = this.getCurrentController().get('flag');
      console.log("flag in schemem:",flag);
      if(flag == 1){
        controller.set('dietParams',true);
      }else if(flag == 2){
        controller.set('sportsParams',true);
      }else if(flag == 3){
        controller.set('medicineParams',true);
      }else{
        controller.set('dietParams',true);
      }
      this.getCurrentController().set('flag',1);
      this._super(controller, model);

    },
});
