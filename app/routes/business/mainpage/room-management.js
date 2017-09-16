import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'房间列表',
  model:function(){
    return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={isPublicFlag:0};//添加isPublicFlag0 不是公共区域的
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {
          filter = $.extend({}, filter, {'name@$like@$or1':curController.get('queryCondition')});
          filter = $.extend({}, filter, {'[floor][name@$like]@$or1':curController.get('queryCondition')});
          filter = $.extend({}, filter, {'[floor][building][name@$like]@$or1':curController.get('queryCondition')});
        }
    }
    if(this.get('orientationID')){
      filter = $.extend({}, filter, {'[orientation][id]':this.get('orientationID')});
    }
    if(this.get('roomTypeID')){
      filter = $.extend({}, filter, {'[roomType][id]':this.get('roomTypeID')});
    }
    params.filter = filter;
    sort = {
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    let _self = this;
    var params=this.buildQueryParams();
    let allBeds = _self.get("store").peekAll("bed");
    var roomList=this.findPaged('room',params,function(roomList){
      roomList.forEach(function(room){
        allBeds.filterBy("roomId",room.get("id")).forEach(function(bed){
          bed.set("room",room);
        });
      });
    });
    this.getCurrentController().set("roomList", roomList);
    this.getCurrentController().set("roomTypeID",'');
  },
  actions:{
    search:function(){
      this.doQuery();
    },
    roomSelect(roomType){
      if(roomType){
        this.set('roomTypeID',roomType.id);
      }else{
        this.set('roomTypeID','');
      }
      this.doQuery();
    },
    orientationSelect(orientation){
      if(orientation){
        this.set('orientationID',orientation.id);
      }else{
        this.set('orientationID','');
      }
      this.doQuery();
    }
  },
  setupController: function(controller,model){
    this.set('roomTypeID','');
    this.set('orientationID','');
    this.doQuery();
    let queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);
  }
});
