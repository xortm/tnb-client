import Ember from 'ember';
import BaseBusiness from '../base-business';

// var records = [
//   {
//     phone: '139',
//     customer: 'BJ'
//   }
// ];

export default BaseBusiness.extend({
// export default Ember.Route.extend({
  model() {
    var model = {};
    var _self = this;
    var curUser = this.get("global_curStatus").getUser();
    return new Ember.RSVP.Promise(function(resolve, reject) {
        _self.store.query('call', {agent: curUser}).then(function(records){
        model.records = records;
        resolve(model);
      });
    });
  },
});
