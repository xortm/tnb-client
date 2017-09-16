import Ember from 'ember';

export default Ember.Controller.extend({
    queryCondition:'',
    showpopInvitePassModal:false,
    mainController: Ember.inject.controller('business.mainpage'),
    exportDef:{
      "model":"nursemerch",
      "export":{
        "title":"楼宇列表",
        "cols":[{"name":"name","title":"物品名称"},
                {"name":"code","title":"物品编号"},
                {"name":"type.typename","title":"物品类型"},
                {"name":"price","title":"价格"}],
        },
    },
    actions:{
      //跳转楼宇编辑页
      toMerchDetailPage(merch){
        if(merch){
          let id=merch.get('id');
          this.get("mainController").switchMainPage('nursemerch-detail',{id:id,editMode:"edit"});
        }else{
          this.get("mainController").switchMainPage('nursemerch-detail',{editMode:"add",id:''});
        }
      },
    }
});
