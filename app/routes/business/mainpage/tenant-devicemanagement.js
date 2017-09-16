import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'设备类型分配',
  model:function(){
    return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={
                      tenantId:this.getCurrentController().get("id")
                    };
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {
          filter = $.extend({}, filter, {'orgName@$like':curController.get('queryCondition')});
        }
    }
    params.filter = filter;
    return params;
  },
  doQuery:function(){
    var params=this.buildQueryParams();
    var devicetypeList=this.findPaged('devicetype',params,function(devicetypeList){
    });

    this.getCurrentController().set("devicetypeList", devicetypeList);
    this.getCurrentController().set("careTypeID",'');
  },
  actions:{},
  setupController: function(controller,model){
    this.doQuery();
    this._super(controller,model);
    this.store.query("devicetype", {filter:{"forTenant":"yes","tenantId":controller.get("id")}}).then(function(devicetypeSelectList) {
        controller.set("devicetypeSelectList", devicetypeSelectList);
    });
    let devicetypeModel = this.get("store").createRecord('devicetype', {});
    controller.set("devicetypeModel", devicetypeModel);
  }
});
