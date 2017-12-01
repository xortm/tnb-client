import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  global_dataLoader: Ember.inject.service('data-loader'),
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    this.store.query('conf',{}).then(function(confList){
      let list = new Ember.A();
      confList.forEach(function(conf){
        switch (conf.get('code')) {
          case 'tell':
            conf.set('name','中心电话');
            conf.set('unit','天');
            conf.set('choosed',false);
            list.pushObject(conf);
            break;
          default:
        }
      });
      controller.set('confList',list);
    });
  }
});
