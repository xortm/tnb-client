import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title:"完成任务",
  model(){
    return {};
  },
  doQuery:function(){
    var controller = this.get("controller");
    var params = this.buildQueryParams();
    controller.infiniteQuery('task',params);
  },
  buildQueryParams:function(){
    var params = {};
    var controller = this.getCurrentController();
    var source = controller.get("source");
    var filter = {};
    if(source === 'xx'){//可能有的判断条件
      filter = {}
    }else {
      filter = {}
    }
    params.filter = filter;
    return params;
  },
  setupController: function(controller,model){
    this._super(controller,model);
    this.doQuery();
    var curUser = this.get("global_curStatus").getUser();
    var _self = this;
    this.store.findRecord('user',curUser.get("id")).then(function(curUser){
      controller.set("curUser",curUser);
    });

  },

});
