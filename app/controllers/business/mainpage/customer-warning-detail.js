import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  feedBus: Ember.inject.service("feed-bus"),
  pathConfiger: Ember.inject.service("path-configer"),
  global_curStatus: Ember.inject.service("current-status"),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"customerWarningDetailContainer",
  scrollPrevent: true,//阻止下拉刷新的所有操作
  customerListFlag: 0,
  constants:Constants,
  warningItem:Ember.computed("itemId","itemIdFlag",function(){
    let _self = this;
    //从全局上下文服务里拿到外层传递的数据
    let warningItem = this.get("feedBus").get("serviceData");
    console.log("customerwarningItemThe computed:",warningItem);
    this.get("feedBus").set("serviceData",null);//重置feedbus数据
  //与传参进行比较，一致才设置
    if(warningItem.get("id")===this.get("itemId")){
      console.log('warningItem in detail:',warningItem);
      let customerId = warningItem.get('caller.id');
      console.log('customerId in detail:',customerId);//当前老人ID
      //查询当前老人的所有随时任务
      this.store.query('specservice',{filter:{flagQueryType:'suishi',customerId:customerId,queryStartDate:'0',queryEndDate:'24'}}).then(function(anyTimedTaskList){
        let services = new Ember.A();
        anyTimedTaskList.forEach(function(task){//看下每一项的名称，数据是否正确
          let service = Ember.Object.create({});
          service.set('title',task.get('projectItem.item.name'));
          service.set('itemExeLength',task.get('itemExes.length'));
          service.set('busiId',task.get('projectItem.id'));
          service.set('itemExes',task.get('itemExes'));
          service.set('item',task.get('projectItem'));
          service.set('desc',task.get('projectItem.item.remark'));
          services.pushObject(service);
        });
        let customer = _self.store.peekRecord('customer',customerId);
        customer.set('services',services);
        _self.set('customer',customer);
        _self.finishListFun();
        _self.directInitScoll(true);
      });
      return warningItem;
    }
  }),
  //重置完成情况列表
  finishListFun :function(){
    let list = new Ember.A();
    let defaultResultList = this.get("dataLoader.serviceFinishDefaultList");
    console.log("defaultResultList:",defaultResultList);
    defaultResultList.forEach(function(defaultResult){
      if(defaultResult.get("remark") == Constants.servicefinishlevelDefault1 || defaultResult.get("remark") == Constants.servicefinishlevelDefault3){
        list.pushObject(defaultResult);
      }
    });
    console.log("list computed:",list);
    list.forEach(function(item){
      if(item.get("remark") == Constants.servicefinishlevelDefault1){
        item.set("exehasSelect",true);
      }else{
        item.set("exehasSelect",false);
      }
    });
    this.set("finishList",list);
  },
  actions:{
    switchShowAction(){
    },
    saveDetail(){
      let _self = this;
      var itemId = "detail_warning";
      let operateNote = this.get('operateNote');
      let curUser = this.get('global_curStatus').getUser();
      let curEmployee = curUser.get('employee');
      var warningItem = this.get("warningItem");
      let sysTime = _self.get("dataLoader").getNowTime();
      console.log("sysTime in save:",sysTime);
      var flagObj = this.get("dataLoader").findDict(Constants.hbeaconWarningCancelByHand);
      warningItem.set("operateNote",operateNote);
      warningItem.set("operateTime",sysTime);
      warningItem.set("operater",curEmployee);
      warningItem.set("flag",flagObj);
      $("." + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("." + itemId).removeClass("tapped");
        Ember.run.later(function(){
          //保存数据
          // warningItem.save().then(function() {
            App.lookup("controller:business").popTorMsg("操作成功");
            warningItem.set("hasApply",true);
            _self.get("feedBus").set("serviceData",warningItem);
            var customerListFlag = _self.get("customerListFlag");
            _self.incrementProperty("customerListFlag");
            _self.set("operateNote","");
            var params = {
              customerListFlag:customerListFlag
            };
            console.log('params in customer-warning-detail',params);
            App.lookup('controller:business.mainpage').switchMainPage('customer-warning',params);
          // }, function(err) {
          //     console.log("save err!");
          //     console.log("err:",err);
          //     let error = err.errors[0];
          //     if (error.code === "15") {
          //       App.lookup("controller:business").popTorMsg("操作失败,此预警已经处理!");
          //     }
          // });

        },100);
      },200);
    },
    toTaskDetail(service){
      console.log('to task detail ');
      let itemId = '#warning-task-' + service.get('busiId');
      $(itemId).addClass('tapped');
      let warningTask = this.get('customer');
      let warningItem = this.get('warningItem');
      warningTask.set('customerName',warningItem.get('caller.name'));
      warningTask.set('bedName',warningItem.get('bed.roomBedName'));
      warningTask.set('title',service.get('item.item.name'));
      warningTask.set('desc',service.get('item.item.remark'));
      warningTask.set('baseServiceItem',service.get('item.item'));
      warningTask.set('projectItem',service.get('item'));
      warningTask.set('warningItem',warningItem);
      this.set('feedBus.warningTask',warningTask);
      Ember.run.later(function(){
        $(itemId).removeClass('tapped');
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage("warning-task-detail",{itemIdFlag:Math.random(),});
        },100);
      },200);

    },
    addNewTask(service){
      let _self = this;
      var saveId = "save-"+service.get("busiId");
        $("#"+saveId).addClass("tapped");
      Ember.run.later(function(){
        $("#"+saveId).removeClass("tapped");
        Ember.run.later(function(){
          _self.set('addNewWarningTask',true);
          _self.set('curService',service);
        },100);
      },200);
    },
    saveCountApply(){//增加一次随时任务的执行，保存后同时处理消息通知
      let _self = this;
      let service = this.get("curService");
      let user = this.get("global_curStatus").getUser();
      let item  = this.store.createRecord('nursingplanexe',{
        exeStaff:user.get("employee"),
      });
      let finishList = this.get('finishList');
      let finishLevel = finishList.findBy('remark',Constants.servicefinishlevelDefault1);
      item.set('finishLevel',finishLevel);
      item.set('itemProject',service.get('item'));
      item.set('warning',_self.get('warningItem'));
      item.save().then(function(){
        _self.incrementProperty('feedBus.refreshWarningFlag');
        _self.send('saveDetail');
        // _self.incrementProperty("customerListFlag");
        // let customerListFlag = _self.get('customerListFlag');
        //
        // let params = {
        //   customerListFlag:customerListFlag
        // };
        // App.lookup('controller:business.mainpage').switchMainPage('customer-warning',params);
        _self.set('addNewWarningTask',false);
      });
    },
    invitation(){
      this.set('addNewWarningTask',false);
    },
  }
});
