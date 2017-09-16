import Ember from 'ember';
import Pagination from '../pagination';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend(Pagination,{
  header_title: '系统用户管理',

  model() {
      return {};
  },
  doQuery(){
    var params = this.buildQueryParams();
    var userList = this.findPaged('user', params, function(userList) {});
    this.getCurrentController().set("userList", userList);
  },
  buildQueryParams: function() {
      var params = this.pagiParamsSet();
      var curController = this.getCurrentController();
      var filter = {role:{'code@$not@$or1':'wechat','code@$isNull@$or1':'null'}};//不是 公众号的
      // var filter = {};
      var sort;
      if (curController) {
          if (curController.get('queryCondition')) {
              filter = $.extend({}, filter, {
                  'name@$like': curController.get('queryCondition')
              });
              // filter = $.extend({}, filter, {
              //     'employee@$like@$or1': curController.get('queryCondition')
              // });
              // filter = $.extend({}, filter, {
              //     'staffTel@$like@$or1': curController.get('queryCondition')
              // });
          }
      }
      params.filter = filter;
      // var sort = {
      //     remark: 'asc'
      // };
      // params.sort = sort;
      console.log("params is:", params);
      return params;
  },
  actions:{
    searchUser:function(){
      this.doQuery();
    },
  },
  setupController: function(controller, model) {
    controller.set("queryCondition", null);
    this._super(controller, model);
    this.doQuery();
  },
});
