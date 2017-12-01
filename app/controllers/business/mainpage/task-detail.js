import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
import Changeset from 'ember-changeset';
import taskDetailValidations from '../../../validations/task-detail';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(InfiniteScroll,taskDetailValidations,{
  dataLoader: Ember.inject.service("data-loader"),
  feedBus: Ember.inject.service("feed-bus"),
  pathConfiger: Ember.inject.service("path-configer"),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"taskDetailContainer",
  preventInfinite: true,
  serviceItemChangeFlag:0,
  toSpecservice:0,
  notShowTag:false,//不显示完成标签
  // itemIdFlag:0,
  constants:Constants,
  uploadUrl: Ember.computed(function() {return this.get("pathConfiger").get("uploadUrl");}),

  //创建模型
  taskDetailModel: Ember.computed("serviceItem", function() {
      var model = this.get("serviceItem");
      console.log("model customerInfo", model);
      if (!model) {
          return null;
      }
      return new Changeset(model, lookupValidator(taskDetailValidations), taskDetailValidations);
  }),
  init:function(){
  },
  //初始化数据
  serviceItemObs :function(){
    let itemIdFlag = this.get("itemIdFlag");
    let taskFlag = this.get('taskFlag');
    console.log("itemIdFlag in obs:"+itemIdFlag);
    console.log("taskFlag in obs:",taskFlag);
    if(!itemIdFlag){return;}
    console.log("taskFlag in obs after:",taskFlag);
    if(taskFlag=='anytimed'){
      this.set('notShowTag',true);
    }else{
      this.set('notShowTag',false);
    }
    //从全局上下文服务里拿到外层传递的数据
    let serviceItem = this.get("feedBus").get("threadData");
    console.log("customerserviceitemThe computed:",serviceItem);
    // console.log("customerserviceitemThe computed finishRemark:",serviceItem.get("finishRemark"));
    // let finishRemark = serviceItem.get("finishRemark");
    // let finishRemarkArr = finishRemark.split("，");
    // console.log("finishRemarkArr:",finishRemarkArr);
    // let remarkFirst = finishRemarkArr[0];
    // console.log("remarkFirst:",remarkFirst);
    // if(finishRemarkArr.length > 1){
    //   let remarkLast = finishRemarkArr.shift().join("，");
    //   console.log("remarkLast:",remarkLast);
    // }
    // console.log("customerserviceitemThe littleDrugDetail1:",serviceItem.littleDrugDetail);
    // console.log("customerserviceitemThe littleDrugDetail2:",serviceItem.get("littleDrugDetail"));
    //与传参进行比较，一致才设置
    let serviceItemId = serviceItem.get("itemId")||serviceItem.get("item.id");
    console.log('serviceItemId',serviceItemId,'this item id',this.get('itemId'));
    if(serviceItemId==this.get("itemId")){
      this.set("serviceItemId",serviceItemId);
      console.log('is come here');
      var servicefinishlevel = this.get("dataLoader.serviceFinishDefaultList").findBy("remark",Constants.servicefinishlevelDefault1);
      console.log("servicefinishlevel in exeRecord save:",servicefinishlevel);
      serviceItem.set("servicefinishlevel",servicefinishlevel);//标签对象
      let exeTabRemark = serviceItem.get("exeTabRemark");
      console.log("exeTabRemark:",exeTabRemark);
      if (exeTabRemark) {
        //是否存在exeTabRemark
        this.set("exeTabRemarkExit",true);
        if(exeTabRemark.charAt(0)=='{'||exeTabRemark.charAt(0)=='['){
          let exeTabRemarkArr = JSON.parse(exeTabRemark).remarkStr.split(",");
          console.log("exeTabRemarkArr:",exeTabRemarkArr);
          let remarkFirst = exeTabRemarkArr[0];
          console.log("remarkFirst:",remarkFirst);
          let exeTabStr = "";
          let defaultResultList = this.get("dataLoader.serviceFinishDefaultList");
          console.log("defaultResultList:",defaultResultList);
          exeTabRemarkArr.forEach(function(itemStr){
            console.log("itemStr:" + itemStr);
            let exeTab = defaultResultList.findBy("remark",itemStr);
            console.log("exeTab:",exeTabStr);
            if(exeTab){
              exeTabStr += exeTab.get("name") + ",";
              console.log("exeTabStr:",exeTabStr);
            }
          });
          console.log("exeTabStr:",exeTabStr);
          serviceItem.set("exeTabStr",exeTabStr.substring(0,exeTabStr.length-1));//标签对象
        }
      }else{
        this.set("exeTabRemarkExit",false);
      }
      console.log("useDrugNum:",serviceItem.get("useDrugNum"));
      //默认填写用药量
      this.set("trueDrugNum",serviceItem.get("useDrugNum"));
      this.set("serviceItem",serviceItem);
      this.finishListFun();
      this.tagItemsFun();
    }
  }.observes("itemIdFlag"),
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
  //初始化执行情况标签数据
  tagItemsFun: function(){
    //查找出执行标签的字典列表，然后比较
    let items;
    let exePlanItems;
    let defaultResultList = this.get("dataLoader.serviceFinishDefaultList");
    if(!this.get("serviceItem")){return;}
    let _self = this;
    if(this.get("serviceItem").get("medicineDesc")){
      console.log("run in medicineDesc");
      this.set('resultList',null);
      return;
    }else {
      var customerserviceitemId = this.get("serviceItem.customerserviceitem.id");
      console.log("customerserviceItemId", customerserviceitemId);
      let serviceFinishList = defaultResultList.filterBy("item.id",customerserviceitemId);
      console.log("serviceFinishList:",serviceFinishList);
      console.log("serviceFinishList length:",serviceFinishList.get("length"));
      if(!serviceFinishList.get("length")){
        this.set("exeTabExit",false);
        this.set('resultList',null);
        return;
      }else{
        this.set("exeTabExit",true);
        serviceFinishList.forEach(function(item){
          item.set("exehasSelect",false);
        });
        console.log("resultList in obs:",serviceFinishList);
        this.set('resultList',serviceFinishList);
      }
    }

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
    //操作完成情况标签
    tagFinishChoice(finishId,finishName,finish){
      console.log("item obj:",finish);
      // this.get("serviceItem").set("serviceTagexe",finishName);
      // this.get("serviceItem").set("serviceFinishId",finishId);
      this.get("serviceItem").set("servicefinishlevel",finish);
      let finishList = this.get("finishList");
      if(this.get("serviceItem").get("medicineDesc")){
        if(finish.get("remark") == Constants.servicefinishlevelDefault3){
          //如果点未完成，填入0
          this.set("trueDrugNum",0);
        }
        if(finish.get("remark") == Constants.servicefinishlevelDefault1){
          //如果点未完成，填入0
          this.set("trueDrugNum",this.get("serviceItem").get("useDrugNum"));
        }
      }
      if(finishList){
        finishList.forEach(function(item){
          if(item.get("id")==finishId){
            //如果与字典数据匹配，则设置选中
            item.set("exehasSelect",true);
          }else{
            item.set("exehasSelect",false);
          }
        });
      }
      this.set("finishList",finishList);
      // this.incrementProperty("serviceItemChangeFlag");
    },
    //操作执行情况标签
    tagResultChoice(finishId,finishName,finish){
      console.log("item obj:",finish);
      // this.get("serviceItem").set("serviceTagexe",finishName);
      // this.get("serviceItem").set("serviceFinishId",finishId);
      // this.get("serviceItem").set("servicefinishlevel",finish);
      let resultList = this.get("resultList");
      let remarkStr = "";
      let remarkNameStr = "";
      let exeTabRemark = "";
      let jsonObj = {};
      if(resultList){
        resultList.forEach(function(item){
          if(item.get("id")==finishId){
            //如果与字典数据匹配，则设置选中
            // this.toggleProperty("popContent");
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
      console.log("exeTabRemark after:",jsonObj);
      console.log("exeTabRemark after11:",JSON.stringify(jsonObj));
      this.set("resultList",resultList);
      // this.incrementProperty("serviceItemChangeFlag");
    },
    backMain(){
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('task-square');
    },
    //执行保存操作
    saveDetail(){
      this.get("feedBus").set("threadData",null);//重置feedbus数据
      var itemId = "taskDetailBut";
      var taskDetailModel = this.get("taskDetailModel");
      var toSpecservice = this.get("toSpecservice");
      this.incrementProperty("toSpecservice");
      var flag = this.get("flag");
      let taskFlag = this.get('taskFlag');
      console.log("scrollFlagDomId falg",flag);
      let _self = this;
      var trueDrugNum = this.get("trueDrugNum");
      taskDetailModel.set("trueDrugNum",trueDrugNum);
      $("." + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("." + itemId).removeClass("tapped");
        Ember.run.later(function(){
          if(taskDetailModel.get("medicineDesc")){
            taskDetailModel.validate().then(function() {
                if (taskDetailModel.get('errors.length') === 0) {
                  _self.get("serviceItem").set("trueDrugNum",trueDrugNum);
                  if(flag=="care"){
                    if(taskFlag == 'anytimed'){
                      let serviceItem = _self.get('serviceItem');
                      let finishList = _self.get('finishList');
                      let finishLevel = finishList.findBy('remark',Constants.servicefinishlevelDefault1);
                      serviceItem.set('finishLevel',finishLevel);
                      serviceItem.set('remark',_self.get('serviceItem.serviceDesc'));
                      serviceItem.set('exeTabRemark',_self.get('serviceItem.exeTabRemark'));
                      console.log('exeTabRemark in task detail :',serviceItem.get('exeTabRemark'));
                      _self.set('feedBus.serviceNurseFlag','finished');
                      App.lookup("controller:business.mainpage.service-nurse").finishService(serviceItem,function(){
                        _self.set("serviceItem.serviceDesc","");
                        App.lookup("controller:business").popTorMsg("随时任务--" + serviceItem.get("title") + ",已完成");
                          App.lookup("controller:business.mainpage").switchMainPage("service-care");
                      });
                    }else{
                      App.lookup("controller:business.mainpage.service-care").finishService(_self.get("serviceItem"),function(){
                        _self.set("serviceItem.serviceDesc","");
                        App.lookup("controller:business").popTorMsg("护理任务--" + _self.get("serviceItem").get("title") + ",已完成");
                          App.lookup("controller:business.mainpage").switchMainPage("service-care");
                      });
                    }


                  }else {
                    if(taskFlag == 'anytimed'){
                      let serviceItem = _self.get('serviceItem');
                      let finishList = _self.get('finishList');
                      let finishLevel = finishList.findBy('remark',Constants.servicefinishlevelDefault1);
                      serviceItem.set('finishLevel',finishLevel);
                      serviceItem.set('remark',_self.get('serviceItem.serviceDesc'));
                      serviceItem.set('exeTabRemark',_self.get('serviceItem.exeTabRemark'));
                      console.log('exeTabRemark in task detail :',serviceItem.get('exeTabRemark'));
                      _self.set('feedBus.serviceNurseFlag','finished');
                      App.lookup("controller:business.mainpage.service-nurse").finishService(serviceItem,function(){
                        _self.set("serviceItem.serviceDesc","");
                        App.lookup("controller:business").popTorMsg("随时任务--" + serviceItem.get("title") + ",已完成");
                          App.lookup("controller:business.mainpage").switchMainPage("service-care");
                      });
                    }else{
                    App.lookup("controller:business.mainpage.service-nurse").finishService(_self.get("serviceItem"),function(){
                      _self.set("serviceItem.serviceDesc","");
                      App.lookup("controller:business").popTorMsg("护理任务--" + _self.get("serviceItem").get("title") + ",已完成");
                        App.lookup("controller:business.mainpage").switchMainPage("service-nurse");
                    });
                  }
                  }

                } else {
                    taskDetailModel.set("validFlag", Math.random());
                }
            });
          }else {
            if(flag=="care"){
              if(taskFlag == 'anytimed'){
                let serviceItem = _self.get('serviceItem');
                let finishList = _self.get('finishList');
                let finishLevel = finishList.findBy('remark',Constants.servicefinishlevelDefault1);
                serviceItem.set('finishLevel',finishLevel);
                serviceItem.set('remark',_self.get('serviceItem.serviceDesc'));
                serviceItem.set('exeTabRemark',_self.get('serviceItem.exeTabRemark'));
                console.log('exeTabRemark in task detail :',serviceItem.get('exeTabRemark'));
                _self.set('feedBus.serviceNurseFlag','finished');
                App.lookup("controller:business.mainpage.service-care").finishService(serviceItem,function(){
                  _self.set("serviceItem.serviceDesc","");
                  App.lookup("controller:business").popTorMsg("随时任务--" + _self.get("serviceItem").get("title") + ",已完成");
                    App.lookup("controller:business.mainpage").switchMainPage("service-care");
                });
              }else{
                App.lookup("controller:business.mainpage.service-care").finishService(_self.get("serviceItem"),function(){
                  _self.set("serviceItem.serviceDesc","");
                  App.lookup("controller:business").popTorMsg("护理任务--" + _self.get("serviceItem").get("title") + ",已完成");
                    App.lookup("controller:business.mainpage").switchMainPage("service-care",{toSpecservice:toSpecservice});
                });
              }

            }else {
              if(taskFlag == 'anytimed'){
                let serviceItem = _self.get('serviceItem');
                let finishList = _self.get('finishList');
                let finishLevel = finishList.findBy('remark',Constants.servicefinishlevelDefault1);
                serviceItem.set('finishLevel',finishLevel);
                serviceItem.set('remark',_self.get('serviceItem.serviceDesc'));
                serviceItem.set('exeTabRemark',_self.get('serviceItem.exeTabRemark'));
                console.log('exeTabRemark in task detail :',serviceItem.get('exeTabRemark'));
                _self.set('feedBus.serviceNurseFlag','finished');
                App.lookup("controller:business.mainpage.service-nurse").finishService(serviceItem,function(){
                  _self.set("serviceItem.serviceDesc","");
                  App.lookup("controller:business").popTorMsg("随时任务--" + _self.get("serviceItem").get("title") + ",已完成");
                    App.lookup("controller:business.mainpage").switchMainPage("service-nurse");
                });
              }else{
                App.lookup("controller:business.mainpage.service-nurse").finishService(_self.get("serviceItem"),function(){
                  _self.set("serviceItem.serviceDesc","");
                  App.lookup("controller:business").popTorMsg("护理任务--" + _self.get("serviceItem").get("title") + ",已完成");

                    App.lookup("controller:business.mainpage").switchMainPage("service-nurse",{toSpecservice:toSpecservice});
                });
              }

            }
          }

        },100);
      },200);
      // let remark = [];
      // if(this.get("serviceItem.applyContent")&&this.get("serviceItem.applyContent").length>0){
      //   remark = JSON.parse(this.get("serviceItem.applyContent"));
      //   remark = [].slice.call(remark);
      // }
      // //把详情信息附加到之前的信息中
      // let user = this.get("global_curStatus").getUserReal();
      // let detailItem = {actualDrugNum:trueDrugNum,applyUserId:user.get("id")};
      // remark.push(detailItem);
      // this.get("serviceItem").set("applyContent",JSON.stringify(remark));
    },
    //修改保存图片操作
    uploadSucc: function(response) {
      let drugId = this.get("serviceItem.drugId");
      console.log("drugId in con",drugId);
      var res = JSON.parse(response);
      var picPath = res.relativePath;
      let _self = this;
      console.log("picPath", picPath);
      _self.store.findRecord("drug",drugId).then(function(curDrug){
        curDrug.set("headImg",picPath);
        curDrug.save().then(function(){
          _self.set('showBigImageModal',false);
          App.lookup("controller:business").popTorMsg("药品图片上传成功！");
        });
      });
    },

  }
});
