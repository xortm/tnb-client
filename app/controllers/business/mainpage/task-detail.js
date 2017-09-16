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
  constants:Constants,

  uploadUrl: Ember.computed(function() {return this.get("pathConfiger").get("uploadUrl");}),

  taskDetailModel: Ember.computed("serviceItem", function() {
      var model = this.get("serviceItem");
      console.log("model customerInfo", model);
      if (!model) {
          return null;
      }
      return new Changeset(model, lookupValidator(taskDetailValidations), taskDetailValidations);
  }),
  init:function(){
    Ember.run.schedule("afterRender",this,function() {
      $("a[name='processTab']").click(function(){
        console.log("tab click");
        $(this).toggleClass("hasSelect");
      });
    });
  },
  serviceItem:Ember.computed("itemId","itemIdFlag",function(){
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
    if(serviceItem.get("itemId")===this.get("itemId")){
      return serviceItem;
    }
  }),
  // serviceItemObs: function(){
  //   let serviceItem = this.get("feedBus").get("threadData");
  //   console.log("customerserviceitemThe computed:",serviceItem);
  //   if(serviceItem.get("itemId")===this.get("itemId")){
  //     this.set("serviceItem",serviceItem);
  //   }
  // }.observes("itemId","itemIdFlag"),
  //选中的标签数据
  tagItemsObs: function(){
    //查找出执行标签的字典列表，然后比较
    let items;
    let exePlanItems;
    let defaultResultList = this.get("dataLoader.serviceFinishDefaultList");
    if(!this.get("serviceItem")){return;}
    let _self = this;
    if(this.get("serviceItem").get("medicineDesc")){
      _self.set("drugId",this.get("serviceItem").get("drugId"));
      defaultResultList.forEach(function(item){
        item.set("exehasSelect",false);
      });
      console.log("defaultResultList in detail:",defaultResultList);
      _self.set('resultList',defaultResultList);
      // _self.store.query('servicefinishlevel',{filter:{remark:"default"}}).then(function(resultList){
      //   if(resultList.get('length')>0){
      //     resultList.forEach(function(item){
      //       item.set("exehasSelect",false);
      //     });
      //     _self.set('resultList',resultList);
      //   }
      // });
    }else {
      // items = this.get("dataLoader").findDictList("exeStatus");
      var customerserviceitem = this.get("serviceItem.customerserviceitem");
      console.log("customerserviceItemId   ", customerserviceitem.get("id"));
      this.store.query('servicefinishlevel',{filter:{item:{id:customerserviceitem.get("id")}}}).then(function(resultList){
        if(resultList.get('length')>0){
          resultList.forEach(function(item){
            item.set("exehasSelect",false);
          });
          console.log('resultList',resultList);
          _self.set('resultList',resultList);
        }else {
          defaultResultList.forEach(function(item){
            item.set("exehasSelect",false);
          });
          _self.set('resultList',defaultResultList);
        }
      });
    }

  }.observes("serviceItemChangeFlag","serviceItem"),

  actions:{
    invalid(){},
    switchShowAction(){
      this.directInitScoll(true);
      var serviceItem = this.get("serviceItem");
      console.log("serviceItem111",serviceItem);
      if(!serviceItem.hasApply){
        this.set("serviceItem.serviceDesc","");//从back按钮退出再进入，需清空备注信息
        this.set("serviceItem.serviceTag","");//从back按钮退出再进入，清空已选择配合不配合
        this.set("trueDrugNum","");//从back按钮退出再进入，需清空备注信息
      }
    },
    valueInfo(){
      var _self = this;
      // _self.set("drugNameModel",true);
    },
    valueOut(){
      var _self = this;
      // var trueDrugNum = this.get("trueDrugNum");
      // console.log("in valueInfo valueOut",trueDrugNum);
      // if(!trueDrugNum){
      //   Ember.run.later(function(){
      //     _self.set("drugNameModel",false);
      //   },200);
      // }
    },
    tagChoice(tagTypecode){
      //标签选中后与对象关联
      // let remark = this.get("serviceItem.remark");
      // let remarkObj = null;
      // if(!remark){
      //   remarkObj = {};
      // }else{
      //   remarkObj = JSON.parse(remark);
      // }
      // remarkObj.serviceTag = tagId;
      // console.log("serviceTag",tagId);
      // this.get("serviceItem").set("remark",JSON.stringify(remarkObj));
      this.get("serviceItem").set("serviceTag",tagTypecode);
      this.incrementProperty("serviceItemChangeFlag");
    },
    tagExeChoice(finishId,finishName,finish){
      console.log("item obj:",finish);
      this.get("serviceItem").set("serviceTagexe",finishName);
      this.get("serviceItem").set("serviceFinishId",finishId);
      this.get("serviceItem").set("servicefinishlevel",finish);
      let resultList = this.get("resultList");
      if(resultList){
        resultList.forEach(function(item){
          if(item.get("id")==finishId){
            //如果与字典数据匹配，则设置选中
            item.set("exehasSelect",true);
          }else{
            item.set("exehasSelect",false);
          }
        });
      }
      this.set("resultList",resultList);
      // this.incrementProperty("serviceItemChangeFlag");
    },
    backMain(){
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('task-square');
    },
    saveDetail(){
      this.get("feedBus").set("threadData",null);//重置feedbus数据
      var itemId = "taskDetailBut";
      var taskDetailModel = this.get("taskDetailModel");
      var toSpecservice = this.get("toSpecservice");
      this.incrementProperty("toSpecservice");
      var flag = this.get("flag");
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
                    App.lookup("controller:business.mainpage.service-care").finishService(_self.get("serviceItem"),function(){
                      _self.set("serviceItem.serviceDesc","");
                      App.lookup("controller:business").popTorMsg("护理任务--" + _self.get("serviceItem").get("title") + ",已执行");
                        App.lookup("controller:business.mainpage").switchMainPage("service-care");
                    });
                  }else {
                    App.lookup("controller:business.mainpage.service-nurse").finishService(_self.get("serviceItem"),function(){
                      _self.set("serviceItem.serviceDesc","");
                      App.lookup("controller:business").popTorMsg("护理任务--" + _self.get("serviceItem").get("title") + ",已执行");
                        App.lookup("controller:business.mainpage").switchMainPage("service-nurse");
                    });
                  }

                } else {
                    taskDetailModel.set("validFlag", Math.random());
                }
            });
          }else {
            if(flag=="care"){
              App.lookup("controller:business.mainpage.service-care").finishService(_self.get("serviceItem"),function(){
                _self.set("serviceItem.serviceDesc","");
                App.lookup("controller:business").popTorMsg("护理任务--" + _self.get("serviceItem").get("title") + ",已执行");
                  App.lookup("controller:business.mainpage").switchMainPage("service-care",{toSpecservice:toSpecservice});
              });
            }else {
              App.lookup("controller:business.mainpage.service-nurse").finishService(_self.get("serviceItem"),function(){
                _self.set("serviceItem.serviceDesc","");
                App.lookup("controller:business").popTorMsg("护理任务--" + _self.get("serviceItem").get("title") + ",已执行");

                  App.lookup("controller:business.mainpage").switchMainPage("service-nurse",{toSpecservice:toSpecservice});
              });
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
    uploadSucc: function(response) {
      let drugId = this.get("drugId");
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
