import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  header_title:'不定时服务详情',

  queryParams: {
    service_id: {
      refreshModel: true
    }
  },

  model(){
    return {};
  },
  setupController(controller,model){
    controller.reopen({
      serviceData:Ember.Object.create({
        id: 1,
        serviceName:""
      }),
    });
  }
});
