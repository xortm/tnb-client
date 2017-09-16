import Ember from 'ember';
import FormElement from './hack/bs-form-element';
import _ from 'lodash/lodash';

export default FormElement.extend({
  // showValidation: true,
  focusOut(...args) {
    console.log("focusOut in");
    var focusOutAct = this.get("focus-out");
    if(focusOutAct){
      this.sendAction(focusOutAct,...args);
    }
    // this.set('showValidation', true);
  },
  // errors: Ember.computed("property","model",function(){
  //   var propertyName = this.get("property");
  //   var errors = this.get("model.errors");
  //   console.log("errors in " + propertyName + ":",errors);
  //   var error = _.filter(errors, {
  //     key: propertyName
  //   });
  //   console.log("error in " + propertyName + " is:",errors);
  //   return error;
  // }),
  errorsObs: function(){
    var propertyName = this.get("property");
    var errors = this.get("model.errors");
    console.log("errors in " + propertyName + ":",errors);
    var error = _.filter(errors, {
      key: propertyName
    });
    console.log("error in " + propertyName + " is:",error);
    if(!error||error.length===0){
      this.set("errors",new Ember.A());
      this.set('showValidation', false);
      return;
    }
    var err = new Ember.A();
    err.pushObject(error[0].validation[0]);
    console.log("need set error:",err);
    this.set("errors",err);
    this.set('showValidation', true);
  }.observes("model.validFlag"),
});
