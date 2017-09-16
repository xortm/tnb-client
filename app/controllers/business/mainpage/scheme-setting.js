import Ember from 'ember';
import BaseController from './base-controller';

export default BaseController.extend({
    constants: Constants,
    mainController: Ember.inject.controller('business.mainpage'),
    dateService: Ember.inject.service("date-service"),
    // flag:1,
    actions:{
      dietClick(dietParams) {
          if (dietParams) {
            this.set("dietParams", true);
            this.set("sportsParams", false);
            this.set("medicineParams", false);
          }
      },
      sportsClick(sportsParams) {
          if (sportsParams) {
            this.set("dietParams", false);
            this.set("sportsParams", true);
            this.set("medicineParams", false);
          }
      },
      medicineClick(medicineParams) {
          if (medicineParams) {
            this.set("dietParams", false);
            this.set("sportsParams", false);
            this.set("medicineParams", true);
          }
      },
      dietDetail(diet){
          if (diet){
              let id = diet.get('id');
              console.log("++++++++id++++++++++++++++**********", id);
              this.get("mainController").switchMainPage('scheme-diet-detail', {
                  id: id,
                  editMode: "edit"
              });
          } else {
              this.get("mainController").switchMainPage('scheme-diet-detail', {
                  editMode: "add",
                  id: ""
              });
          }
      },
      sportsDetail(sports){
          if (sports){
              let id = sports.get('id');
              console.log("++++++++id++++++++++++++++**********", id);
              this.get("mainController").switchMainPage('scheme-sports-detail', {
                  id: id,
                  editMode: "edit"
              });
          } else {
              this.get("mainController").switchMainPage('scheme-sports-detail', {
                  editMode: "add",
                  id: ""
              });
          }
      },
      medicineDetail(medicine){
          if (medicine){
              let id = medicine.get('id');
              console.log("++++++++id++++++++++++++++**********", id);
              this.get("mainController").switchMainPage('scheme-medicine-detail', {
                  id: id,
                  editMode: "edit"
              });
          } else {
              this.get("mainController").switchMainPage('scheme-medicine-detail', {
                  editMode: "add",
                  id: ""
              });
          }
      },



    }
});
