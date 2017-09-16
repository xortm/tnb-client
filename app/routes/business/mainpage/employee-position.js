import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
  header_title: '员工位置',
  model() {
      return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={};
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {
          filter = $.extend({}, filter, {'name@$like':curController.get('queryCondition')});
        }
    }
    params.filter = filter;
    sort = {
         'name':'asc'
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    let _self = this;
    var params=this.buildQueryParams();
    var buildingList=this.findPaged('building',params).then(function(buildingList){
      _self.getCurrentController().set("buildingList", buildingList);
      if(buildingList&&buildingList.get("length")>0){
        _self.getCurrentController().send('selectBuild',buildingList.get('firstObject'));
      }
    });
  },

  setupController:function(controller,model){
    this._super(controller,model);
    controller.set("employeeSeach",true);
    this.store.query('employee',{}).then(function(employees){
      controller.set("theEmployeeList",employees);
    });
    this.doQuery();
  },

  actions:{},
});
