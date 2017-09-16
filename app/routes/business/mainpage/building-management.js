import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'楼宇信息列表',
  model() {
    return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={};
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {
          filter = $.extend({}, filter, {'name@$like':curController.get('queryCondition')});
          // filter = $.extend({}, filter, {'[building][name@$like]@$or1':curController.get('queryCondition')});
        }
    }
    params.filter = filter;
    sort = {

         'name':'asc',
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    var params=this.buildQueryParams();
    var buildingList=this.findPaged('building',params,function(buildingList){
      buildingList.forEach(function(item){//可以给item.set("roomNum","查到的room数")。这样就能在hbs获取到了，数据绑定原理，有就是修改，没有就是增加
      });
    });
    this.getCurrentController().set("buildingList", buildingList);
  },
  actions:{
    search:function(){
      this.doQuery();
    },
  },

  setupController: function(controller,model){
    this.doQuery();
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);
    var building = controller.get("building");
    console.log("building111",building);

  }
});
