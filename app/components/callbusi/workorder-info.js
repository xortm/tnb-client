import Ember from 'ember';

export default Ember.Component.extend({
  editMode: false,//是否编辑状态
  workorder: {},//工单数据
  curCall: null,//当前通话数据
  phoneNumber: null,
  customers: null,//任务对应的客户列表
  customerRel: null,//工单对应客户

  actions:{
    addWorkorder(){
      this.set("workorder", {phone:this.phoneNumber});
      this.set("editMode",true);
    },
    editWorkorder(workorder){
      this.set("workorder", workorder);
      this.set("editMode",true);
    },
    saveWorkorder(){
      var workorder = this.get("workorder");
      console.log("workorder in save",workorder);
      //透传对应的客户id以及通话数据
      workorder.customer = this.customerRel;
      workorder.call = this.curCall;
      console.log("saveWorkorder in comp",workorder);
      this.sendAction('saveWorkorder', workorder);
    }
  }
});
