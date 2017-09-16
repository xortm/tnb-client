import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  queryParams: {
    source: {
      refreshModel: true
    }
  },
  model(params){
    return {};
  },
  doQuery:function(){
    var controller = this.get("controller");
    var params = this.buildQueryParams();
    controller.infiniteQuery('dicttype',params);
  },
  buildQueryParams:function(){
    var params = {};
    var controller = this.getCurrentController();
    var source = controller.get("source");
    var filter = {};
    if(source === 'staffCensus'){//籍贯
      filter = {typegroup:{id:39}};
    }else {
      filter = {typegroup:{id:38}};
    }
    params.filter = filter;
    console.log("params filter",params);
    return params;
  },
  setupController: function(controller,model){
    this._super(controller,model);
    this.doQuery();
    var source = controller.get("source");
    var curUser = this.get('global_curStatus').getUser();
    if(source === 'staffCensus'){
      this.set('header_title','选择籍贯');
      this.store.findRecord('user',curUser.get("id")).then(function(user){
        controller.set('theChoose',user.get("staffCensus"));
      });
    }else {
      this.set('header_title','选择民族');
      this.store.findRecord('user',curUser.get("id")).then(function(user){
        controller.set('user',user);
        controller.set('theChoose',user.get("staffNation"));
      });
    }

  },


});
