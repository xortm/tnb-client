
import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'护理组列表',
  model() {
    return {};
  },
  buildQueryParams(type){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={};
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {
          if(type){
            filter = $.extend({}, filter, {queryType:type,typeName:curController.get('queryCondition')});
          }
        }
    }
    params.filter = filter;
    sort = {
        remark: 'asc'
    };
    params.sort = sort;
    return params;
  },
  doQuery(type){
    var _self=this;
    var params=this.buildQueryParams(type);
    var nurseGroupList=this.findPaged('nursegroup',params).then(function(nurseGroupList){
      nurseGroupList.forEach(
        function(nurseGroup){
          _self.getCustomerByNurseGroup(nurseGroup);
          _self.getStaffByNurseGroup(nurseGroup);
          return nurseGroup;
        }
      );
      _self.getCurrentController().set("nurseGroupList", nurseGroupList);
    });


  },

  getStaffByNurseGroup: function(nurseGroup){
    this.store.query('employeenursinggroup',{filter:{group:{id:nurseGroup.id}}}).then(function(allStaffList){
      var s='';
      allStaffList.forEach(function(staff){
        s +=  staff.get("employee.name")+'，';
      });
      nurseGroup.set('member',s.substring(0,s.length-1));
    });
  },
  getCustomerByNurseGroup(nurseGroup){
    let nameStr = '';
    nurseGroup.get('customers').forEach(function(customer){
      if(customer.get('name')){

          nameStr += customer.get('name')+',';

      }
    });
    nurseGroup.set('customerName',nameStr.substring(0,nameStr.length-1));
  },
  setupController: function(controller,model){
    this.doQuery();
    this._super(controller,model);
  }
});
