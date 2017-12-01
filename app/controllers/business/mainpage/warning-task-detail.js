import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  feedBus: Ember.inject.service("feed-bus"),
  pathConfiger: Ember.inject.service("path-configer"),
  global_curStatus: Ember.inject.service("current-status"),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"warningTaskDetailContainer",
  preventInfinite: true,
  serviceItemChangeFlag:0,
  toSpecservice:0,
  constants:Constants,
  init:function(){
  },
  //初始化数据
  serviceItemObs :function(){
    let itemIdFlag = this.get("itemIdFlag");
    let taskFlag = this.get('taskFlag');
    if(!itemIdFlag){return;}
    //从全局上下文服务里拿到外层传递的数据
    let serviceItem = this.get('feedBus.warningTask');
    console.log('serviceItem in warning-task-detail',serviceItem);
      this.set("serviceItem",serviceItem);
      this.tagItemsFun();
  }.observes("itemIdFlag"),
  //初始化执行情况标签数据
  tagItemsFun: function(){
    //查找出执行标签的字典列表，然后比较
    let serviceItem = this.get('feedBus.warningTask');
    let baseServiceItem = serviceItem.get('baseServiceItem');
    console.log(baseServiceItem.get('id'));
    let defaultResultList = this.get("dataLoader.serviceFinishDefaultList");
    let list = new Ember.A();
    if(!defaultResultList){
      return ;
    }
    defaultResultList.forEach(function(level){
      if(level.get('item.id')==baseServiceItem.get('id')){
        level.set('exehasSelect',false);
        list.pushObject(level);
      }
    });
    this.set('resultList',list);
    this.hideAllLoading();
  },

  actions:{
    invalid(){},
    switchShowAction(){
      this.directInitScoll(true);
      var serviceItem = this.get("serviceItem");
      console.log("serviceItem111",serviceItem);
      if(!serviceItem.hasApply){
        this.set("serviceItem.serviceDesc","");//从back按钮退出再进入，需清空备注信息
        // this.set("trueDrugNum","");//从back按钮退出再进入，需清空备注信息
      }
    },
    //操作执行情况标签
    tagResultChoice(finishId,finishName,finish){
      console.log("item obj:",finish);
      let resultList = this.get("resultList");
      let remarkStr = "";
      let remarkNameStr = "";
      let exeTabRemark = "";
      let jsonObj = {};
      if(resultList){
        resultList.forEach(function(item){
          if(item.get("id")==finishId){
            //如果与字典数据匹配，则设置选中
            item.toggleProperty("exehasSelect");
          }
          if(item.get("exehasSelect")){
            remarkStr += item.get("remark") + ",";
          }
        });
        if(remarkStr.length){
          jsonObj.remarkStr = remarkStr.substring(0,remarkStr.length-1);
        }
        this.get("serviceItem").set("exeTabRemark",JSON.stringify(jsonObj));
      }
      this.set("resultList",resultList);
    },
    //执行保存操作
    saveDetail(){
      let elementId = '#detail_tosure';
      let _self = this;
      let serviceItem = this.get('serviceItem');
      //点击动画
      $(elementId).addClass('tapped');
      Ember.run.later(function(){
        $(elementId).removeClass('tapped');
        Ember.run.later(function(){
          //保存一条随时任务的执行记录
          let item = _self.store.createRecord('nursingplanexe',{});
          let user = _self.get("global_curStatus").getUser();
          item.set('exeStaff',user.get('employee'));//执行人
          let finishList = _self.get('resultList').filter(function(result){
            return result.get('exehasSelect') == true;
          });
          let finishLevel ;//完成情况标签

          if(finishList.get('length')>0){
            //有标签的拼接字符串备注
            item.set('exeTabRemark',_self.get('serviceItem.exeTabRemark'));
          }
          //随时任务执行，默认完成情况--完成
          finishLevel = _self.get("dataLoader.serviceFinishDefaultList").findBy('remark',Constants.servicefinishlevelDefault1);
          item.set('remark',serviceItem.get('serviceDesc'));
          item.set('finishLevel',finishLevel);
          item.set('itemProject',serviceItem.get('projectItem'));
          item.set('warning',serviceItem.get('warningItem'));
          item.save().then(function(){
            //保存消息通知的处理记录
            App.lookup('controller:business.mainpage.customer-warning-detail').send('saveDetail');
          });
        },100);
      },200);
    },


  }
});
