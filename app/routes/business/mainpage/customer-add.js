import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataLoader: Ember.inject.service("data-loader"),
    header_title: '客户详情',
    model() {
        return {};
    },
    buildQueryParams(){
      var _self = this;
      var params = this.pagiParamsSet();
      var filter = {};
      var curController = this.getCurrentController();
      params.filter = filter;
      return params;

    },
    doQuery: function(){
      var _self = this;
      var params = this.buildQueryParams();//拼查询条件
    },
    actions: {
      saveRefresh: function() {
            this.refresh();
        },
    },
    setupController: function(controller, model) {
      this._super(controller, model);
      controller.set('customer', this.store.createRecord('customer', {}));
       controller.set('healthRecordInfo', this.store.createRecord('healthrecord', {}));
    },
});
