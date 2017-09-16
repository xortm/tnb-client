import Ember from 'ember';
import Changeset from 'ember-changeset';
import evaValidations from '../../../validations/eva';
import lookupValidator from 'ember-changeset-validations';
export default Ember.Controller.extend(evaValidations, {
    constants: Constants,
    dateService: Ember.inject.service("date-service"),
    store: Ember.inject.service("store"),
    feedBus: Ember.inject.service("feed-bus"),
    showBed:false,
    showCus:true,
    //hasChoosed: "false",
    defaultBed: Ember.computed('evaluate.bed', function() {
        return this.get('evaluate.bed');
    }),
    evaObs: function() {
        var model = this.get("evaluate");
        console.log("model evaluate", model);
        if (!model) {
            return null;
        }
        var evaModel = new Changeset(model, lookupValidator(evaValidations), evaValidations);
        this.set("evaModel", evaModel);
    }.observes("evaluate"),
    actions: {
        invalid() {
            //alert("invalid");
        },
        selectBed(bed){
          var _self = this;
          this.get('evaluate').set('bed',bed);
          //通过条件bed查询customer
          if(bed){
            this.store.query('customer', {filter:{'[bed][id]':bed.get('id')}}).then(function(customerList) {
              var customerObj=customerList.get('firstObject');
               _self.set('evaModel.customer', customerObj);
               //this.set('chooseBed',customerObj.get('name'));
            });
          }else {
            _self.set('evaModel.customer', '');
          }
        },
        selectCustomer(customer) {
            this.get('evaModel').set("customer", customer);
        },
        nextClick() {
          var _self = this;
          var evaModel = this.get("evaModel");
            var mainpageController = App.lookup('controller:business.mainpage');
            evaModel.validate().then(function() {
              if (evaModel.get('errors.length') === 0){
                //通过全局服务进行上下文传值
                _self.get("feedBus").set("customerData", _self.get('evaModel.customer'));
                mainpageController.switchMainPage('eva-model-add', {
                    editMode: "add",
                    id: ""
                });
              }else {
                evaModel.set("validFlag", Math.random());
              }
              });
        },
        selectBedShow(){
          this.set('showBed',true);
          this.set('showCus',false);
        },
        selectCus(){
          this.set('showBed',false);
          this.set('showCus',true);
        }
    }
});
