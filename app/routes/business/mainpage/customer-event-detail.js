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
    header_title:'老人事件',
    model(){
      return{};
    },
    setupController(controller, model){
      let _self = this;
      this._super(controller, model);
      var editMode=this.getCurrentController().get('editMode');
      var id=this.getCurrentController().get('id');
      if(editMode=='edit'){
        controller.set('detailEdit',false);
        this.store.findRecord('customer-event',id).then(function(event){
          controller.set('event',event);
        });
      }else{
        controller.set('detailEdit',true);
        controller.set('event',this.store.createRecord('customer-event',{}));
      }
      this.store.query('customer', {
        filter:{
          '[customerStatus][typecode@$like]@$or1---1':'customerStatusIn',
          '[customerStatus][typecode@$like]@$or1---2':'customerStatusTry',
          'addRemark':'normal'
        }
      }).then(function(customerList) {
          customerList.forEach(function(customer) {
              customer.set('namePinyin', customer.get("name"));
          });
          controller.set('customerList', customerList);
          controller.set('customerListFirst', customerList.get('firstObject'));
      });
    }
});
