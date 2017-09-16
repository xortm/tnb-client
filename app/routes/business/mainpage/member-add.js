import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataLoader: Ember.inject.service("data-loader"),
    header_title: '客户详情',
    model() {
        return {};
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
