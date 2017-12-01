import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
export default BaseBusiness.extend(Pagination,{

  model() {
    return {};
  },
  buildQueryParams() {
      var _self = this;
      var params = this.pagiParamsSet();
      var curController = this.getCurrentController();
      var filter = {flagQueryType:'customerWithFlag'};
      var sort;
      if (curController) {
          if (curController.get('queryCondition')) {
              filter = $.extend({}, filter, {
                  '[bed][room][name@$like]@$or1': curController.get('queryCondition')
              });
              filter = $.extend({}, filter, {
                  '[bed][name@$like]@$or1': curController.get('queryCondition')
              });
              filter = $.extend({}, filter, {
                  'name@$like@$or1': curController.get('queryCondition')
              });
              filter = $.extend({}, filter, {
                  '[customerStatus][typecode@$like]@$or2---1': 'customerStatusIn'
              });
              filter = $.extend({}, filter, {
                  '[customerStatus][typecode@$like]@$or2---2': 'customerStatusTry'
              });
          } else {
              filter = $.extend({}, filter, {
                  '[customerStatus][typecode@$like]@$or1---1': 'customerStatusIn'
              });
              filter = $.extend({}, filter, {
                  '[customerStatus][typecode@$like]@$or1---2': 'customerStatusTry'
              });
          }
      }
      params.filter = filter;
      sort = {
          '[createTime]': 'desc',
      };
      params.sort = sort;
      console.log("params is:", params);
      return params;
  },
  doQuery: function() {
      var _self = this;
      var params = this.buildQueryParams(); //拼查询条件
      let customerList =   _self.findPaged('customer', params,function(customerList) {});
      _self.getCurrentController().set("customerList", customerList);
  },
  actions: {
      search: function() {
          this.doQuery();
      }
  },
  setupController: function(controller,model){
    this._super(controller, model);
    this.doQuery();
    // let filter =  {
    //   'customer---1':{'customerStatus':{'typecode@$or1---1':'customerStatusIn'}},
    //   'customer---2':{'customerStatus':{'typecode@$or1---2':'customerStatusTry'}},
    // };
    // this.store.query('nursingproject',{filter}).then(function(projectList){
    //   controller.set('projectList',projectList);
    //   let customerList = new Ember.A();
    //   projectList.forEach(function(project){
    //     if(!customerList.findBy('id',project.get('customer.id'))){
    //       customerList.pushObject(project.get('customer'));
    //     }
    //   });
    //   customerList.forEach(function(customer){
    //     customer.set('namePinyin',customer.get("name"));
    //   });
    //   controller.set('customerList',customerList);
    // });
    this.defineController(controller,model);
  },
  defineController: function(controller,model){
    controller.reopen({
      actions:{

        editCustomer(){
          this.set('editcustomer',true);
        },
        exitCustomer(){
          this.set('editcustomer',false);
        },
        chooseCustomer(customer){
          this.set('customer',customer);
        },
        confirm(customer){
          var _self = this;
          var mainpageController = App.lookup('controller:business.mainpage');
          this.set("curdate","");//set curdate 为空从新选择
          this.set('detailEdit',true);//不要编辑了 直接set为true
          // let customer = this.get('customer');
          let params = {customerId : customer.get("id")};
          mainpageController.switchMainPage('nursing-plan',params);
          // this.store.query("nursingplanitem",{filter:{customer:{id:customer.get("id")}}}).then(function(planTemplateList){
          //   if(planTemplateList&&planTemplateList.get("length")>0){
          //     mainpageController.switchMainPage('nursing-plan',params);
          //     _self.set('editcustomer',false);
          //     _self.set('customer','');
          //   }else {
          //     mainpageController.switchMainPage('plan-template',params);
          //     _self.set('editcustomer',false);
          //     _self.set('customer','');
          //   }
          // });

        },
      },
    });
  },

});
