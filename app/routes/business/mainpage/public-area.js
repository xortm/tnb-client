import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'公共区域信息列表',

  model:function(){
    return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={'isPublicFlag':1};
    var sort;
    if (this.get('publicTypename')) {
      filter = $.extend({}, filter, {'[publicType][typename]':this.get('publicTypename')});
    }
    if(curController.get('buildingID')){
      filter = $.extend({}, filter, {floor:{'[building][id]':curController.get('buildingID')}});
    }
    if(curController.get('floorID')){
      filter = $.extend({}, filter, {'[floor][id]':curController.get('floorID')});
    }

    params.filter = filter;
    sort = {
        createDateTime:'desc',
        // '[floor][building][name]':'asc',
        // '[floor][id]':'asc',
        //  'name':'asc',

    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    var params=this.buildQueryParams();
    var roomList=this.findPaged('room',params,function(roomList){});
    this.getCurrentController().set("roomList", roomList);
    // this.getCurrentController().set("buildingID",'');
    this.getCurrentController().set("floorID",'');//清除默认查询条件
    this.getCurrentController().set("publicTypename",'');//清除默认查询条件
  },
  actions:{
    search:function(){
      this.doQuery();
    },
    publicTypeSelect:function(select){
      if(select){
        console.log("11111111111",select.get("typename"));
        this.set('publicTypename',select.get("typename"));
      }else{
        this.set('publicTypename','');
      }
      this.doQuery();
    },
  },
  setupController: function(controller,model){
    controller.set('buildingID','');
    controller.set('floorID','');
    controller.set('defaultBuilding','');
    controller.set('defaultFloor','');
    controller.set('publicTypename','');
    var _self = this;
    var buildingList = this.store.peekAll('building');//先本地 peekAll查询 没有再发起网络请求
    console.log("buildingList peekAll",buildingList);
    if(buildingList){
      controller.set('buildingList',buildingList);
    }else {
      this.store.query('building',{}).then(function(buildingList){
        // console.log("building is",buildingList);
        controller.set('buildingList',buildingList);
        controller.set('buildingListFirst',buildingList.get("firstObject"));
      });
    }


    this.doQuery();
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);
  }
});
