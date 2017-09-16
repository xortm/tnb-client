import Ember from 'ember';
import Pagination from '../pagination';
import BaseBusiness from '../base-business';
const {
    employeeStatus1,
    employeeStatus2
} = Constants;
export default BaseBusiness.extend(Pagination,{
  header_title: '系统用户管理',

  model() {
      return {};
  },
  doQuery(){
    let params = this.buildQueryParams();
    let userList = this.findPaged('user', params, function(userList) {});
    this.getCurrentController().set("userList", userList);
  },
  buildQueryParams: function() {
      let params = this.pagiParamsSet();
      let curController = this.getCurrentController();
      let filter = {role:{'code@$not@$or1':'wechat','code@$isNull@$or1':'null'}};//不是 公众号的
      // let filter = {};
      let sort;
      if (curController) {
          if (curController.get('queryCondition')) {
              filter = $.extend({}, filter, {
                  'name@$like': curController.get('queryCondition')
              });
              filter = $.extend({}, filter, {
                  '[employee][name@$like]': curController.get('queryCondition')
              });

          }
          if (curController.get("staffStatus")) {
            if(curController.get('staffStatus.typecode')!="the_all"){
              filter = $.extend({}, filter, {'[staffStatus][typecode]':curController.get('staffStatus.typecode')});
            }
          }
      }
      params.filter = filter;
      // let sort = {
      //     remark: 'asc'
      // };
      // params.sort = sort;
      console.log("params is:", params);
      return params;
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    this.doQuery();
    let theAll = {
      typename:"全部",
      typecode:"the_all",
      namePinyin:"全部",
    };
    let dicttypes = this.get("global_dataLoader.dicttypes");
    let list = dicttypes.filterBy('typegroup.typegroupcode', 'employeeStatus');
    let staffInUse ;
    list.forEach(function(dict){
      console.log(dict.get('typename'));
      dict.set("namePinyin",dict.get("typename"));
      if (dict.get("typecode")=="employeeStatus1") {
        staffInUse = dict;
      }
    });
    list.pushObject(theAll);
    controller.set('staffStatusList',list);
    controller.set("staffStatus",Constants.employeeStatus1);
    controller.send("statusSelect",staffInUse);

  },
});
