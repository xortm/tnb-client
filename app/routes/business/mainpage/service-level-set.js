import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'护理等级列表',
  model:function(){
    return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={queryTenant: "tenant"};
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {
          filter = $.extend({}, filter, {'nameLike':curController.get('queryCondition')});
        }
    }
    params.filter = filter;
    return params;
  },
  doQuery:function(){
    var params=this.buildQueryParams();
    var serviceLevelList=this.findPaged('nursinglevel',params,function(serviceLevelList){});
    this.getCurrentController().set("serviceLevelList", serviceLevelList);
  },
  setupController: function(controller,model){
    var _self=this;
    this.doQuery();
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);
    controller.reopen({
      actions:{
        search(){
          _self.doQuery();
        },
        toAddPage(){
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('service-level-add');
        },

      }
    });

  }
});
