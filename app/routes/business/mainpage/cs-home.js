import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  queryParams: {
    qp: {
      refreshModel: true
    }
  },

  model(params,transition) {
    var _self = this;

    //console.log("transition.queryParams in home",transition);
    //this.set('header_title',"欢迎进入天年宝");

  },
  actions: {
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.initWidth();
    controller.getJujia();
  }
});
