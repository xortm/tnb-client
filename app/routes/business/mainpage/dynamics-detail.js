import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  // header_title:'动态详情',
  queryParams: {
      nursinglogId: {
          refreshModel: true
      },
      customerId: {
          refreshModel: true
      },
      source:{
          refreshModel: true
      },
      logFlag:{
          refreshModel: true
      },
  },
  model(){
  },
  headerTitle(){
    var controller = this.getCurrentController();
    var nursinglogId = controller.get("nursinglogId");
    var customerId = controller.get("customerId");
    var source = controller.get("source");
    console.log("url in detail:"+ "  nursinglogId:"+nursinglogId+"  customerId:"+customerId+"  source:"+source);
    var curUser = this.get('global_curStatus').getUser();
    if(source === 'edit'){
      this.set('header_title','编辑日志');
      controller.set("lookModel",false);
    }else if(source === 'add'){
      this.set('header_title','添加日志');
      controller.set("lookModel",false);
    }else if(source === 'look'){
      this.set('header_title','查看日志');
      controller.set("lookModel",true);
    }
  },
  setupController: function(controller,model){
    this._super(controller,model);
    this.headerTitle();
  },
});
