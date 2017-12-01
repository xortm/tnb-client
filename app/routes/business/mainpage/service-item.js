import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'护理项目列表',

  model:function(){
    return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={serviceSource:{typecode:'jigou'}};
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {
          filter = $.extend({}, filter, {'name@$like':curController.get('queryCondition')});
        }
    }
    if(this.get('serviceTypeID')){
      filter = $.extend({}, filter, {'[serviceType][id]':this.get('serviceTypeID')});
    }
    if(this.get('countTypeID')){
      filter = $.extend({}, filter, {'[countType][id]':this.get('countTypeID')});
    }
    if(this.get('valueTypeID')){
      filter = $.extend({}, filter, {'[serviceValueType][id]':this.get('valueTypeID')});
    }
    params.filter = filter;
    return params;
  },
  doQuery:function(){
    var params=this.buildQueryParams();
    var serviceList=this.findPaged('customerserviceitem',params,function(serviceList){});
    this.getCurrentController().set("serviceList", serviceList);
    this.getCurrentController().set("serviceTypeID",'');
  },
  actions:{
    search:function(){
      this.doQuery();
    },
    serviceTypeSelect(serviceType){
      if(serviceType){
        this.set('serviceTypeID',serviceType.get('id'));
      }else{
        this.set('serviceTypeID','');
      }

      this.doQuery();
    },
    countTypeSelect(countType){
      if(countType){
        this.set('countTypeID',countType.get('id'));
      }else{
        this.set('countTypeID','');
      }

      this.doQuery();
    },
    serviceValueTypeSelect(valueType){
      if(valueType){
        this.set('valueTypeID',valueType.get('id'));
      }else{
        this.set('valueTypeID','');
      }
      this.doQuery();
    }
  },
  setupController: function(controller,model){
    this.doQuery();
    this._super(controller,model);


  }
});
