import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'设备类型维护',
  model:function(){
    return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={};
    if(curController){
      if(curController.get('deviceProject')){
        filter = $.extend({},filter,{'[type][codeInfo]':curController.get('deviceProject.typecode')});
      }
      if (curController.get('queryCondition')) {
            filter = $.extend({}, filter, {'[item][typename@$like]':curController.get('queryCondition')});
          }
    }
    params.filter = filter;
    params.sort = {'[item][typename]':'asc'};
    return params;
  },
  doQuery:function(){
    let _self = this;
    var params=this.buildQueryParams();
    this.findPaged('deviceTypeItem',params).then(function(deviceList){
      _self.getCurrentController().set("deviceList", deviceList);
    });
  },
  setupController: function(controller,model){
    var _self=this;
    this.doQuery();
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);
    this.store.query('devicetype',{}).then(function(devicetypeList){
      devicetypeList.forEach(function(devicetype){
        devicetype.set('namePinyin',pinyinUtil.getFirstLetter(devicetype.get("deviceName")));
      });
      controller.set('devicetypeList',devicetypeList);
    });
  }
});
