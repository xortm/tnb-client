import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
  },
  header_title:'对应问卷信息',
  setupController: function(controller, model) {
      this._super(controller, model);
      var editMode = this.getCurrentController().get('editMode');
      var id = this.getCurrentController().get('id');
      if (editMode == 'edit') {
          this.store.findRecord('evaluateresult', id).then(function(evaluate) {
              controller.set('evaluate', evaluate);
              controller.set('addMode', false);
              controller.set("flagEdit", true);
              controller.incrementProperty("changeFlag");
          });
      } else {
          controller.set('evaluate', this.store.createRecord('evaluateresult', {}));
          controller.set('addMode', true);
          controller.set("flagEdit", false);
          controller.incrementProperty("changeFlag");
      }
      this.store.query('user', {}).then(function(userList) {
          controller.set('userList', userList);
      });
      this.store.query("evaluatemodel", {}).then(function(modelList) {
          controller.set("modelList", modelList);
      });
      this.store.query("customer", {}).then(function(customerList) {
          controller.set("customerList", customerList);
      });
  },
});
