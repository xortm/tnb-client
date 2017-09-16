import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
const { taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail,useDrugResult1} = Constants;
//test branch release
export default Ember.Controller.extend(InfiniteScroll,{
  feedService: Ember.inject.service('feed-bus'),
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  feedBus: Ember.inject.service("feed-bus"),
  service_PageConstrut:Ember.inject.service("page-constructure"),

  serviceListFlag: 0,
  countListFlag: 0,
  serviceParamListFlag: 0,
  countParamListFlag: 0,
  // groupNocustomerFlag:0,//护理组没有老人flag++(给多次连续扫描同一老人用)
  queryFlag: 0,
  scrollFlag:false,
  btnFlag:false,
  i:0,//这个是判断 list是否在hbs加载完毕标示
  infiniteContentPropertyName: "serviceList",
  infiniteModelName: "specservice",
  infiniteContainerName:"taskSquareContainer",
  screenOffset:160,
  squareScanShow:true,
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
  switcherDef:Ember.computed(function() {
    var a = new Ember.A();
    var t1 = Ember.Object.create({
      code:"task",
      text:"时间排序",
      icon:"ic-time",
      selected: true
    });
    var t2 = Ember.Object.create({
      code:"user",
      text:"按人排序 ",
      icon:"ic-person",
      selected: false
    });
    a.pushObject(t1);
    a.pushObject(t2);
    return a;
  }),
  dataType:"task",
  oriCountItemId: null,

  init: function(){
    // this.get("service_PageConstrut").set("showLoader", false);//先关闭mainpage的
    this.set("showLoadingImg",true);
    var _self = this;
    Ember.run.schedule("afterRender",this,function() {
      //设置默认显示tab页
      console.log("menuitem in tab init");
      _self.set("clickActFlag","todayTask");
    });
  },
  // initObs:function(){
  //   if(!this.get("showLoadingImg")){
  //     this.set("clickActFlag","todayTask");
  //   }
  // }.observes("showLoadingImg"),
  exeObs:function(){
    var _self = this;
    //取得系统时间
    let sysTime = _self.get("dataLoader").getNowTime();
    let allBeds = _self.get("global_dataLoader.allBedList");
    console.log("drugExeItemArray111111111111sysTime allBeds",allBeds);
    if(!allBeds||!sysTime){
      return ;
    }
    var weekArray = ["周日","周一","周二","周三","周四","周五","周六"];
    let date = this.get("dateService").timestampToTime(sysTime);
    var weekTab = date.getDay();
    var monthDay = this.get("dateService").formatDate(sysTime,"MM/dd");
    console.log("drugExeItemArray111111111111",date);
    console.log("drugExeItemArray111111111111sysTime",sysTime);
    this.set("weekDay",weekArray[weekTab]);
    this.set("monthDay",monthDay);
    let firstSec = this.get("dateService").getFirstSecondStampOfDay(date);
    let lastSec = this.get("dateService").getLastSecondStampOfDay(date);
    let itemArray = new Ember.A();
    _self.set("exeItemArray",itemArray);
    //查询出执行情况,查当天的所有执行内容
    _self.store.query("nursingplanexe",{filter:{
      "exeStartTime@$gte":firstSec,
      // "exeEndTime@$lte":lastSec //这个是null
    }}).then(function(itemList){
      if(itemList.get("length")===0){
        _self.set("exeDataPushFlag",true);
        return;
      }
      let index = 0;
      itemList.forEach(function(item){
        index++;
        console.log("item.getdetail",item.get("detail.id"));
        if(item.get("detail.id")){
          item.set("busiId",item.get("detail.id"));
        }else {
          item.set("busiId",item.get("itemProject.id"));
        }
        _self.get("exeItemArray").pushObject(item);
        console.log("pushObject exeItem find:" , _self.get("exeItemArray"));
        if(index>=itemList.get("length")){
          //设置数据加载完毕标志
          _self.set("exeDataPushFlag",true);
        }
      });
    });
    let itemExeArray = new Ember.A();
    _self.set("drugExeItemArray",itemExeArray);
    //查询喂药执行情况
    _self.store.query("customerdrugprojectexe",{filter:{
      "lastUpdateDateTime@$gte":firstSec,//会获得负值 还不报错
      // "exeDate@$lte":lastSec
    }}).then(function(itemList){
      if(itemList.get("length")===0){
        _self.set("drugExePushFlag",true);
        return;
      }
      let index = 0;
      itemList.forEach(function(item){
        index++;
        //组装对应的业务标识
        item.set("useDrugDateNum",item.get("useDrugDate"));//计划用药时间
        item.set("customerDrugId",item.get("customerDrug.id"));
        _self.get("drugExeItemArray").pushObject(item);
        if(index>=itemList.get("length")){
          //设置数据加载完毕标志
          _self.set("drugExePushFlag",true);
        }
        console.log("exeItem find: exeItemArray queryFlag" , _self.get("drugExeItemArray"));
      });
    });
  }.observes("queryFlag","dataLoader.sysconfig.sysTime","global_dataLoader.allBedList","scanFlag").on('init'),

  queryFlagIn: function(){
    var customerIdParams = this.get("customerIdParams");
    if(customerIdParams){
      this.incrementProperty("scanFlag");
    }else {
      this.incrementProperty("queryFlag");
    }
    console.log("in itqueryFlagIn");
    this.set("exeDataPushFlag",false);//把定时任务exeflag set为false
    this.set("drugExePushFlag",false);//把用药计划exeflag set为false
    this.set("countListFlag",0);//计次
    this.set("serviceListFlag",0);//定时
    this.set("planDataPushFlag",false);
    this.set("projectDataPushFlag",false);
    // this.set("showLoadingImg",true);//打开加载图片
  },

  //查询标志的观察者
  queryObs: function(){
    let _self = this;
    console.log("query obs in,queryFlag:" + this.get("queryFlag"));
    //首先查询出当前护工对应的服务对象
    let curuser = this.get('global_curStatus').getUser();
    //通过设置action进行特殊查询
    this.get("global_ajaxCall").set("action","spec_planService");
    console.log("query specservice before");
    //查询出计时服务项目
    this.store.query("specservice",{filter:{uid:curuser.get("id")}}).then(function(itemList){
      let timeServiceItemArray = new Ember.A();
      console.log("specservice itemList",itemList);
      let index = 0;
      if(itemList.get("length")===0){
        _self.set("planDataPushFlag",true);
        _self.set("timeServiceItemArray",timeServiceItemArray);//如果是空也要set
        console.log("specservice in length0",_self.get("timeServiceItemArray"));
        return;
      }
      itemList.forEach(function(item){
        let serviceItem = _self.createServiceItem();
        if(item.get("project").content){
          serviceItem = _self.typeOneProject(serviceItem,item);
        }else {
          serviceItem = _self.typeOneItem(serviceItem,item);
        }
        // serviceItemArray.pushObject(serviceItem);
        timeServiceItemArray.pushObject(serviceItem);
        _self.set("timeServiceItemArray",timeServiceItemArray);
        index++;
        if(index>=itemList.get("length")){
          //设置数据加载完毕标志
          _self.set("planDataPushFlag",true);
        }
      });
    },
      function(){//then 方法500失败后走这个方法
        _self.set("showLoadingImg",false);
      }
    );
    this.get("global_ajaxCall").set("action","spec_countService");
    //查询出计次服务项目
    this.store.query("nursingprojectitem",{filter:{uid:curuser.get("id")}}).then(function(itemList){
      var projectItemArray = new Ember.A();
      console.log("nursingprojectitem get and not return");
      if(itemList.get("length")===0){
        _self.set("projectDataPushFlag",true);
        _self.set("projectItemArray",projectItemArray);//空也要set
        return;
      }
      let index = 0;
      itemList.forEach(function(item){
        // var item = items.get("item");
        console.log("items.get item",item);
        let serviceItem = _self.createServiceItem();
        serviceItem = _self.typeTwo(serviceItem,item);
        projectItemArray.pushObject(serviceItem);
        _self.set("projectItemArray",projectItemArray);

        console.log("nursingprojectitem get and serviceItemArray push");
        index++;
        if(index>=itemList.get("length")){
          //设置数据加载完毕标志
          _self.set("projectDataPushFlag",true);
        }
      });
    });
  }.observes("queryFlag").on("init"),
  //当3组数据都加载完毕，开始进行页面数据组织
  dataBuildObs: function(){
    var _self = this;
    let curuser = this.get('global_curStatus').getUser();
    if(!this.get("planDataPushFlag")||!this.get("projectDataPushFlag")||!this.get("exeDataPushFlag")||!this.get("drugExePushFlag")){
      return;
    }
    console.log("dataBuildObs in");
    let serviceList = new Ember.A();
    let customerList = new Ember.A();
    var projectItemArray = this.get("projectItemArray");
    var timeServiceItemArray = this.get("timeServiceItemArray");
    console.log("serviceItemArray timeServiceItemArray",timeServiceItemArray);
    console.log("serviceItemArray projectItemArray",projectItemArray);
    console.log("serviceItemArray projectItemArray:"+projectItemArray);
    if(!projectItemArray&&!timeServiceItemArray){//都是空 也要把都是空的ember数组反过去(为的是扫描后点击全部用)
      // this.set("showLoadingImg",false);
      this.set("serviceAllList",serviceList);
      this.set("customerList",customerList);
      this.incrementProperty("serviceListFlag");
      this.incrementProperty("countListFlag");
      return;
    }
    var serviceItemArray = new Ember.A();
    Array.prototype.myForEach = function myForEach(callBack, context) {
    typeof context === "undefined" ? context = window : null;
      if ("forEach" in Array.prototype) {
          this.forEach(callBack, context);
          return;
      }
      //->不兼容处理
      for (var i = 0; i < this.length; i++) {
          typeof callBack === "function" ? callBack.call(context, this[i], i, this) : null;
      }
    }
    if(projectItemArray){
      projectItemArray.myForEach(function(item){
        serviceItemArray.pushObject(item);
      });
      console.log("serviceItemArray serviceItemArray projectItemArrayIF",serviceItemArray);
    }

    if(timeServiceItemArray){
      timeServiceItemArray = timeServiceItemArray.uniqBy('uniqId');//数组去重,根据护理项目 每个人时间点的‘nursingprojectitem’都不一样
      timeServiceItemArray.myForEach(function(item){
        serviceItemArray.pushObject(item);
      });
      console.log("serviceItemArray serviceItemArray timeServiceItemArrayIF",serviceItemArray);
    }

    let oriarray = serviceItemArray;
    console.log("oriarray before,",oriarray);
    oriarray = oriarray.sortBy("customerId");
    console.log("oriarray sort,",oriarray);
    let exeItemArray = this.get("exeItemArray");
    let curCustomer = null;
    console.log("oriarray len:" + oriarray.get("length"));
    console.log("exeItemArray exeItem find: " , exeItemArray);
    var  finishTime;
    oriarray.forEach(function(serviceItem){
      //组装按照服务项目排列的数据
      if(serviceItem.get("medicineDesc")){
        console.log("drugExeItemArray",_self.get("drugExeItemArray"));
        var drugExe = _self.get("drugExeItemArray").filter(function(drugExe){
          return drugExe.get("useDrugDateNum")==serviceItem.get("timeStrDate")&&drugExe.get("customerDrugId")==serviceItem.get("customerDrugId");
        });
        console.log("drugExeItemArray drugExe",drugExe);
        if(drugExe.length){
          //标记已经执行过的
          var drugExeDrugNumber = drugExe.get("firstObject.drugNum");
          var drugExeFirst = drugExe.get("firstObject");
          serviceItem.set("hasApply",true);
          finishTime = _self.get("dateService").formatDate(drugExeFirst.get("exeDate"),"hh:mm");
          serviceItem.set("finishTime",finishTime);
          serviceItem.set("finishRemark",drugExeFirst.get("remarkString"));
          serviceItem.set("personName",drugExeFirst.get("lastUpdateUser.name"));//服务人名
          serviceItem.set("drugExe",drugExeFirst);
          serviceItem.set("drugExeDrugNumber",drugExeDrugNumber);
          serviceItem.set("applyContent",drugExeFirst.get("remark"));
          // curCustomer标记为执行过
          // curCustomer.set("hasApply",true);
        }
      }else {
        let exeItem = _self.get("exeItemArray").findBy("busiId",serviceItem.get("busiId"));
        console.log("exeItem find: uid" , exeItem);
        if(exeItem){
          //标记已经执行过的
          serviceItem.set("hasApply",true);
          finishTime = _self.get("dateService").formatDate(exeItem.get("createDateTime"),"hh:mm");
          serviceItem.set("finishTime",finishTime);
          serviceItem.set("finishRemark",exeItem.get("remarkString"));
          serviceItem.set("personName",exeItem.get("exeStaff.name"));//服务人名
          serviceItem.set("exeItem",exeItem);
          serviceItem.set("applyContent",exeItem.get("remark"));//这一句很重要把 exe的remark set过去
          // curCustomer标记为执行过
          // curCustomer.set("hasApply",true);
        }
      }

      if(serviceItem.get("type")===2){
        //组装按照客户排列的数据
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
        // if(exeItem){
        //   //标记已经执行过的
        //   curCustomer.set("hasApply",true);
        // }
        console.log("curCustomer push:" );
        curCustomer.get("services").pushObject(serviceItem);
      }else{
        console.log("serviceList push:" );
        serviceList.pushObject(serviceItem);
      }
    });
    console.log("serviceList after:" );
    this.set("serviceAllList",serviceList);
    this.set("customerList",customerList);
    this.incrementProperty("serviceListFlag");
    this.incrementProperty("countListFlag");
  }.observes("planDataPushFlag","projectDataPushFlag","exeDataPushFlag","drugExePushFlag").on("init"),

  //按时服务列表变化的监视器
  serviceListObs: function(){
    console.log("in serviceListObs serviceListFlag",this.get("serviceListFlag"));
    if(this.get("serviceListFlag")===0){
      return;
    }
    var customerIdParams = this.get("customerIdParams");
    var groupNocustomer = this.get("groupNocustomer");//护理组没有此老人
    var groupHascustomer = this.get("groupHascustomer");//护理组内有此老人
    if(customerIdParams){//如果 这个护理员或护士没有护理 扫描二维码出的customerId的老人也要出现此老人的定时.不定时.用药三种护理项目
      if(groupNocustomer){//如果护理组内没有此老人
        var serviceParamsList = this.get("serviceParamsList");
        console.log("serviceParamsList list",serviceParamsList);
        //计时服务按服务排序
        this.set("serviceList",serviceParamsList.sortBy("hasApply","timeStrOne"));
        //计时服务按客户排序
        this.set("serviceCustomerList",serviceParamsList.sortBy("hasApply","customerId","timeStrOne"));
      }else {
        var thecustomerServices = new Ember.A();
        this.get("serviceAllList").forEach(function(item){
          if(item.get('customerId')==customerIdParams){
            thecustomerServices.pushObject(item);
          }
        });
        //计时服务按服务排序
        this.set("serviceList",thecustomerServices.sortBy("hasApply","timeStrOne"));
        //计时服务按客户排序
        this.set("serviceCustomerList",thecustomerServices.sortBy("hasApply","customerId","timeStrOne"));
      }

    }else {
      //计时服务按服务排序
      console.log("sort serviceList:",this.get("serviceAllList"));
      this.set("serviceList",this.get("serviceAllList").sortBy("hasApply","timeStrOne"));
      console.log("sort serviceList after:",this.get("serviceList"));
      //计时服务按客户排序
      this.set("serviceCustomerList",this.get("serviceAllList").sortBy("hasApply","customerId","timeStrOne"));
      console.log("sort serviceCustomerList after:",this.get("serviceCustomerList"));
    }

    this.set("showLoadingImg",false);
    this.directInitScoll();
  }.observes("serviceListFlag").on("init"),
  //计次服务列表变化的监视器
  countListObs: function(){
    var _self = this;
    if(this.get("countListFlag")===0){
      return;
    }
    var customerIdParams = this.get("customerIdParams");
    var groupNocustomer = this.get("groupNocustomer");//护理组没有此老人
    var groupHascustomer = this.get("groupHascustomer");//护理组内有此老人
    if(customerIdParams){
      console.log("customerIdParams111 iftrue",customerIdParams);
      this.set("squareScanShow",false);
      if(groupNocustomer){
        var customerParamsList = this.get("customerParamsList");
        customerParamsList.forEach(function(item){
          item.set("expanded",true);
        });
        console.log("customerParamsList list",customerParamsList);
        this.set("countList",customerParamsList);
      }else {
        var thecustomerServices = new Ember.A();
        this.get("customerList").forEach(function(item){
          if(item.get('id')==customerIdParams){
            item.set("expanded",true);
            thecustomerServices.pushObject(item);
          }
        });
        console.log("customerIdParams list",thecustomerServices);
        this.set("countList",thecustomerServices);
      }
    }else {
      console.log("customerIdParams111 iffalse",customerIdParams);
      this.set("squareScanShow",true);
      var falgOfprojectPlanCustomerId = this.get("falgOfprojectPlanCustomerId");//不定时任务 save标识  save了就不让第一个 "expanded"为true
      var customerList = this.get("customerList");
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
        customerList.forEach(function(item,index){
          if(item.get("id")===falgOfprojectPlanCustomerId){
            item.set("expanded",true);
            _self.set("curExpService",item);//当前tab页
          }
        });
      }
      //计次服务
      this.set("countList",customerList);
    }
    this.set("showLoadingImg",false);
  }.observes("countListFlag").on("init"),

  //查询此老人Id 有没有在当前护工或护士 护理组内
  customerIdParamsObs: function(){
    var _self = this;
    var customerIdParams = this.get("customerIdParams");
    console.log("customerIdParams111 customerIdParamsObs",customerIdParams);
    if(!customerIdParams){return;}
    //每次进入前都set为false
    _self.set("groupNocustomer",false);_self.set("planParamsFlag",false);_self.set("projectParamsFlag",false);
    _self.set("countListFlag",0);//计次
    _self.set("serviceListFlag",0);//定时
    _self.set("exeDataPushFlag",false);//把定时任务exeflag set为false
    _self.set("drugExePushFlag",false);//把用药计划exeflag set为false

    var curUser = _self.get("global_curStatus").getUser();
    var employee = curUser.get("employee");
    this.store.query('employeenursinggroup',{filter:{employee:{id:employee.get("id")}},include:{employeenursinggroup:"group"}}).then(function(employeenursinggroups){
      console.log("employeenursinggroupsgetLenght",employeenursinggroups.get("length"));
      if(employeenursinggroups.get("length")===0){//该登录人 没有护理组
        _self.set("groupNocustomer",true);
        _self.set("groupHascustomer",false);
        return;
      }
      var employeenursinggroup = employeenursinggroups.get("firstObject");
      var group = employeenursinggroup.get("group");
      console.log("group111",group);
      console.log("group111 groupId",group.get("id"));
      console.log("group111 groupId customers",group.get("customers"));
      _self.store.findRecord('nursegroup',group.get("id")).then(function(nursegroup){
        var str = [];
        var customers = nursegroup.get("customers");
        console.log("nursegroup",nursegroup);
        console.log("nursegroup nursegroupId",nursegroup.get("id"));
        console.log("nursegroup customers",customers);
        if(customers){
          customers.forEach(function(customer){
            console.log("strcustomerId forEach customers",customer.get("id"));
            str.push(customer.get("id"));
          });
        }
        console.log("strcustomerId",str);
        if(str.indexOf(customerIdParams)==-1){//护理组没有照顾此老人
          console.log("strcustomerId in it",customerIdParams);
          _self.set("groupNocustomer",true);
          _self.set("groupHascustomer",false);
          // _self.incrementProperty("groupNocustomerFlag");//护理组没有老人flag++(给多次连续扫描同一老人用)
        }else {
          _self.set("groupHascustomer",true);
          _self.set("groupNocustomer",false);
          _self.incrementProperty("serviceListFlag");
          _self.incrementProperty("countListFlag");
        }
      });

    });
  }.observes("scanFlag","customerIdParams").on("init"),
  //护理组没有护理此老人
  groupNocustomerObs:function(){
    var groupNocustomer = this.get("groupNocustomer");
    var customerIdParams = this.get("customerIdParams");
    if(!groupNocustomer){return;}
    let serviceCusIdParamsList = new Ember.A();
    this.set("serviceCusIdParamsList",serviceCusIdParamsList);
    console.log("serviceCusIdParamsList1111111",serviceCusIdParamsList);
    //通过设置action进行特殊查询
    this.get("global_ajaxCall").set("action","spec_planService");
    //查询出计时服务项目
    this.store.query("specservice",{filter:{cid:customerIdParams}}).then(function(itemList){
      console.log("specservice itemList",itemList);
      let index = 0;
      if(itemList.get("length")===0){
        _self.set("planParamsFlag",true);
        return;
      }
      itemList.forEach(function(item){
        let serviceItem = _self.createServiceItem();
        if(item.get("project").content){
          serviceItem = _self.typeOneProject(serviceItem,item);
        }else {
          serviceItem = _self.typeOneItem(serviceItem,item);
        }
        serviceCusIdParamsList.pushObject(serviceItem);
        index++;
        if(index>=itemList.get("length")){
          //设置数据加载完毕标志
          _self.set("planParamsFlag",true);
        }
      });
    },
    function(){//then 方法500失败后走这个方法
      _self.set("showLoadingImg",false);
    }
  );
    var _self = this;
    this.get("global_ajaxCall").set("action","spec_countService");
    //查询出计次服务项目
    this.store.query("nursingprojectitem",{filter:{cid:customerIdParams}}).then(function(itemList){
      console.log("nursingprojectitem get and not return");
      if(itemList.get("length")===0){
        _self.set("projectParamsFlag",true);
        return;
      }
      let index = 0;
      itemList.forEach(function(item){
        // var item = items.get("item");
        console.log("items.get item",item);
        let serviceItem = _self.createServiceItem();
        serviceItem = _self.typeTwo(serviceItem,item);
        serviceCusIdParamsList.pushObject(serviceItem);
        index++;
        if(index>=itemList.get("length")){
          //设置数据加载完毕标志
          _self.set("projectParamsFlag",true);
        }
      });
    });
  }.observes("groupNocustomer"),
  //通过 cid查询数据完毕，开始进行页面数据组织
  paramsQueryCidObs: function(){
    var _self = this;
    let curuser = this.get('global_curStatus').getUser();
    if(!this.get("planParamsFlag")||!this.get("projectParamsFlag")||!this.get("drugExePushFlag")||!this.get("exeDataPushFlag")){
      return;
    }
    var serviceCusIdParamsList = this.get("serviceCusIdParamsList");
    console.log("serviceItemArray serviceCusIdParamsList",serviceCusIdParamsList);
    if(!serviceCusIdParamsList){this.set("showLoadingImg",false);return;}//都是空 关闭加载图
    let oriarray = serviceCusIdParamsList;
    console.log("oriarray before paramsQueryCidObs,",oriarray);
    oriarray = oriarray.sortBy("customerId");
    console.log("oriarray sort,",oriarray);
    let exeItemArray = this.get("exeItemArray");
    let serviceParamsList = new Ember.A();
    let customerParamsList = new Ember.A();
    let curCustomer = null;
    console.log("oriarray len:" + oriarray.get("length"));
    console.log("exeItem find: exeItemArray paramsQueryCidObs" , exeItemArray);
    var  finishTime;
    oriarray.forEach(function(serviceItem){
      //组装按照服务项目排列的数据
      if(serviceItem.get("medicineDesc")){
        console.log("drugExeItemArray",_self.get("drugExeItemArray"));
        var drugExe = _self.get("drugExeItemArray").filter(function(drugExe){
          return drugExe.get("useDrugDateNum")==serviceItem.get("timeStrDate")&&drugExe.get("customerDrugId")==serviceItem.get("customerDrugId");
        });
        console.log("drugExeItemArray drugExe",drugExe);
        if(drugExe.length){
          //标记已经执行过的
          var drugExeDrugNumber = drugExe.get("firstObject.drugNum");
          var drugExeFirst = drugExe.get("firstObject");
          serviceItem.set("hasApply",true);
          finishTime = _self.get("dateService").formatDate(drugExeFirst.get("exeDate"),"hh:mm");
          serviceItem.set("finishTime",finishTime);
          serviceItem.set("finishRemark",drugExeFirst.get("remarkString"));
          serviceItem.set("personName",drugExeFirst.get("lastUpdateUser.name"));//服务人名
          serviceItem.set("drugExe",drugExeFirst);
          serviceItem.set("drugExeDrugNumber",drugExeDrugNumber);
          serviceItem.set("applyContent",drugExeFirst.get("remark"));
        }
      }else {
        let exeItem = _self.get("exeItemArray").findBy("busiId",serviceItem.get("busiId"));
        console.log("exeItem find: cid" , exeItem);
        if(exeItem){
          //标记已经执行过的
          serviceItem.set("hasApply",true);
          finishTime = _self.get("dateService").formatDate(exeItem.get("createDateTime"),"hh:mm");
          serviceItem.set("finishTime",finishTime);
          serviceItem.set("finishRemark",exeItem.get("remarkString"));
          serviceItem.set("personName",exeItem.get("exeStaff.name"));//服务人名
          serviceItem.set("exeItem",exeItem);
          serviceItem.set("applyContent",exeItem.get("remark"));//这一句很重要把 exe的remark set过去
        }
      }
      if(serviceItem.get("type")===2){
        //组装按照客户排列的数据
        let customerIdInloop = serviceItem.get("customerId");
        if(!curCustomer||curCustomer.get("id")!==customerIdInloop){
          curCustomer = Ember.Object.create({
            id:customerIdInloop,
            name:serviceItem.get("customerName"),
            room:serviceItem.get("customerBed"),
            stuffName:curuser.get("name"),
            services: new Ember.A(),
          });
          customerParamsList.pushObject(curCustomer);
        }
        curCustomer.get("services").pushObject(serviceItem);
      }else{
        serviceParamsList.pushObject(serviceItem);
      }
    });
    this.set("serviceParamsList",serviceParamsList);
    this.set("customerParamsList",customerParamsList);
    console.log("service serviceParamsList 定时",serviceParamsList);
    console.log("service customerParamsList 不定时",customerParamsList);
    // this.incrementProperty("serviceParamListFlag");
    // this.incrementProperty("countParamListFlag");
    this.incrementProperty("serviceListFlag");
    this.incrementProperty("countListFlag");
  }.observes("planParamsFlag","projectParamsFlag","exeDataPushFlag","drugExePushFlag"),


  refreshTabNumber: function(){
    var _self = this;
    this.get("tabFuncs").forEach(function(tab){
      if(tab.get("code")==="todayTask"){
        tab.set("numberTip",_self.get("todayTaskList.length"));
      }else{
        return;
      }
    });
  },
  /*通过event service监控顶部菜单的选择事件，并进行相关方法调用*/
  listenner: function() {
    console.log("feedService reg");
    this.get('feedService').on('headerEvent_queryTask', this, 'queryTask');
  }.on('init'),
  //注销时清除事件绑定
  cleanup: function() {
    console.log("cleanup feed");
    this.get('feedService').off('headerEvent_queryTask', this, 'queryTask');
  }.on('willDestroyElement'),
  //保存方法
  finishService: function(serviceItem,callback){
    let _self = this;
    let user = this.get("global_curStatus").getUser();
    console.log("employee11111111",user.get("employee"));
    let exeRecord = this.get('store').createRecord("nursingplanexe",{
      exeStaff:user.get("employee"),
    });
    let drugprojectExe = this.get('store').createRecord("customerdrugprojectexe",{
      lastUpdateUser:user,
    });
    //存储按时或计次的服务情况
    if(serviceItem.get("type")===1){
      _self.set("saveFlagMessage","正在保存");
      this.get("store").findAll("sysconfig").then(function (sysconfig) {//每次都查询一下服务器时间
        let sysTime = sysconfig.get("firstObject").get("sysTime");//系统时间
        var  finishTime = _self.get("dateService").formatDate(sysTime,"hh:mm");
        if(serviceItem.get("medicineDesc")){
          let planItem = serviceItem.get("item.project.project");
          drugprojectExe.set("customerDrug",planItem.get("customerDrug"));
          console.log("trueDrugNum111",serviceItem.get("trueDrugNum"));
          let serviceTag ;
          if(serviceItem.get("trueDrugNum")){//如果有的话证明点进 detail里操作的
            drugprojectExe.set("drugNum",serviceItem.get("trueDrugNum"));//实际用药量
            serviceTag = serviceItem.get("serviceTag");
          }else {
            drugprojectExe.set("drugNum",serviceItem.get("useDrugNum"));//实际用药量 else  直接把计划里的数量填入
            serviceTag = Constants.useDrugResult1;//直接写完成
          }

          //备注信息
          let jsonObj = {};
          let serviceDesc = serviceItem.get("serviceDesc");
          console.log("serviceTag1111",serviceTag);
          var useDrugResultObj = _self.get("dataLoader").findDict(serviceTag);//serviceTag变为typecode了
          var useDrugFreqObj = _self.get("dataLoader").findDict(serviceItem.get("drugTypecode"));//用药规格
          console.log("serviceTag1111 useDrugResultObj",useDrugResultObj);
          drugprojectExe.set("remark",serviceDesc);//备注
          drugprojectExe.set("drugSpec",useDrugFreqObj);//用药规格
          drugprojectExe.set("result",useDrugResultObj);//完成情况
          drugprojectExe.set("useDrugDate",serviceItem.get("timeStrDate"));// 计划用药时间用于和 exe表比较
          drugprojectExe.save().then(function(){
            _self.set("saveFlag",false);//save成功后  set为false
            //设置已执行的标志用于页面处理
            serviceItem.set("hasApply",true);
            serviceItem.set("finishTime",finishTime);
            _self.incrementProperty("serviceListFlag");
            if(callback){
              callback();
            }
          },function(){
            _self.set("saveFlagMessage","保存失败");
            Ember.run.later(function(){
              _self.set("saveFlag",false);//save成功后  set为false
            },800);
          });
          return ;
        }
        let detail = serviceItem.get("item.item");
        // exeRecord.set("plan",planItem.get("plan"));
        exeRecord.set("detail",detail);
        exeRecord.set("itemProject",detail.get("item"));
        console.log("detailGet item",detail.get("item"));
        //备注信息
        let jsonObj = {};
        let serviceDesc = serviceItem.get("serviceDesc");
        if(serviceDesc){
          jsonObj.serviceDesc = serviceDesc;
        }
        if(serviceItem.get("serviceTag")){
          jsonObj.serviceTag = serviceItem.get("serviceTag");
        }
        exeRecord.set("remark",JSON.stringify(jsonObj));
        exeRecord.save().then(function(){
          _self.set("saveFlag",false);//save成功后  set为false
          serviceItem.set("hasApply",true);
          serviceItem.set("finishTime",finishTime);
          _self.incrementProperty("serviceListFlag");
          if(callback){
            callback();
          }
        },function(){
          _self.set("saveFlagMessage","保存失败");
          Ember.run.later(function(){
            _self.set("saveFlag",false);//save成功后  set为false
          },800);
        });
      });

    }else{//不定时任务  计次服务
      console.log("itemProject111  type 应该是 2",serviceItem.get("type"));
      //如果已经执行过，则使用之前的执行对象
      if(serviceItem.get("hasApply")){
        exeRecord = serviceItem.get("exeItem");
        console.log("exeRecord hasApply",exeRecord);
        if(!exeRecord){//save方法加了不会走这个了 _self.set("exeDataPushFlag",false);//把不定时任务exeflag set为false  _self.incrementProperty("queryFlag");//再让查询exe方法执行下
          _self.store.query("nursingplanexe",{filter:{
            itemProject:{id:serviceItem.get("busiId")},
            exeStaff:{id:user.get("employee.id")}
          }}).then(function(itemList){
            exeRecord = itemList.get("firstObject");
            console.log("exeRecord hasApply exeRecord",exeRecord);
            exeRecord.set("remark",serviceItem.get("applyContent"));
            exeRecord.save().then(function(){
              serviceItem.set("hasApply",true);
              _self.incrementProperty("serviceListFlag");
              if(callback){
                callback();
              }
            });
          });
          return;
        }else {
          exeRecord.set("remark",serviceItem.get("applyContent"));
        }
      }else {
        exeRecord.set("itemProject",serviceItem.get("item"));
        // let detail = serviceItem.get("item");//add
        // exeRecord.set("detail",detail);
        exeRecord.set("remark",serviceItem.get("applyContent"));//从0添加到有 第二次继续添加报 set undefined
      }

      exeRecord.save().then(function(){
        //设置已执行的标志用于页面处理
        if(!serviceItem.get("hasApply")){//不是 hasApply才刷新exe
          _self.set("falgOfprojectPlanCustomerId",serviceItem.get("customerId"));//不定时任务完成 刷新标识 customerId
          serviceItem.set("hasApply",true);
          _self.incrementProperty("queryFlag");//再让查询exe方法执行下
          _self.set("exeDataPushFlag",false);//把不定时任务exeflag set为false
        }
        serviceItem.set("hasApply",true);
        // serviceItem.set("exeItem",exeRecord);//暂时还是有bug
        _self.incrementProperty("serviceListFlag");
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
    console.log("project11111 content",item.get("project").content);
    serviceItem.set("uniqId",item.get("project.project.customerDrug.customer.id")+'_'+item.get("project.useDrugDate")+'_drug'+item.get("project.project.customerDrug.id"));
    //设置类型标志
    serviceItem.set("type",1);
    serviceItem.set("busiId",item.get("project.project.customerDrug.id"));
    serviceItem.set("itemId",item.get("id"));
    //设置关联数据对象
    serviceItem.set("item",item);
    //设置显示内容
    serviceItem.set("customerId",parseInt(item.get("project.project.customerDrug.customer.id")));
    serviceItem.set("customerName",item.get("project.project.customerDrug.customer.name"));
    serviceItem.set("avatarUrl",item.get("project.project.customerDrug.customer.avatarUrl"));
    serviceItem.set("customerBed",item.get("project.project.customerDrug.customer.bed.name"));
    serviceItem.set("customerDrugId",item.get("project.project.customerDrug.id"));
    serviceItem.set("title","用药计划");
    serviceItem.set("medicineDesc",item.get("project.useDrugNum")+""+item.get("project.useDrugSpec").get("typename")+"，"+item.get("project.useDrugWay"));
    serviceItem.set("medicineName",item.get("project.project.customerDrug.drug.name"));
    console.log("customerDrug11111111111",item.get("project.project.customerDrug.drug"));
    console.log("customerDrug11111111111 name",item.get("project.project.customerDrug.drug.name"));
    serviceItem.set("medicineNumSpec",item.get("project.useDrugNum")+""+item.get("project.useDrugSpec").get("typename"));
    serviceItem.set("useDrugNum",item.get("project.useDrugNum"));
    serviceItem.set("drugTypename",item.get("project.useDrugSpec").get("typename"));//用药单位
    serviceItem.set("drugTypecode",item.get("project.useDrugSpec").get("typecode"));//用药规格
    serviceItem.set("medicineDrugWay",item.get("project.useDrugWay"));//用药方法
    serviceItem.set("medicineDrugFreq",item.get("project.useDrugFreq"));//用药频次
    serviceItem.set("remark",item.get("project.remark"));
    serviceItem.set("timeStr",item.get("project.useDrugDate")+":00");
    serviceItem.set("timeStrDate",item.get("project.useDrugDate"));

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
    return serviceItem;
  },
  //集合项  typeOneItem 定时任务
  typeOneItem:function(serviceItem,item){
    serviceItem.set("projectitemId",item.get("item.item.id"));
    serviceItem.set("date",item.get("date"));
    serviceItem.set("uniqId",item.get("item.customer.id")+'_'+item.get("item.startTimeTab")+'_'+item.get("item.item.item.name"));
    console.log("1111111111111111111"+serviceItem.get("uniqId"));
    serviceItem.set("type",1);
    serviceItem.set("busiId",item.get("item.id"));
    serviceItem.set("itemId",item.get("id"));
    //设置关联数据对象
    serviceItem.set("item",item);
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
    return serviceItem;
  },
  //集合项  typeTwo 不定时任务
  typeTwo:function(serviceItem,item){
    serviceItem.set("type",2);
    console.log("itemProject id1111111",item.get("id"));//计次任务的ID
    serviceItem.set("busiId",item.get("id"));
    //设置关联数据对象
    serviceItem.set("item",item);
    //设置显示内容
    serviceItem.set("customerId",parseInt(item.get("project.customer.id")));
    serviceItem.set("customerName",item.get("project.customer.name"));
    serviceItem.set("avatarUrl",item.get("project.customer.avatarUrl"));
    serviceItem.set("customerBed",item.get("project.customer.bed.name"));
    serviceItem.set("title",item.get("item.name"));
    serviceItem.set("desc",item.get("item.remark"));
    serviceItem.set("remark",item.get("remark"));
    return serviceItem;
  },

  actions:{
    switchTab(code){
      console.log('switchTab in,code:' + code);
      this.set("curTabCode",code);
      if(code=="finished"){
        this.set("showLoadingImg",false);
      }else {
        var list = this.get("serviceList");
        if(!list){this.set("showLoadingImg",false);}
        var dataTypeCode = this.get("dataType");
        this.send("switchDataMode",dataTypeCode);//小bug 点击到不定时任务 再点击回来东西不显示,笨方法有点击一下
      }
      // this.directInitScoll();
    },

    squareAll: function(){
      var _self = this;
      var groupNocustomer = this.get("groupNocustomer");//护理组没有此老人
      var groupHascustomer = this.get("groupHascustomer");//护理组内有此老人
      var itemId = "square_all";
      this.set("planDataPushFlag",false);
      this.set("projectDataPushFlag",false);
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          if(groupHascustomer){
            _self.set("customerIdParams","");
          }else {
            _self.set("customerIdParams","");
            _self.queryFlagIn();
          }
        },100);
      },200);
    },
    squareScan: function(){
      var itemId = "square_scan";
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('scanQRCode',{type:'square'});
        },100);
      },200);
    },
    datacode:null,
    switchDataMode(code){
      console.log('switchDataMode in,code:' + code);
      this.set("datacode",code);
      if(this.get("datacode")==code){//不相等 set loading图片显示
        console.log("choice in item code",code);
        this.set("showLoadingImg",false);
      }
      this.set("dataType",code);
      var list = this.get("serviceCustomerList");
      if(!list){this.set("showLoadingImg",false);}
    },
    //这个是判断 list是否在hbs加载完毕标示
    didInsertAct(code){
      var list = this.get("serviceCustomerList");
      var i = this.get("i");
      i++;
      this.set("i",i);
      console.log("i and listLenght",i,list.get("length"));
      if(i == list.get("length")){
        this.set("btnFlag",false);
        this.set("showLoadingImg",false);
        this.set("i",0);
        console.log("i and listLenght",i);
      }
    },
    goCountDetail(){
      var serviceItem = this.get("serviceItem");
      this.get("feedBus").set("threadData",serviceItem);
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('task-count-detail');
    },
    panStartAction(){
      console.log("panStartAction in ts");
      //阻止滚动
      this.set("scrollPrevent",true);
    },
    panEndAction(){
      var _self = this;
      console.log("panEndAction in ts");
      //放开滚动,延时500毫秒
      Ember.run.later(function(){
        _self.set("scrollPrevent",false);
      },500);
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
      console.log("insert e in");
      this.directInitScoll();
    }
  },
});
