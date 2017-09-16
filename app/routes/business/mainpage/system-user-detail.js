import Ember from 'ember';
import Pagination from '../pagination';
import BaseBusiness from '../base-business';
const {
    employeeStatus,
    bedType,
    hireType,
    staffStatusLeave
} = Constants;

export default BaseBusiness.extend(Pagination,{
  header_title: '用户详情',

  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
  },
  model() {
      return {};
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    var id = this.getCurrentController().get('id');
    var editMode = this.getCurrentController().get('editMode');
    if(editMode=="edit"){
      this.store.findRecord("user",id).then(function(user){
        controller.set("user",user);
        controller.set("editModel", false);
        controller.set("sysPassWord", user.get("passcode"));//以前的密码md5加密
      });
    }else{
      controller.set("loginName", "");
      controller.set("sysPassWord", "");
      controller.set("editModel", true);
      let user = this.get("store").createRecord('user',{});
      controller.set("user", user);
    }
    this.store.query("role", {filter:{'code@$isNull':'null'}}).then(function(roleList) {
        controller.set("roleList", roleList);
        console.log('doQuery roleList', roleList);
    });
    //过滤了  离职员工 不能挂接
    this.store.query("employee", {filter:{
      staffStatus:{'typecode@$not':Constants.staffStatusLeave}
    }}).then(function(employeeList) {
        controller.set("employeeList", employeeList);
        console.log('doQuery roleList', employeeList);
    });
  },
});
