import Ember from 'ember';

export default Ember.Controller.extend({
    constants: Constants,
    queryCondition:'',
    mainController: Ember.inject.controller('business.mainpage'),

    actions:{
      //跳转至编辑页
      toDetailPage(bill){
        let id = bill.get('id');
        this.get("mainController").switchMainPage('audit-detail',{id:id});
      },
    }

});
