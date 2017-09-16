import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  header_title:'员工信息查看',

  model:function(){
    return {};
  },
  setupController: function(controller,model){
    this._super(controller,model);
    controller.reopen({
      actions:{
        toAddPage(){
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('user-add');
        },
        toDetailPage(){
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('user-detail');
        },
      }
    });

  }
});
