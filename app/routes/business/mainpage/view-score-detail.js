import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  feedBus: Ember.inject.service("feed-bus"),
  header_title: "评分列表",
  queryParams: {
      itemId: {
          refreshModel: true
      },
  },

  model:function(){
    return {};
  },
  setupController:function(controller,model){
    this._super(controller,model);
  },
});
