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
    if(source === 'add'){
      this.set('header_title','添加检查记录');
    }else if(source === 'look'){
      this.set('header_title','查看检查记录');
    }
  },
  setupController: function(controller,model){
    this._super(controller,model);
    this.headerTitle();
  },
});
