import Ember from 'ember';

export default Ember.Controller.extend({
  constants: Constants,
  queryCondition:'',
  mainController: Ember.inject.controller('business.mainpage'),
  exportDef:{
    "model":"room",
    "export":{
      "title":"公共区域",
      "cols":[{"name":"publicType.typename","title":"公共区域 类型/用途"},
              {"name":"name","title":"公共区域 编号/名称"},
              {"name":"floor.building.name","title":"所属楼宇"},
              {"name":"floor.name","title":"所属楼层"},
              {"name":"remark","title":"备注"}],
      },
  },
  actions:{
    //选择楼宇
    selectBuilding(building) {
      var _self = this;
      this.set('defaultBuilding', building);
      this.store.query('floor',{filter:{building:{id:building.get("id")}}}).then(function(floorList){
        _self.set('floorList',floorList);
        _self.set('floorListFirst',floorList.get("firstObject"));
        // console.log("floor is",floorList);
      });
      this.set("buildingID",building.get("id"));
      this.set('defaultFloor', '');//默认清空
      App.lookup("route:business.mainpage.public-area").doQuery();
        // console.log("building is",buildingList);
    },
    // //选择楼层
    selectFloor(floor) {
      this.set('defaultFloor', floor);
      this.set('floorList', floor);
        // console.log('floor is',roomInfo.floor);
        this.set("floorID",floor.get("id"));
        App.lookup("route:business.mainpage.public-area").doQuery();
        this.set('floorList', '');//楼层选项默认清空
    },
    //跳转公共区域编辑页
    toDetailPage(room){
      if(room){
        let id=room.get('id');
        this.get("mainController").switchMainPage('public-area-detail',{id:id,editMode:"edit"});
      }else{
        this.get("mainController").switchMainPage('public-area-detail',{editMode:"add",id:''});
      }
    },

  }
});
