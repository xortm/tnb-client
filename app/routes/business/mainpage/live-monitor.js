import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
  header_title: '实时监控',
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
        }
    }
    params.filter = filter;
    sort = {
         'name':'asc'
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    let _self = this;
    var params=this.buildQueryParams();
    var buildingList=this.findPaged('building',params).then(function(buildingList){
      _self.getCurrentController().set("buildingList", buildingList);
      if(buildingList&&buildingList.get("length")>0){
        _self.getCurrentController().send('selectBuild',buildingList.get('firstObject'));
      }
    });
  },

  setupController:function(controller,model){
    this._super(controller,model);
    controller.set("deviceListFlag",true);
    controller.set("deviceObjFlag",0);
    controller.set("videoList",null);
    // controller.set("deviceObj",null);
    this.store.query('devicebindmore',{
      filter:{
        'camera@$isNotNull':'null',
      },
    }).then(function(devicebindmores){
      // console.log("devicebindmores in setupController:",devicebindmores);
      // console.log("devicebindmores in setupController room:",devicebindmores.get("firstObject").get("room"));
      // console.log("devicebindmores in setupController floor:",devicebindmores.get("firstObject").get("room.floor"));
      // console.log("devicebindmores in setupController building:",devicebindmores.get("firstObject").get("room.floor.building"));
      // console.log("devicebindmores in setupController name:",devicebindmores.get("firstObject").get("room.floor.building.name"));
      controller.set("devicebindmores",devicebindmores);
    });
    // this.doQuery();
  },

  actions:{},
});
