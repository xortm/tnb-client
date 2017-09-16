import Ember from 'ember';

export default Ember.Controller.extend({
    constants: Constants,
    queryCondition:'',
    showpopInvitePassModal:false,
    mainController: Ember.inject.controller('business.mainpage'),
    exportDef:{
      "model":"building",
      "export":{
        "title":"楼宇列表",
        "cols":[{"name":"name","title":"楼宇名称"},
                {"name":"seq","title":"楼宇编号"},
                {"name":"upLandFloorNum","title":"地上层数"},
                {"name":"downLandFloorNum","title":"地下层数"},
                {"name":"roomNum","title":"房间数"}],
        },
    },
    actions:{
      //跳转楼宇编辑页
      toBuildDetailPage(building){
        if(building){
          let id=building.get('id');
          this.get("mainController").switchMainPage('building-detail',{id:id,editMode:"edit"});
        }else{
          this.get("mainController").switchMainPage('building-detail',{editMode:"add",id:''});
        }
      },
    }
});
