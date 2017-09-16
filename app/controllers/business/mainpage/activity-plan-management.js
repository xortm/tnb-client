import Ember from 'ember';
import BaseController from './base-controller';

export default BaseController.extend({
    constants: Constants,
    //queryCondition:'',
    mainController: Ember.inject.controller('business.mainpage'),
    dateService: Ember.inject.service("date-service"),
    actions: {
        dpShowAction(e) {},
        toDetailPage(plan) {
            if (plan) {
                let id = plan.get('id');
                console.log("++++++++id++++++++++++++++**********", id);
                this.get("mainController").switchMainPage('activity-plan-detail', {
                    id: id,
                    editMode: "edit"
                });
            } else {
                this.get("mainController").switchMainPage('activity-plan-detail', {
                    editMode: "add",
                    id: ""
                });
            }
        },              
    }
});
