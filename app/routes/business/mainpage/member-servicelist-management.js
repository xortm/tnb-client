import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'护理方案列表',
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
          filter = $.extend({}, filter, {'[customer][name@$like]@$or1':curController.get('queryCondition')});
        }
    }
    params.filter = filter;
    sort = {
        id: 'asc'
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    var _self=this;
    var params=this.buildQueryParams();
    this.findPaged('nursingproject',params).then(function(projectList){
        _self.getCurrentController().set("projectList", projectList);
    });
  },
  actions:{
    search:function(){
      this.doQuery();
    },
  },
  setupController: function(controller,model){
    controller.set('queryCondition', null);
    var _self=this;
    this.doQuery();
    var customerList=this.store.query('customer',{filter:{queryType:'customerWithoutProject'//查询没有护理方案的老人
}}).then(function(customerList){
      customerList.forEach(function(customer){
        customer.set('namePinyin',pinyinUtil.getFirstLetter(customer.get("name")));
      });
      _self.getCurrentController().set('customerList',customerList);
    });


    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);
    controller.set('newPro', _self.get('store').createRecord('nursingproject',{}));
    controller.set('customer',null);
  }
});
