import Ember from 'ember';
import ListItem from '../../ui/mobile/list-item';
import GesturesMixin from 'ember-gestures/mixins/recognizers';

export default Ember.Component.extend(ListItem,{
  global_curStatus: Ember.inject.service("current-status"),
  recognizers: 'tap press',
  classStatic: true,
  classNameBindings: ['classStatic:exp-item','expanded:expanded'],
  showFlag: false,
  expanded: false,
  customerId:null,//老人ID
  itemName: null,//对应名称
  detailData:[],//明细数据

  actions:{
    finishSave(item,callback){
      this.sendAction("finishSave",item,callback);
    },
    // queryFlagAction(){
    //   this.sendAction("queryFlagAction");
    // },
    showNursingLog(){
      var showFlag = this.get("showFlag");
      if(showFlag){
        this.set("showFlag",false);
        return;
      }
      this.set("showFlag",true);
    },
    itemExpand(){
      this.set("showFlag",false);
      console.log("customerId in item:",this.get("customerId"));
      this.sendAction("itemExpand",this.get("customerId"));
    },
    nursingLog(customerId){//这是护理日志
      var _self = this;
      var detailContent = this.get("detailContent");
      var itemId = customerId + "_logSure";
      $("#"+itemId).addClass("tapped");
      Ember.run.later(function(){$("#"+itemId).removeClass("tapped");},300);
      console.log("detailContent",detailContent);
      if(!detailContent){
        App.lookup("controller:business").popTorMsg("护理日志不能为空(信息)");
        return;
      }
      this.sendAction("nursingLog",customerId,detailContent,function(){
        _self.set("showFlag",false);
        _self.set("detailContent"," ");
        App.lookup("controller:business").popTorMsg("护理日志已经保存");
      });
    },

  }

});
