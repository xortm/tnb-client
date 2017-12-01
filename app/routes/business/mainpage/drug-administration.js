import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'用药管理',
  model:function(){
    return {};
  },
  dateService: Ember.inject.service("date-service"),
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={
      "customerStatus][typecode@$like@$or2--1":"customerStatusTry",
      "customerStatus][typecode@$like@$or2--2":"customerStatusIn",
      'addRemark@$not': 'directCreate'
    };
    var sort;

      if (curController) {
          if (curController.get('queryCondition')) {
            filter = $.extend({}, filter, {'name@$like@$or1':curController.get('queryCondition')});
          }
      }
    params.filter = filter;
    sort = {
        // '[bed][floor][building][name]':'asc',
        // '[bed][floor][name]':'asc',
        // '[bed][name]':'asc',
        'id':'asc',
        // 'name':'asc'
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    let _self = this;
    let params = this.buildQueryParams();
    var customerList=this.findPaged('customer',params,function(customerList){
      _self.store.query('customerdrug',{}).then(function(customerdrugList){
        let list = new Ember.A();
        customerList.forEach(function(customer){

          let count = 0;
          customerdrugList.forEach(function(customerdrug){
            if(customer.get('id')==customerdrug.get('customer.id')){
              count++;
            }
          });
          customer.set('drugCount',count);
          if(!list.findBy('id',customer.get('id'))){
            list.pushObject(customer);
          }

      });
      _self.getCurrentController().set("customerShowList", list);
      _self.getCurrentController().send('chooseCustomer',list.get('firstObject'));
      });

    });
    this.getCurrentController().set("customerList", customerList);
  },
  doQueryDrug: function(customer){
    let _self = this;
    let dom = $('#drug-tab-content');
    if(dom){
      _self.getCurrentController().set('customerdrugList',null);
      App.lookup('controller:business.mainpage').showTableLoading(dom);
      _self.getCurrentController().set('couldAddDrug',false);
    }
    var params=this.pagiParamsSet();
    params.perPage = 100;
    if (customer) {
          params.filter = {customer:{id:customer.get('id')}};
    }
    let customerdrugList = this.findPaged('customerdrug',params).then(function(customerdrugList){
      _self.store.query('customerdrugrecord',{filter:{customerDrug:{customer:{id:customer.get('id')}}}}).then(function(recordList){
        customerdrugList.forEach(function(customerdrug){
          let list = recordList.filter(function(record){
            return record.get('customerDrug.id') == customerdrug.get('id');
          });
          customerdrug.set('records',list);
          customerdrug.set('selected',false);
        });
        _self.getCurrentController().set('customerdrugList',customerdrugList);
        _self.getCurrentController().set('couldAddDrug',true);
        // if(customerdrugList.get('firstObject.customer.id')==_self.getCurrentController().get('curcustomer.id')){
        //   _self.getCurrentController().set('customerdrugList',customerdrugList);
        //   _self.getCurrentController().set('couldAddDrug',true);
        // }

        if(dom){
          App.lookup('controller:business.mainpage').removeTableLoading(dom);
        }
      });

    });

  },
  doQueryDrugPlan(customer){
    let _self = this;
    let params=this.pagiParamsSet();
    let dom = $('#drug-tab-content');
    if(dom){
      _self.getCurrentController().set('customerdrugprojectList',null);
      App.lookup('controller:business.mainpage').showTableLoading(dom);
    }
    params.perPage = 100;
    if(customer){
      params.filter = {customerDrug:{customer:{id:customer.get('id')}}};
    }
    let customerdrugList = this.findPaged('customerdrugproject',params).then(function(customerdrugList){
      _self.getCurrentController().set('customerdrugprojectList',customerdrugList);
      // if(customerdrugList.get('firstObject.customerDrug.customer.id')==_self.getCurrentController().get('curcustomer.id')){
      //   _self.getCurrentController().set('customerdrugprojectList',customerdrugList);
      // }

      if(dom){
        App.lookup('controller:business.mainpage').removeTableLoading(dom);
      }
    });

  },
  chooseDrugPlanexe(customer,serchDrug){
    let _self = this;
    let params=this.pagiParamsSet();
    let curController = this.getCurrentController();
    let dom = $('#drug-tab-content');
    if(dom){
      _self.getCurrentController().set('customerdrugprojectexeList',null);
      App.lookup('controller:business.mainpage').showTableLoading(dom);
    }
    let filter;
    if (customer) {
      filter = {customerDrug:{customer:{id:customer.get('id')}}};
    }
    if(serchDrug){
      filter = $.extend({},filter,{customerDrug:{drug:{'name@$like':serchDrug}}});
    }
    //执行时间搜索
    var timeCondition = curController.get('timeCondition');
    if (timeCondition) {
        var compareDate = null;
        if (timeCondition === "today") {
            compareDate = this.get("dateService").getTodayTimestamp();
        }
        if (timeCondition === "seven") {
            compareDate = this.get("dateService").getDaysBeforeTimestamp(7);
        }
        if (timeCondition === "thirty") {
            compareDate = this.get("dateService").getDaysBeforeTimestamp(30);
        }
        filter = $.extend({}, filter, {
            'exeDate@$gte': compareDate
        });
    }
    //自定义日期搜索
    var conBeginDate = curController.get("beginDate");
    var conEndDate = curController.get("endDate");
    if (conBeginDate && conEndDate) {
        var beginCompare = this.get("dateService").getFirstSecondStampOfDay(conBeginDate);
        var endCompare = this.get("dateService").getLastSecondStampOfDay(conEndDate);
        filter = $.extend({}, filter, {
            'exeDate@$gte': beginCompare
        }, {
            'exeDate@$lte': endCompare
        });
    }
    params.filter = filter;
    params.sort = {exeDate:'desc'};
    let customerdrugList = this.findPaged('customerdrugprojectexe',params).then(function(customerdrugList){
      let customerdrugprojectList;
      if(_self.getCurrentController().get('customerdrugprojectList')){
        customerdrugprojectList = _self.getCurrentController().get('customerdrugprojectList');
        customerdrugList.forEach(function(customerdrug){
          customerdrugprojectList.forEach(function(project){
            if(customerdrug.get('customerDrug.drug.name')==project.get('customerDrug.drug.name')){
              customerdrug.set('project',project);
            }
          });
        });
      }else{
         _self.store.query('customerdrugproject',{}).then(function(customerdrugprojectList){
           customerdrugList.forEach(function(customerdrug){
             customerdrugprojectList.forEach(function(project){
               if(customerdrug.get('customerDrug.drug.name')==project.get('customerDrug.drug.name')){
                 customerdrug.set('project',project);
               }
             });
           });
         });
      }
      _self.getCurrentController().set('customerdrugprojectexeList',customerdrugList);
      // if(customerdrugList.get('firstObject.customerDrug.customer.id')==_self.getCurrentController().get('curcustomer.id')){
      //   _self.getCurrentController().set('customerdrugprojectexeList',customerdrugList);
      // }

      _self.getCurrentController().set('exportList',customerdrugList);
      if(dom){
        App.lookup('controller:business.mainpage').removeTableLoading(dom);
      }
    });

  },
  actions:{
    searchName:function(){
      this.doQuery();
    },
  },
  setupController: function(controller,model){
    this.doQuery();
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);
    this.store.query('drug',{}).then(function(drugList){
      drugList.forEach(function(drug){
        drug.set('namePinyin',pinyinUtil.getFirstLetter(drug.get("name")));
      });
      controller.set('druglist',drugList);
    });
    this.store.query('user',{filter:{staffStatus:{'typecode@$not':'employeeStatus2'}}}).then(function(userList){
      controller.set('userList',userList);
    });
    this.store.query('servicefinishlevel',{filter:{'remark@$like':'default'}}).then(function(list){
      controller.set('finishLevelList',list);
    });
  }
});
