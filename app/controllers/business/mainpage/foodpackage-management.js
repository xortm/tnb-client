import Ember from 'ember';
import Changeset from 'ember-changeset';
import FoodPackageValidations from '../../../validations/foodpackage';
import lookupValidator from 'ember-changeset-validations';
export default Ember.Controller.extend(FoodPackageValidations,{
    constants: Constants,
    mainController: Ember.inject.controller('business.mainpage'),
    actions: {
      invalid(){},
        invitation(){
          this.set('addfoodpackageModel',false);
        },
        toDetailPage(recharge) {
          let id = recharge.get('id');
          this.get("mainController").switchMainPage('foodpackage-detail', {id: id});
        },
        toAddFoodpackage(){
          let foodpackage = this.store.createRecord('foodpackage',{});
          let foodpackageModel = new Changeset(foodpackage, lookupValidator(FoodPackageValidations), FoodPackageValidations);
          this.set('foodpackageModel',foodpackageModel);
          this.set('addFoodpackageModel',true);
        },
        saveNewFoodpackage(){
          let _self = this;
          let foodpackageModel = this.get('foodpackageModel');
          let foodpackageList = this.get('foodpackageList');
          foodpackageModel.validate().then(function(){
              if(foodpackageModel.get('errors.length')===0){
                _self.set('addfoodpackageModel',false);
                  foodpackageModel.save().then(function(food){
                    _self.get("mainController").switchMainPage('foodpackage-detail', {
                        id: food.get('id')
                    });
                  });
              }else{
                foodpackageModel.set('validFlag',Math.random());
              }
          });
        }
    }
});
