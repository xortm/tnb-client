import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  feedBus: Ember.inject.service("feed-bus"),
  global_curStatus: Ember.inject.service("current-status"),

  infiniteContentPropertyName: "serviceList",
  infiniteModelName: "service",
  infiniteContainerName:"serviceCounterApplyContainer",

  serviceItem:Ember.computed("service_id",function(){
    //从全局上下文服务里拿到外层传递的数据
    let serviceItem = this.get("feedBus").get("threadData");
    //与传参进行比较，一致才设置
    if(serviceItem.get("id")===this.get("service_id")){
      return serviceItem;
    }
  }),

  actions:{
    backMain(){
      App.lookup("controller:business.mainpage").switchMainPage("task-square");
    },
    saveCountApply(){
      let _self = this;
      let detailContent = this.get("detailContent");
      if(!detailContent){
        App.lookup("controller:business").popTorMsg("请填写服务详情内容");
        return;
      }
      let remark = [];
      if(this.get("serviceItem.applyContent")&&this.get("serviceItem.applyContent").length>0){
        remark = JSON.parse(this.get("serviceItem.applyContent"));
      }
      //把详情信息附加到之前的信息中
      let user = this.get("global_curStatus").getUserReal();
      let detailItem = {content:detailContent,applyUserId:user.get("id")};
      remark.push(detailItem);
      this.get("serviceItem").set("applyContent",JSON.stringify(remark));
      App.lookup("controller:business.mainpage.task-square").finishService(this.get("serviceItem"),function(){
        _self.set("detailContent","");
        App.lookup("controller:business").popTorMsg("护理任务--" + _self.get("serviceItem").get("title") + ",已记录");
        App.lookup("controller:business.mainpage").switchMainPage("task-square");
      });
    },
    switchShowAction(){//切换页面都会执行此方法 切换事件 page-constructure.js
      console.log("in it 1111111");
      this.set("detailContent","");
    }
  }
});
