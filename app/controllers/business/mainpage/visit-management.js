import Ember from 'ember';
export default Ember.Controller.extend({
    constants: Constants,
    mainController: Ember.inject.controller('business.mainpage'),
    dateService: Ember.inject.service("date-service"),
    actions: {
      dpShowAction(e){
      },
        toDetailPage(vist) {
            if (vist) {
                let id = vist.get('id');
                console.log("++++++++id++++++++++++++++**********", id);
                this.get("mainController").switchMainPage('visit-detail', {
                    id: id,
                    editMode: "edit"
                });
            } else {
                //alert("添加");
                var consultId=this.get("id");
                console.log("+++++++vist+++++++++",vist);
                this.get("mainController").switchMainPage('visit-detail', {
                    editMode: "add",
                    id:"",
                    consultId:consultId
                });
                //alert("进来了");
            }
        },
        changeBeginDateAction(date) {
            this.set("beginDate",date);
        },
        changeEndDateAction(date) {
            console.log("is true",typeof date);
            this.set("endDate",date);
        },
    }
});
