import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';
import InfiniteScroll from '../../../controllers/infinite-scroll';
const {useDrugResult1} = Constants;

export default BaseUiItem.extend({
  store: Ember.inject.service("store"),
  feedService: Ember.inject.service('feed-bus'),
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  feedBus: Ember.inject.service("feed-bus"),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  global_curStatus: Ember.inject.service("current-status"),
  constants: Constants,

  serviceListFlag: 0,
  timeedTaskFlag: 0,
  antTimeedTaskFlag: 0,
  countListFlag: 0,
  queryFlag: 0,
  scollFlag: 0,//刷新后使组件包裹滚动条
  selectStartTimeFlag: 0,
  i: 0,
  k: 0,
  suishiDataBuildFlag:0,
  infiniteContentPropertyName: Ember.computed("infinitePropertyName",function(){
    return this.get("infinitePropertyName");
  }),
  infiniteModelName: "specservice",
  infiniteContainerName: Ember.computed("infiniteName",function(){
    return this.get("infiniteName");
  }),
  screenOffset:160,
  panmoveMode: "showFunc",//划动处理，showFunc：显示按钮 delete：删除本条
  curExpService: null,//当前展开的服务内容
  tabFuncs:Ember.computed("taskList",function() {
    var a = new Ember.A();
    var t1 = Ember.Object.create({
      code:"todayTask",
      text:"定时任务",
      numberTip:0
    });
    var t2 = Ember.Object.create({
      code:"finished",
      text:"随时任务",
      numberTip:0
    });
    a.pushObject(t1);
    a.pushObject(t2);
    return a;
  }),
  dataType:"task",
  oriCountItemId: null,

  init: function(){
    this._super(...arguments);
    // this.set("showLoadingImgIn",true);
    var _self = this;
    Ember.run.schedule("afterRender",this,function() {
      //设置默认显示tab页
      console.log("menuitem in tab init");
      _self.set("clickActFlag",_self.get("curTabCode"));
    });
  },
  didInsertElementObs:function(){
    this.send("didInsertElement");
  }.observes("directInitScollFlag"),
  //阻止5秒内重复提交
  preventRepeatSubmitFlagObs:function(){
    var preventRepeatSubmitFlag = this.get("global_curStatus.preventRepeatSubmitFlag");
    console.log("queryObs run preventRepeatSubmitFlag",preventRepeatSubmitFlag);
    if(!preventRepeatSubmitFlag){
      return;
    }
    App.lookup('controller:business.mainpage').closeMobileShade("保存成功");
  }.observes("global_curStatus.preventRepeatSubmitFlag"),
  //下拉刷新
  queryFlagIn: function(){
    //重新查找数据
    this.sendAction("refreshModel");
    console.log("in itqueryFlagIn");
  },
  dingshiDataDoneObs: function(){
    var _self = this;
    let dingshiItemArray = new Ember.A();
    console.log("run in dataDoneObs");
    let dingshiDataDoneFlag = this.get("dingshiDataDoneFlag");
    console.log("dingshiDataDoneFlag:",dingshiDataDoneFlag);
    if(!dingshiDataDoneFlag){return;}
    let itemList = this.get("dingshiItemList");
    let localObj = this.get("localObj");
    //每次加载完数据后回到顶部,在组件中体现
    // _self.set("isScrollToTop",true);
    _self.set("selectStartTime",localObj.queryStartDate);
    _self.set("selectEndTime",localObj.queryEndDate);
    _self.incrementProperty("selectStartTimeFlag");
    console.log("selectStartTimeFlag: in data:",this.get("selectStartTimeFlag"));
    // _self.send("queryTime",localObj.queryStartDate,localObj.queryEndDate);
    //如果没有数据
    if(!itemList.get("length")){
      this.set("serviceList",null);
      _self.incrementProperty("timeedTaskFlag");
      console.log("run in timeedTaskFlag");
      return;
    }
    console.log("specservice itemList",itemList);
    let index = 0;
    //循环组装数据
    itemList.forEach(function(item){
      console.log("item in foreach:",item);
      let serviceItem = _self.createServiceItem();
      if(item.get("project").content){
        serviceItem = _self.typeOneProject(serviceItem,item);
      }else if(item.get("item").content){
        serviceItem = _self.typeOneItem(serviceItem,item);
      }else{
        return;
      }
      dingshiItemArray.pushObject(serviceItem);
      index++;
      //组装完毕开始进行排序等业务
      if(index>=itemList.get("length")){
        _self.set("dingshiItemArray",dingshiItemArray);
        //设置数据加载完毕标志
        _self.incrementProperty("serviceListFlag");
      }
    });

  }.observes("dingshiDataDoneFlag").on("init"),
  suishiDataDoneObs: function(){
    var _self = this;
    let suishiItemArray = new Ember.A();
    console.log("run in dataDoneObs");
    let suishiDataDoneFlag = this.get("suishiDataDoneFlag");
    console.log("suishiDataDoneFlag:",suishiDataDoneFlag);
    if(!suishiDataDoneFlag){return;}
    let itemList = this.get("suishiItemList");
    //如果没有数据
    if(!itemList.get("length")){
      this.set("countList",null);
      _self.incrementProperty("antTimeedTaskFlag");
      console.log("run in antTimeedTaskFlag");
      return;
    }
    console.log("specservice itemList",itemList);
    let index = 0;
    //循环组装数据
    itemList.forEach(function(item){
      let serviceItem = _self.createServiceItem();
      if(item.get("projectItem").content){
        serviceItem = _self.typeTwo(serviceItem,item.get("projectItem"),item.get("itemExes"));
      }else{
        return;
      }
      suishiItemArray.pushObject(serviceItem);
      index++;
      //组装完毕开始进行排序等业务
      if(index>=itemList.get("length")){
        //设置数据加载完毕标志
        _self.set("suishiItemArray",suishiItemArray);
        _self.incrementProperty("suishiDataBuildFlag");
      }
    });

  }.observes("suishiDataDoneFlag").on("init"),
  //当数据都加载完毕，开始进行页面数据组织
  dataBuildObs: function(){
    var _self = this;
    console.log("in dataBuildObs");
    let curuser = this.get('global_curStatus').getUser();
    if(!this.get("suishiDataBuildFlag")){
      return;
    }
    let oriarray = this.get("suishiItemArray");
    console.log("oriarray sort,",oriarray);
    console.log("oriarray len:" + oriarray.get("length"));
    if(!oriarray){return;}
    let curCustomer = null;
    let customerList = new Ember.A();
    oriarray.forEach(function(serviceItem){
      console.log("finishRemark in foreach:",serviceItem.get("finishRemark"));
      //组装按照客户排列的数据,按层级组装
      let customerIdInloop = serviceItem.get("customerId");
      if(!curCustomer||curCustomer.get("id")!==customerIdInloop){
        curCustomer = Ember.Object.create({
          id:customerIdInloop,
          name:serviceItem.get("customerName"),
          room:serviceItem.get("customerBed"),
          stuffName:curuser.get("name"),
          services: new Ember.A(),
        });
        customerList.pushObject(curCustomer);
      }
      console.log("curCustomer push:" );
      curCustomer.get("services").pushObject(serviceItem);
    });
    console.log("customerList in first:",customerList);
    console.log("dataBuildObs run in antTimeedTaskFlag");
    this.set("suishiCountList",customerList);
    this.incrementProperty("countListFlag");
  }.observes("suishiDataBuildFlag").on("init"),

  //按时服务列表变化的监视器
  serviceListObs: function(){
    let _self = this;
    console.log("in serviceListObs serviceListFlag",this.get("serviceListFlag"));
    if(this.get("serviceListFlag")===0){
      return;
    }
    let serviceAllList = this.get("dingshiItemArray");
    let serviceItem = this.get("feedBus").get("serviceData");
    //将修改完的单数据插入总数据,是页面不进行刷新
    if(serviceItem){
      console.log("sort serviceItem:",serviceItem);
      serviceAllList.forEach(function(service){
        console.log("timeStrOne in forEach:",service.get("timeStrOne"));
        if(serviceItem.get("itemId")===service.get("itemId")){
          service.set("hasApply",serviceItem.get("hasApply"));
          service.set("finishTime",serviceItem.get("finishTime"));
          service.set("finishRemark",serviceItem.get("finishRemark"));
          service.set("finishLevelName",serviceItem.get("finishLevelName"));
          service.set("finishLevel",serviceItem.get("finishLevel"));
          service.set("exeTabRemark",serviceItem.get("exeTabRemark"));
          service.set("trueDrugNum",serviceItem.get("trueDrugNum"));
          service.set("personName",serviceItem.get("personName"));
          _self.get("feedBus").set("serviceData",null);//重置feedbus数据
        }
      });
    }
    //计时服务按服务排序
    console.log("sort serviceList:",serviceAllList);
    let serviceAllListSort = serviceAllList.sortBy("hasApply","timeStrOne");
    console.log("sort serviceAllListSort1111:",serviceAllListSort);
    let flagBar = new Ember.A();
    console.log("sort serviceAllListSort:",serviceAllListSort);
    this.set("serviceList",serviceAllListSort);
    console.log("sort serviceList after:",this.get("serviceList"));
  }.observes("serviceListFlag","directInitScollFlag").on("init"),
  //计次服务列表变化的监视器
  countListObs: function(){
    var _self = this;
    if(this.get("countListFlag")===0){
      return;
    }
    var falgOfprojectPlanCustomerId = this.get("falgOfprojectPlanCustomerId");//不定时任务 save标识  save了就不让第一个 "expanded"为true
    var falgOfprojectPlanBusiId = this.get("falgOfprojectPlanBusiId");//不定时任务 save标识  save了就不让第一个 "expanded"为true
    var customerList = this.get("suishiCountList");
    console.log("customerList in obs:",customerList);
    console.log("falgOfprojectPlanCustomerId111",falgOfprojectPlanCustomerId);
    if(!falgOfprojectPlanCustomerId){//true 就不用第一个"expanded"为true了
      customerList.forEach(function(item,index){
        if(index===0){
          item.set("expanded",true);
          _self.set("curExpService",item);//当前tab页
        }else {
          item.set("expanded",false);
        }
      });
    }else {
      //当点击完展开后,进行相应处理
      customerList.forEach(function(item,index){
        if(item.get("id")===falgOfprojectPlanCustomerId){
          item.set("expanded",true);
          _self.set("curExpService",item);//当前tab页
          item.services.forEach(function(service,index){
            if(service.get("busiId")===falgOfprojectPlanBusiId){
              let exeLength = service.get("itemExeLength") + 1;
              service.set("itemExeLength",exeLength);
              _self.set("falgOfprojectPlanCustomerId",null);//使用完以后清零
              _self.set("falgOfprojectPlanBusiId",null);//使用完以后清零
            }
          });
        }
      });
    }
    //计次服务
    this.set("countList",customerList);
    console.log("countList in end:",customerList);
    console.log("customerList len:",customerList.get("length"));
    console.log("LoadingImgInss555");
  }.observes("countListFlag").on("init"),

  //保存方法
  finishService: function(serviceItem,callback){
    let _self = this;
    var user = this.get("global_curStatus").getUser();
    console.log("employee11111111 user",user);
    console.log("employee11111111",user.get("employee"));
    let exeRecord = this.get('store').createRecord("nursingplanexe",{
      exeStaff:user.get("employee"),
    });
    let drugprojectExe = this.get('store').createRecord("customerdrugprojectexe",{
      lastUpdateUser:user,
    });
    //存储按时或计次的服务情况
    if(serviceItem.get("type")===1){
        App.lookup('controller:business.mainpage').showMobileShade("正在处理,请稍候..");
        //保存用药计划的任务
        if(serviceItem.get("medicineDesc")){
          let planItem = serviceItem.get("planItem");
          drugprojectExe.set("customerDrug",planItem.get("customerDrug"));
          drugprojectExe.set("drugProject",planItem);
          console.log("trueDrugNum111",serviceItem.get("trueDrugNum"));
          // let serviceTag ;
          if(serviceItem.get("trueDrugNum") >= 0){//如果有的话证明点进 detail里操作的
            drugprojectExe.set("drugNum",serviceItem.get("trueDrugNum"));//实际用药量
            drugprojectExe.set("drugNumPlan",serviceItem.get("useDrugNum"));//实际用药量 else  直接把计划里的数量填入
          }else {
            drugprojectExe.set("drugNum",serviceItem.get("useDrugNum"));//实际用药量 else  直接把计划里的数量填入
            drugprojectExe.set("drugNumPlan",serviceItem.get("useDrugNum"));//实际用药量 else  直接把计划里的数量填入
          }
          var useDrugFreqObj = _self.get("dataLoader").findDict(serviceItem.get("drugTypecode"));//用药规格
          let serviceDesc = serviceItem.get("serviceDesc");
          if(serviceDesc){
            drugprojectExe.set("remark",serviceDesc);
          }
          console.log("finishLevel in drugprojectExe save:",serviceItem.get("servicefinishlevel"));
          if(serviceItem.get("servicefinishlevel")){
            drugprojectExe.set("finishLevel",serviceItem.get("servicefinishlevel"));//标签对象
          }else{
            var servicefinishlevelDrug = _self.get("dataLoader.serviceFinishDefaultList").findBy("remark",Constants.servicefinishlevelDefault1);
            drugprojectExe.set("finishLevel",servicefinishlevelDrug);//标签对象
          }
          drugprojectExe.set("drugSpec",useDrugFreqObj);//用药规格
          drugprojectExe.set("useDrugDate",serviceItem.get("timeStrDate"));// 计划用药时间用于和 exe表比较
          drugprojectExe.save().then(function(drugprojectExeRecord){
            // App.lookup('controller:business.mainpage').closeMobileShade("保存成功");
            let exeDate = drugprojectExeRecord.get("exeDate");
            let finishTime = _self.get("dateService").formatDate(exeDate,"hh:mm");
            //设置已执行的标志用于页面处理
            serviceItem.set("finishRemark","");
            serviceItem.set("hasApply",true);
            serviceItem.set("finishTime",finishTime);
            serviceItem.set("finishLevelName",drugprojectExe.get("finishLevel.name"));
            serviceItem.set("finishLevel",drugprojectExe.get("finishLevel"));
            serviceItem.set("trueDrugNum",drugprojectExe.get("drugNum"));//实际用药量
            console.log("personName in finishService:",user.get("employee.name"));
            serviceItem.set("personName",user.get("employee.name"));//服务人名
            _self.incrementProperty("serviceListFlag");
            if(callback){
              callback();
            }
          },function(err){
            let error = err.errors[0];
            if(error.code==="14"){
              App.lookup("controller:business").popTorMsg("保存失败,药品已经不够此次使用");
              App.lookup('controller:business.mainpage').closeMobileShade("保存失败");
            }
            if(error.code==="15"){
              App.lookup("controller:business").popTorMsg("保存失败,此服务已被完成");
              App.lookup('controller:business.mainpage').closeMobileShade("保存失败");
            }
          });
          return ;
        }
        console.log("serviceItem",serviceItem);
        console.log("serviceItem detail111",serviceItem.get("item"));
        console.log("serviceItem detail222",serviceItem.get("item.item"));
        console.log("serviceItem detail333",serviceItem.get("item.item.item"));
        let detail = serviceItem.get("detail");
        // exeRecord.set("plan",planItem.get("plan"));
        exeRecord.set("detail",detail);
        exeRecord.set("itemProject",detail.get("item"));
        exeRecord.set("planExeDate",serviceItem.get("startTimeTab"));//计划开始时间
        console.log("detailGet item",detail.get("item"));
        //备注信息
        let serviceDesc = serviceItem.get("serviceDesc");
        if(serviceDesc){
          exeRecord.set("remark",serviceDesc);
        }
        if(serviceItem.get("exeTabRemark")){
          exeRecord.set("exeTabRemark",serviceItem.get("exeTabRemark"));//标签对象
        }else{
          exeRecord.set("exeTabRemark",null);//标签对象
        }
        console.log("finishLevel in exeRecord save:",serviceItem.get("servicefinishlevel"));
        if(serviceItem.get("servicefinishlevel")){
          exeRecord.set("finishLevel",serviceItem.get("servicefinishlevel"));//标签对象
        }else{
          var servicefinishlevel = _self.get("dataLoader.serviceFinishDefaultList").findBy("remark",Constants.servicefinishlevelDefault1);
          console.log("servicefinishlevel in exeRecord save:",servicefinishlevel);
          exeRecord.set("finishLevel",servicefinishlevel);//标签对象
        }
        exeRecord.save().then(function(nursingplanexeRecord){
          // App.lookup('controller:business.mainpage').closeMobileShade("保存成功");
          let createDateTime = nursingplanexeRecord.get("createDateTime");
          let finishTime = _self.get("dateService").formatDate(createDateTime,"hh:mm");
          console.log("queryFlag run in type1");
          serviceItem.set("finishRemark","");
          serviceItem.set("hasApply",true);
          serviceItem.set("finishTime",finishTime);
          serviceItem.set("finishLevelName",exeRecord.get("finishLevel.name"));
          serviceItem.set("finishLevel",exeRecord.get("finishLevel"));
          serviceItem.set("exeTabRemark",exeRecord.get("exeTabRemark"));
          serviceItem.set("personName",user.get("employee.name"));//服务人名
          _self.incrementProperty("serviceListFlag");
          if(callback){
            callback();
          }
        },function(err){
          let error = err.errors[0];
          if(error.code==="14"){
            App.lookup("controller:business").popTorMsg("保存失败,此服务已被完成");
            App.lookup('controller:business.mainpage').closeMobileShade("保存失败");
          }
          if(error.code==="15"){
            App.lookup("controller:business").popTorMsg("保存失败,请刷新页面后再尝试");
            App.lookup('controller:business.mainpage').closeMobileShade("保存失败");
          }
        });

    }else{//不定时任务  计次服务
      console.log("itemProject111  type 应该是 2",serviceItem.get("type"));
      var servicefinishlevelExe = _self.get("dataLoader.serviceFinishDefaultList").findBy("remark",Constants.servicefinishlevelDefault1);
      exeRecord.set("finishLevel",servicefinishlevelExe);//标签对象
      exeRecord.set("itemProject",serviceItem.get("item"));
      exeRecord.set('exeTabRemark',serviceItem.get('exeTabRemark'));
      console.log('exeTabRemark in queryspecservice :',serviceItem.get('exeTabRemark'));
      exeRecord.save().then(function(exe){
        console.log("exe in save:",exe);
        // let countList = _self.get("countList");
        // console.log("countList in save:",countList);
        // countList.forEach(function(countItem){
        //   if(countItem.get("id") == serviceItem.get("customerId")){
        //     console.log("countItem in save:",countItem);
        //     countItem.get("services").forEach(function(service){
        //       if(service.get("busiId") == serviceItem.get("busiId")){
        //         console.log("service in save:",service);
        //         service.get("itemExes").pushObject(exe);
        //       }
        //     });
        //   }
        // });
        // console.log("countList in save:",countList);
        // _self.set("countList",countList);
          _self.set("falgOfprojectPlanCustomerId",serviceItem.get("customerId"));//不定时任务完成 刷新标识 customerId
          _self.set("falgOfprojectPlanBusiId",serviceItem.get("busiId"));//不定时任务完成 刷新标识 customerId
          _self.incrementProperty("countListFlag");
        if(callback){
          callback();
        }
      });

    }
  },

  //集合项 服务computed属性
  createServiceItem:function(){
    let serviceItem = Ember.Object.extend({
      //计划时间
      timeStr:Ember.computed("type","startTimeTab",function(){
        if(this.get("type")===2){
          return null;
        }
        let hour = parseInt(this.get("startTimeTab"));
        hour = hour + ":00";
        return hour;
      }),
      //排序用字段
      timeStrOne:Ember.computed("timeStr",function(){
        var timeStr = this.get("timeStr");
        var str1 = timeStr.split(":") ;
        return Number(str1[0]+"."+str1[1]);
      }),
      //计次的详情数据
      detailList:Ember.computed("type","applyContent",function(){
        if(this.get("type")===1){
          return;
        }
        let list = new Ember.A();
        let applyContent = this.get("applyContent");
        if(!applyContent||applyContent.length===0){
          return list;
        }
        let l = JSON.parse(applyContent);
        for(let i=0;i<l.length;i++){
          let o = Ember.Object.extend({
            index:i+1,
            indexStr:Ember.computed("index",function(){
              return "第" + this.get("index") + "次:";
            }),
            content:l[i].content,
            showStr:Ember.computed("indexStr",function(){
              return this.get("indexStr") + this.get("content");
            }),
          });
          list.pushObject(o.create());
        }
        return list;
      }),
    });
    return serviceItem.create();
  },
  //集合项  typeOneProject 用药计划
  typeOneProject:function(serviceItem,item){
    let _self = this;
    console.log("project11111 content",item.get("project.project").content);
    console.log("project11111 useDrugDate",item.get("project.project.useDrugDate")+"  "+item.get("project.project.customerDrug.drug.name"));
    console.log("project11111 useDrugDate1",item.get("project.useDrugDate"));
    serviceItem.set("uniqId",item.get("project.project.customerDrug.customer.id")+'_'+item.get("project.project.useDrugDate")+'_drug'+item.get("project.project.customerDrug.id"));
    //设置类型标志
    serviceItem.set("type",1);
    serviceItem.set("hasApply",false);
    serviceItem.set("busiId",item.get("project.project.customerDrug.id"));
    serviceItem.set("itemId",item.get("id"));
    //设置关联数据对象
    // serviceItem.set("item",item);
    serviceItem.set("planItem",item.get("project.project"));
    //设置显示内容
    serviceItem.set("customerId",parseInt(item.get("project.project.customerDrug.customer.id")));
    serviceItem.set("drugId",parseInt(item.get("project.project.customerDrug.drug.id")));
    serviceItem.set("customerName",item.get("project.project.customerDrug.customer.name"));
    serviceItem.set("avatarUrl",item.get("project.project.customerDrug.customer.avatarUrl"));
    serviceItem.set("customerBed",item.get("project.project.customerDrug.customer.bed.name"));
    serviceItem.set("customerDrugId",item.get("project.project.customerDrug.id"));
    serviceItem.set("title","用药计划");
    serviceItem.set("medicineDesc",item.get("project.project.useDrugNum")+""+item.get("project.project.customerDrug.drug.drugSpec").get("typename")+"，"+item.get("project.project.useDrugWay"));
    serviceItem.set("medicineName",item.get("project.project.customerDrug.drug.name"));
    serviceItem.set("medicineAvatarUrl",item.get("project.project.customerDrug.drug.avatarUrl"));
    serviceItem.set("medicineHeadImg",item.get("project.project.customerDrug.drug.headImg"));
    serviceItem.set("allDrugNum",item.get("project.project.customerDrug.drugNum"));//剩余药品数量
    console.log("medicineUrl11111111111 project1",item.get("project"));
    console.log("medicineUrl11111111111 project2",item.get("project.project"));
    console.log("medicineUrl11111111111 customerDrug",item.get("project.project.customerDrug"));
    console.log("medicineUrl11111111111 customerDrug gatherStaff",item.get("project.project.customerDrug.gatherStaff"));
    console.log("medicineUrl11111111111 customerDrug drugNum",item.get("project.project.customerDrug.drugNum"));
    console.log("medicineUrl11111111111",item.get("project.project.customerDrug.drug.avatarUrl"));
    console.log("customerDrug11111111111",item.get("project.project.customerDrug.drug"));
    console.log("customerDrug11111111111 name",item.get("project.project.customerDrug.drug.name"));
    serviceItem.set("medicineNumSpec",item.get("project.project.useDrugNum")+""+item.get("project.project.useDrugSpec").get("typename"));
    serviceItem.set("useDrugNum",item.get("project.project.useDrugNum"));
    serviceItem.set("drugTypename",item.get("project.project.customerDrug.drug.drugSpec").get("typename"));//用药单位
    console.log("drugTypename in item id:",item.get("project.project").get("id"));//用药单位
    console.log("drugTypename in item:",item.get("project.project.useDrugSpec").get("typename"));//用药单位
    console.log("drugTypename in item after id:",item.get("project").get("id"));//用药单位
    console.log("drugTypename in item after:",item.get("project.useDrugSpec").get("typename"));//用药单位
    console.log("drugTypename in item after end:",item.get("project.project.customerDrug.drug.drugSpec").get("typename"));//用药单位
    serviceItem.set("drugTypecode",item.get("project.project.customerDrug.drug.drugSpec").get("typecode"));//用药规格
    serviceItem.set("medicineDrugWay",item.get("project.project.useDrugWay"));//用药方法
    serviceItem.set("medicineDrugFreq",item.get("project.project.useDrugFreq"));//用药频次
    serviceItem.set("remark",item.get("project.project.remark"));
    serviceItem.set("timeStr",item.get("project.useDrugDate")+":00");
    serviceItem.set("timeStrDate",item.get("project.useDrugDate"));
    //缺药业务的逻辑
    let useDrugNum = item.get("project.project.useDrugNum");
    let medicineDrugFreq = item.get("project.project.useDrugFreq");
    let allDrugNum = item.get("project.project.customerDrug.drugNum");
    console.log("allDrugNum::",allDrugNum);
    if(allDrugNum == "0"){
      serviceItem.set("littleDrugDetail","0");
    }else{
      let setDrugDaysRemind = this.get("dataLoader").findConf(Constants.setDrugDaysRemind);
      console.log("setDrugDaysRemind in speservice:",setDrugDaysRemind);
      let drugRemainDays = Math.floor(allDrugNum/(useDrugNum*medicineDrugFreq));
      console.log("drugRemainDays::",drugRemainDays);
      if(drugRemainDays <= setDrugDaysRemind){
        serviceItem.set("littleDrugDetail",drugRemainDays);
      }
    }

    let remark = item.get("remark");
    if (remark) {
      if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
        var itemData = JSON.parse(remark);
        if(itemData.serviceDesc){
          serviceItem.set("serviceDesc",itemData.serviceDesc);
        }
      }else{
        serviceItem.set("serviceDesc",remark);
      }
    }

    if(item.get("drugExe").content){
      console.log("drugExe in typeOneProject:",item.get("drugExe"));
      console.log("drugExe in typeOneProject lastUpdateUser:",item.get("drugExe").get("lastUpdateUser"));
      console.log("drugExe in typeOneProject lastUpdateUser name:",item.get("drugExe").get("lastUpdateUser").get("name"));
      var drugExeDrugNumber = item.get("drugExe.drugNum");
      serviceItem.set("hasApply",true);
      var finishTime = this.get("dateService").formatDate(item.get("drugExe.exeDate"),"hh:mm");
      serviceItem.set("finishTime",finishTime);
      console.log("finishRemark in typeOneProject:",item.get("drugExe.remark"));
      serviceItem.set("finishRemark",item.get("drugExe.remark"));
      serviceItem.set("finishLevelName",item.get("drugExe.finishLevel.name"));
      serviceItem.set("finishLevel",item.get("drugExe.finishLevel"));
      console.log("personName in typeOneProject:",item.get("drugExe.lastUpdateUser.name"));
      serviceItem.set("personName",item.get("drugExe.lastUpdateUser.name"));//服务人名
      serviceItem.set("drugExe",item.get("drugExe"));
      serviceItem.set("trueDrugNum",drugExeDrugNumber);
      serviceItem.set("drugExeDrugNumber",drugExeDrugNumber);
      serviceItem.set("applyContent",item.get("drugExe.remark"));
    }
    return serviceItem;
  },
  //集合项  typeOneItem 定时任务
  typeOneItem:function(serviceItem,item){
    serviceItem.set("projectitemId",item.get("item.item.id"));
    serviceItem.set("date",item.get("date"));
    serviceItem.set("uniqId",item.get("item.customer.id")+'_'+item.get("item.startTimeTab")+'_'+item.get("item.item.item.name"));
    console.log("1111111111111111111"+serviceItem.get("uniqId"));
    serviceItem.set("type",1);
    serviceItem.set("hasApply",false);
    serviceItem.set("busiId",item.get("item.id"));
    serviceItem.set("itemId",item.get("id"));
    //设置关联数据对象
    // serviceItem.set("item",item);
    serviceItem.set("detail",item.get("item"));
    console.log("the id:"+item.get("id")+" &detailID:"+item.get("item.id")+ " &projectitemid:"+item.get("item.item.id") +' andtime:'+item.get("item.startTimeTab")+' andcustomerID:'+item.get("item.customer.id")+' and title:'+item.get("item.item.item.name"));
    //设置显示内容
    serviceItem.set("customerId",parseInt(item.get("item.customer.id")));
    serviceItem.set("customerName",item.get("item.customer.name"));
    serviceItem.set("avatarUrl",item.get("item.customer.avatarUrl"));
    serviceItem.set("customerBed",item.get("item.customer.bed.name"));
    serviceItem.set("title",item.get("item.item.item.name"));
    serviceItem.set("desc",item.get("item.item.item.remark"));
    serviceItem.set("remark",item.get("item.remark"));
    serviceItem.set("weekTab",item.get("item.weekTab"));
    serviceItem.set("startTimeTab",item.get("item.startTimeTab"));
    // serviceItem.set("timeStrDate",item.get("item.startTimeTab"));
    console.log("customerserviceitem dingshi",item.get("item.item.item"));
    serviceItem.set("customerserviceitem",item.get("item.item.item"));//护理项目

    let remark = item.get("remark");
    if (remark) {
      if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
        let itemData = JSON.parse(remark);
        if(itemData.serviceDesc){
          serviceItem.set("serviceDesc",itemData.serviceDesc);
        }
      }else{
        serviceItem.set("serviceDesc",remark);
      }
    }
    console.log("item in typeOneItem",item);
    console.log("item in typeOneItem itemExes",item.get("itemExes"));
    console.log("item in typeOneItem arr",item.get("itemExes").get("length"));
    if(item.get("itemExes").get("length")){
      console.log("item.get itemExes arr",item.get("itemExes"));
      console.log("item.getitemExes.id",item.get("itemExes").get("firstObject").get("id"));
      console.log("item.get itemExes",item.get("itemExes").get("firstObject"));
      console.log(" in it item.getitemExes.id",item.get("itemExes").get("firstObject").get("id"));
      var itemExe = item.get("itemExes").get("firstObject");
      serviceItem.set("hasApply",true);
      var finishTime = this.get("dateService").formatDate(itemExe.get("createDateTime"),"hh:mm");
      serviceItem.set("finishTime",finishTime);
      console.log("finishRemark in typeOneItem:",itemExe.get("remark"));
      serviceItem.set("finishRemark",itemExe.get("remark"));
      serviceItem.set("finishLevelName",itemExe.get("finishLevel.name"));
      serviceItem.set("finishLevel",itemExe.get("finishLevel"));
      serviceItem.set("exeTabRemark",itemExe.get("exeTabRemark"));
      console.log("personName in typeOneItem:",itemExe.get("exeStaff.name"));
      serviceItem.set("personName",itemExe.get("exeStaff.name"));//服务人名
      console.log("1111itemExe.getexeStaffName",itemExe.get("exeStaff.name"),itemExe.get("exeStaff"));
      serviceItem.set("itemExe",itemExe);
      serviceItem.set("applyContent",itemExe.get("remark"));//这一句很重要把 exe的remark set过去
    }
    return serviceItem;
  },
  //集合项  typeTwo 不定时任务
  typeTwo:function(serviceItem,item,itemExes){
    serviceItem.set("type",2);
    console.log("itemExes in typeTwo:",itemExes);
    console.log("itemProject itemExes id1111111",item.get("id"),itemExes.get("length"));//计次任务的ID
    serviceItem.set("busiId",item.get("id"));
    //设置关联数据对象
    serviceItem.set("item",item);
    //设置显示内容
    console.log("nursingprojectitem in typeTwo:",item);
    console.log("nursingproject in typeTwo:",item.get("project"));
    console.log("customer in typeTwo:",item.get("project.customer"));
    serviceItem.set("customerId",parseInt(item.get("project.customer.id")));
    serviceItem.set("customerName",item.get("project.customer.name"));
    serviceItem.set("avatarUrl",item.get("project.customer.avatarUrl"));
    serviceItem.set("customerBed",item.get("project.customer.bed.name"));
    serviceItem.set("title",item.get("item.name"));
    serviceItem.set("desc",item.get("item.remark"));
    serviceItem.set("remark",item.get("remark"));
    serviceItem.set("customerserviceitem",item.get("item"));//护理项目
      serviceItem.set("itemExes",itemExes);
      serviceItem.set("itemExeLength",itemExes.get("length"));
    return serviceItem;
  },

  actions:{
    //执行保存方法
    finishSave(item,callback){
      console.log("init queryEndDateasdadasdas");
      this.finishService(item,callback);
    },
    //tab页的切换
    switchTab(code){
      let _self = this;
      let hasOpensuishi = this.get("hasOpensuishi");
      let hasOpendingshi = this.get("hasOpendingshi");
      console.log('switchTab in,code:' + code);
      this.set("curTabCode",code);
      if(code=="finished"){
        console.log("LoadingImgInss666");
        console.log("hasOpensuishi in finished:" + hasOpensuishi);
        if(!hasOpensuishi){
          console.log("run in hasOpensuishi");
          _self.send("queryFlagInAction");
          _self.set("hasOpensuishi",true);
        }
      }else {
        console.log("LoadingImgInss777");
        console.log("hasOpensuishi in today:" + hasOpensuishi);
        if(!hasOpendingshi){
          console.log("run in hasOpendingshi zhi:",this.get("hasOpendingshi"));
          console.log("run in hasOpendingshi");
          _self.send("queryFlagInAction");
          _self.set("hasOpendingshi",true);
        }
        var list = this.get("serviceList");
        if(!list){
          console.log("LoadingImgInss888");
        }
      }
      console.log("run scollFlag in switchTab");
      //用于只刷新jroll,不重新包裹.可以保证滚动条的位置不变
      _self.incrementProperty("scollFlag");
      // this.directInitScoll();
    },
    goCountDetail(){
      var serviceItem = this.get("serviceItem");
      console.log("serviceItem in goDetail:",serviceItem);
      this.get("feedBus").set("threadData",serviceItem);
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('task-count-detail');
    },
    panMoveProcAction(item){
      console.log('panMoveProcAction in,item:' , item);
      /*删除模式*/
      if(this.get("panmoveMode")==="delete"||true){
        this.finishService(item,function(){
          App.lookup("controller:business").popTorMsg("护理任务--" + item.get("title") + ",已完成");
        });
      }
      /*功能按钮显示模式*/
      if(this.get("panmoveMode")==="showFunc"){

      }
    },
    itemCntAdd(serviceItem,theitemId){
      //通过全局服务进行上下文传值
      this.get("feedBus").set("threadData",serviceItem);
      // App.lookup("controller:business.mainpage").switchMainPage("service-counter-apply",{service_id:serviceItem.get("id")});
      var itemId = "AddImplement_message"+theitemId;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage("service-counter-apply",{service_id:serviceItem.get("id")});
        },100);
      },200);

    },
    countItemExpand(selecedServiceId){//暂放没有的function
      var _self = this;
      var findService = function(sid){
        var csData = _self.get("countList");
        var curItem = null;
        csData.forEach(function(customerData){
          customerData.get("services").forEach(function(service){
            if(service.get("busiId")===sid){
              curItem = service;
            }
          });
        });
        return curItem;
      };
      var selecedService = findService(selecedServiceId);
      //如果已经展开，则只收起
      if(selecedService.get("expanded")){
        selecedService.set("expanded",false);
        return;
      }
      //否则展开本级，收起其他级
      selecedService.set("expanded",true);
      var curExpService = this.get("curExpService");
      if(curExpService&&curExpService.get("busiId")!==selecedService.get("busiId")){
        curExpService.set("expanded",false);
      }
      this.set("curExpService",selecedService);
    },
    itemExpand(customerId){
      var _self = this;
      var findService = function(sid){
        var csData = _self.get("countList");
        var curItem = null;
        csData.forEach(function(item){
          if(item.get("id")==sid){
            curItem = item;
          }
        });
        return curItem;
      };
      var selecedService = findService(customerId);
      console.log("1111111W",selecedService);
      //如果已经展开，则只收起
      if(selecedService.get("expanded")){
        selecedService.set("expanded",false);
        return;
      }
      //否则展开本级，收起其他级
      selecedService.set("expanded",true);
      var curExpService = this.get("curExpService");
      if(curExpService&&curExpService.get("id")!==selecedService.get("id")){
        curExpService.set("expanded",false);
      }
      this.set("curExpService",selecedService);
    },
    //保存方法
    finish(serviceItem){
      this.finishService(serviceItem,function(){
        App.lookup("controller:business").popTorMsg("护理任务--" + serviceItem.get("title") + ",已完成");
      });
    },
    saveNursingLog(customerId,detailContent,callback){
      let nursingLog = this.get('store').createRecord("nursinglog");
      let customer = this.get('store').createRecord("customer");
      let user = this.get("global_curStatus").getUserReal();
      let employee = user.get("employee");
      let sysTime = this.get("dataLoader").getNowTime();
      customer.set("id",customerId);
      // nursingLog.set('nursingDate',sysTime);//护理日期
      nursingLog.set("nurscustomer",customer);
      nursingLog.set("createUser",user);
      nursingLog.set("remark",detailContent);
      nursingLog.set("delStatus",0);
      nursingLog.set("recordUser",employee);
      nursingLog.save().then(function(){
        callback();
      });
    },
    didInsertElement(){
      console.log("insert e in qs");
      this.incrementProperty("scollFlag");
    },
    //从组件中获取是否下拉刷新
    queryFlagInAction(){
      this.queryFlagIn();
    },
    refreshData(param1,param2){
      this.sendAction("refreshData",param1,param2);
    },


  },
});
