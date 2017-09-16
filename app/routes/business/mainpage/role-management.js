import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const {payStatus_processing,payType_apply,authenticate_succ,proportion_platform} = Constants;

/*
 * 角色管理
 * create by lmx
 */
export default BaseBusiness.extend(Pagination,{
  header_title:'角色及权限分配',
  model(){
    return {};
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    this.doQuery();

  },
  doQuery: function() {
      var _self = this;
      //查询所有角色
      var params = this.pagiParamsSet();
      let filter = {};
      // filter = $.extend({}, filter, {'code@$not---1':"admin"});
      // filter = $.extend({}, filter, {'code@$not---2':"app"});
      // filter = $.extend({}, filter, {'code@$not---3':"wechat"});
      // filter = $.extend({}, filter, {});
      filter = $.extend({}, filter, {'code@$isNull':'null'});
      params.filter = filter;
      var roles = this.findPaged('role', params, function(roleList) {
        _self.getCurrentController().set("roleListPage", roleList);
        roleList.forEach(function(role){
          var str = "";
          role.get("privileges").forEach(function(privilege){
            if(privilege.get('level')==1&&privilege.get('type')<10){
              str += privilege.get("showName")+ ",";
            }
          });
          if(str.length===0){
            str = "无";
          }else{
            str = str.substring(0,str.length-1);
          }
          role.set('privilegeStr',str);
          _self.getCurrentController().appendPrivInfoToRole(role);
        });

      });
      this.getCurrentController().set("roleList", roles);
  },

});
