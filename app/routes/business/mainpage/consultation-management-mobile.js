import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  dataLoader: Ember.inject.service("data-loader"),
  header_title:'咨询管理',
  queryParams: {
      dataListFlag: {
          refreshModel: true
      },
  },

  setupController: function(controller,model){
    this.get("dataLoader").set('conTabCode', "tabInfo");
    this._super(controller,model);
  },
});
