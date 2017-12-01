import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'护理计划列表',
  dateService: Ember.inject.service("date-service"),
  queryParams: {
      customerId: {
          refreshModel: true
      }
  },
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
          filter = $.extend({}, filter, {'[customer][bed][name@$like]@$or1':curController.get('queryCondition')});
        }
    }
    params.filter = filter;
    sort = {
        remark: 'asc'
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    var _self=this;
    var params=this.buildQueryParams();
    var planList=this.findPaged('nursingplan',params).then(function(planList){
      _self.getCurrentController().set("planList", planList);
    });

  },
  actions:{
    search:function(){
      this.doQuery();
    },
  },
  setupController: function(controller,model){
    controller.set('detailEdit',false);
    let customerId = this.getCurrentController().get('customerId');
    let weekIndex = this.get("dateService").theWeek();
    let year = new Date().getYear();
    if(year<1000){
      year = year + 1900;
    }
    let filter =  {
      'customer---1':{'customerStatus':{'typecode@$or1---1':'customerStatusIn'}},
      'customer---2':{'customerStatus':{'typecode@$or1---2':'customerStatusTry'}},
    };
    this.store.query('nursingproject',{filter}).then(function(projectList){
      controller.set('projectList',projectList);//护理方案列表
    });
    this.store.query('nursingprojectitem',{filter:{item:{countType:{typecode:'countTypeByTime'}}}}).then(function(serviceList){
      controller.set('serviceList',serviceList);//护理方案中，定时执行的项目列表
    });
    var _self=this;
    this.doQuery();
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);

    this.store.findRecord('customer',customerId).then(function(customer){
      controller.set('customer',customer);
      controller.set('curcustomerId',customer.get('id'));
    });
    Ember.run.schedule("afterRender",this,function() {
      controller.set('flag',-1);
      controller.setDate(new Date());
    });
    this.get("global_ajaxCall").set("action","customer_plan");
    this.store.query('nursingplandetail',{filter:{cid:customerId,yearTab:year,weekIndex:weekIndex}}).then(function(list){
      let newCustomerPlanList = new Ember.A();
      for(let i = 0 ; i<7;i++){
        newCustomerPlanList.pushObject(list.objectAt(i));
      }
      console.log(list.get('firstObject.remark'));
      let serviceName = list.get('firstObject.remark').split('@');
      let allDayServiceName = serviceName[1];
      let allWeekServiceName = serviceName[0];
      if(allDayServiceName.length>0){
        controller.set('allDayServiceName',allDayServiceName);
      }else{
        controller.set('allDayServiceName','暂无');
      }
      if(allWeekServiceName.length>0){
        controller.set('allWeekServiceName',allWeekServiceName);
      }else{
        controller.set('allWeekServiceName','暂无');
      }

      console.log('length:',newCustomerPlanList.get('length'));
      controller.set('newCustomerPlanList',newCustomerPlanList);
      controller.set('allPlanDetailList',list);
      controller.incrementProperty('planDone');
    });

  }
});
