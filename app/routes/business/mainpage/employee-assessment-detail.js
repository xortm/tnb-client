import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  feedBus: Ember.inject.service("feed-bus"),
  queryParams: {
      itemId: {
          refreshModel: true
      },
      itemIdFlag: {
          refreshModel: true
      },
      source: {
          refreshModel: true
      },
  },

  model:function(){
    return {};
  },
  headerTitle(){
    var controller = this.getCurrentController();
    var itemId = controller.get("itemId");
    var source = controller.get("source");
    console.log("url in detail:"+ "  itemId:"+itemId+"  source:"+source);
    // var curUser = this.get('global_curStatus').getUser();
    if(source === 'add'){
      this.set('header_title','添加员工考核');
      controller.set("showAssessment",true);
    }else if(source === 'look'){
      this.set('header_title','查看员工考核');
      controller.set("showAssessment",false);
    }
  },
  setupController: function(controller,model){
    this._super(controller,model);
    this.headerTitle();
  },
});
