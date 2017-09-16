import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  // header_title:'动态详情',
  queryParams: {
      healthinfoId: {
          refreshModel: true
      },
      customerId: {
          refreshModel: true
      },
      source:{
          refreshModel: true
      },
      flag:{
          refreshModel: true
      },
  },
  model(){
  },
  header_title: Ember.computed("global_curStatus.healtyCustomerId",function() {
    let healtyCustomer  = this.get("global_curStatus.healtyCustomer");
    let customerName = healtyCustomer.get("name");
    console.log("customerName in health:",customerName);
    return '添加健康数据(' + customerName +')';
  }),
  headerTitle(){
    var controller = this.getCurrentController();
    var customerId = controller.get("customerId");
    var source = controller.get("source");
    var curUser = this.get('global_curStatus').getUser();
    let healtyCustomer  = this.get("global_curStatus.healtyCustomer");
    let customerName = healtyCustomer.get("name");
    if(source === 'edit'){
      this.set('header_title','编辑健康数据(' + customerName + ')');
      controller.set("lookModel",false);
    }else if(source === 'add'){
      this.set('header_title','添加健康数据(' + customerName + ')');
      controller.set("lookModel",false);
    }else if(source === 'look'){
      this.set('header_title','查看健康数据(' + customerName + ')');
      controller.set("lookModel",true);
    }
  },
  setupController: function(controller,model){
    this._super(controller,model);
    // this.headerTitle();
  },
});
