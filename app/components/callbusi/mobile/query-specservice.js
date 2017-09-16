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
  countListFlag: 0,
  queryFlag: 0,
  scollFlag: 0,//刷新后使组件包裹滚动条
  selectStartTimeFlag: 0,
  scrollToPosition: false,//刷新后使滚动
  i: 0,
  k: 0,
  planDataPushFlag:0,
  scrollFlag:false,
  btnFlag:false,
  isScrollToTop:false,
  infiniteContentPropertyName: Ember.computed("infinitePropertyName",function(){
    return this.get("infinitePropertyName");
  }),
  infiniteModelName: "specservice",
  infiniteContainerName: Ember.computed("infiniteName",function(){
    return this.get("infiniteName");
  }),
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
  dataType:"task",
  oriCountItemId: null,

  init: function(){
    this._super(...arguments);
    // this.set("directInitScollFlag",true);
    // this.incrementProperty("queryFlag");
    // this.get("service_PageConstrut").set("showLoader", false);//先关闭mainpage的
    this.set("showLoadingImgIn",true);
    var _self = this;
    Ember.run.schedule("afterRender",this,function() {
      //设置默认显示tab页
      console.log("menuitem in tab init");
      _self.set("clickActFlag","todayTask");
      this.set("countListFlag",0);//计次
      this.set("serviceListFlag",0);//定时
      this.incrementProperty("planDataPushFlag");
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
    this.incrementProperty("queryFlag");
    console.log("in itqueryFlagIn");
    this.set("countListFlag",0);//计次
    this.set("serviceListFlag",0);//定时
    // this.set("planDataPushFlag",false);
    this.incrementProperty("planDataPushFlag");
    // this.set("directInitScollFlag",false);
  },
  // scrollObs: function () {//观察 infinite-scroll 设置的对象 _scroller
  //   let _self = this;
  //   var _scroller = this.get("_scroller");
  //   if(!_scroller){return;}
  //   Ember.run.schedule("afterRender",this,function() {
  //     let scrollNum = _self.get("scrollNum");
  //     _scroller.scrollTo(0, scrollNum, 0);
  //   });
  // }.observes("_scroller","scrollNum").on("init"),
  //重新查找数据
  queryObs: function(){
    let _self = this;
    console.log("queryObs run");
    this.set("showLoadingImgIn",true);//打开加载图片
    console.log("query obs in,queryFlag:" + this.get("queryFlag"));
    var commonInitHasCompleteFlag = this.get("global_curStatus.commonInitHasCompleteFlag");
    console.log("queryObs run commonInitHasCompleteFlag",commonInitHasCompleteFlag);
    if(!commonInitHasCompleteFlag){
      return;
    }
    //获得当前user
    let curuser = this.get('global_curStatus').getUser();
    var customerId = this.get("serveCustomerId");
    console.log("queryObs run customer",customerId);
    var params = {};
    var filter = {};
    var querySpecFalg = this.get("querySpecFalg");
    var queryCusStr = localStorage.getItem("queryCusObj");
    var queryCusObj = JSON.parse(queryCusStr);
    if(!queryCusStr){
      console.log("run queryCusStr");
      queryCusObj = {};
      queryCusObj.queryStartDate = "6";
      queryCusObj.queryEndDate = "8";
    }
    console.log("query_specservice",queryCusObj);
    // if(!customerId&&!queryCusObj){
    if(!customerId){
      return;
    }else if (customerId == "nolocal") {//如果本地没有储存时间数据
      this.set("nocustomerId",true);
      console.log("LoadingImgInss111");
      this.set("showLoadingImgIn",false);
      return;
    }else{
      console.log("showLoadingImgIn::",this.get("showLoadingImgIn"));
      console.log("customerId yes",customerId);
      this.set("nocustomerId",false);
      if(querySpecFalg=="care"){
        //如果选择的全部
        if(customerId=="all"){
          filter.uid = curuser.get("id");
          //filter.positonType = "postType5";//护理员
          filter.itemType = "serviceType2";//生活照料
          _self.set("showRightFlag",true);
          //选择指定老人
        }else {
          _self.set("showRightFlag",false);
          filter.customerId = customerId;
          //filter.positonType = "postType5";//护理员
          filter.itemType = "serviceType2";//生活照料
        }
      }else if (querySpecFalg=="nurse") {
        if(customerId=="all"){
          filter.uid = curuser.get("id");
          //filter.positonType = "postType4";//护士
          filter.itemType = "serviceType1";//专业护理
          _self.set("showRightFlag",true);
        }else {
          _self.set("showRightFlag",false);
          filter.customerId = customerId;
          //filter.positonType = "postType4";//护士
          filter.itemType = "serviceType1";//专业护理
        }
      }
      _self.set("queryCusFlagAgain",customerId);
    }
    console.log("goon...");
    var startTime = this.get("startTime");
    var endTime = this.get("endTime");
    if(queryCusObj){
      var localObj = {
        queryCusFlag:customerId,
      };
      if(customerId=="all"){
        if(endTime){
          localObj.queryStartDate = startTime;
          localObj.queryEndDate = endTime;
        }else {
          //计算当前时间节点
          let sysTime = this.get("dataLoader").getNowTime();
          var nowHour = this.get("dateService").formatDate(sysTime,"hh");
          var numH = Number(nowHour);
          console.log("sysTime nowHour numH",sysTime,nowHour,numH);
          if(numH>=0&&numH<6){
            localObj.queryStartDate = "0";
            localObj.queryEndDate = "6";
          }else if (numH>=6&&numH<8) {
            localObj.queryStartDate = "6";
            localObj.queryEndDate = "8";
          }else if (numH>=8&&numH<10) {
            localObj.queryStartDate = "8";
            localObj.queryEndDate = "10";
          }else if (numH>=10&&numH<12) {
            localObj.queryStartDate = "10";
            localObj.queryEndDate = "12";
          }else if (numH>=12&&numH<14) {
            localObj.queryStartDate = "12";
            localObj.queryEndDate = "14";
          }else if (numH>=14&&numH<16) {
            localObj.queryStartDate = "14";
            localObj.queryEndDate = "16";
          }else if (numH>=16&&numH<18) {
            localObj.queryStartDate = "16";
            localObj.queryEndDate = "18";
          }else if (numH>=18&&numH<20) {
            localObj.queryStartDate = "18";
            localObj.queryEndDate = "20";
          }else if (numH>=20&&numH<24) {
            localObj.queryStartDate = "20";
            localObj.queryEndDate = "24";
          }
        }
      }else {
        localObj.queryStartDate = startTime;
        localObj.queryEndDate = endTime;
      }
      //存入本地
      localStorage.queryCusObj = JSON.stringify(localObj);
    }
    // this.set("filter",filter);
//改版后查找全部时间点的数据
    filter.queryStartDate = "0";
    filter.queryEndDate = "24";
    params.filter = filter;
    console.log("query specservice before components",customerId,params);
    //查找数据
    this.get("store").query("specservice",params).then(function(itemList){
      //每次加载完数据后回到顶部,在组件中体现
      _self.set("isScrollToTop",true);
      _self.set("selectStartTime",localObj.queryStartDate);
      _self.set("selectEndTime",localObj.queryEndDate);
      // _self.send("queryTime",localObj.queryStartDate,localObj.queryEndDate);
      //如果没有数据
      if(!itemList.get("length")){
        console.log("LoadingImgInss222");
        _self.set("showLoadingImgIn",false);
      }
      let serviceItemArray = new Ember.A();
      console.log("specservice itemList",itemList);
      let index = 0;
      if(itemList.get("length")===0){
        _self.get("startTime","");//查完就清空
        _self.get("endTime","");
        _self.set("serviceItemArray",serviceItemArray);
        _self.incrementProperty("planDataPushFlag");
        return;
      }
      //循环组装数据
      itemList.forEach(function(item){
        let serviceItem = _self.createServiceItem();
        if(item.get("project").content){
          serviceItem = _self.typeOneProject(serviceItem,item);
        }else if(item.get("item").content){
          serviceItem = _self.typeOneItem(serviceItem,item);
        }else if(item.get("projectItem").content){
          serviceItem = _self.typeTwo(serviceItem,item.get("projectItem"),item.get("itemExes"));
        }else{
          return;
        }
        // serviceItemArray.pushObject(serviceItem);
        serviceItemArray.pushObject(serviceItem);
        _self.set("serviceItemArray",serviceItemArray);
        index++;
        //组装完毕开始进行排序等业务
        if(index>=itemList.get("length")){
          //设置数据加载完毕标志
          _self.get("startTime","");//查完就清空
          _self.get("endTime","");//查完就清空
          _self.incrementProperty("planDataPushFlag");
        }
      });
      let typeOneList = new Ember.A();
      let typetwoList = new Ember.A();
      //计算定时和不定时任务是否有数据
      serviceItemArray.forEach(function(item){
        if(item.get("type") == 1){
          typeOneList.pushObject(item);
        }
        if(item.get("type") == 2){
          typetwoList.pushObject(item);
        }
      });
      console.log("typeOneList len:",typeOneList.get("length"));
      console.log("typetwoList len:",typetwoList.get("length"));
      if(!typeOneList.get("length") || !typetwoList.get("length")){
        console.log("LoadingImgInss333");
        _self.set("showLoadingImgIn",false);
      }
    },
      function(){//then 方法500失败后走这个方法
        console.log("LoadingImgInss444");
        _self.set("showLoadingImgIn",false);
      }
    );
  }.observes("global_curStatus.commonInitHasCompleteFlag","queryFlag","serveCustomerId").on("init"),
  //当数据都加载完毕，开始进行页面数据组织
  dataBuildObs: function(){
    var _self = this;
    console.log("in dataBuildObs");
    let curuser = this.get('global_curStatus').getUser();
    if(!this.get("planDataPushFlag")){
      return;
    }
    let serviceList = new Ember.A();
    let customerList = new Ember.A();
    let oriarray = this.get("serviceItemArray");
    console.log("oriarray sort,",oriarray);
    let curCustomer = null;
    if(!oriarray){return;}
    // oriarray = oriarray.sortBy("hasApply");
    console.log("oriarray len:" + oriarray.get("length"));
    oriarray.forEach(function(serviceItem){
      console.log("finishRemark in foreach:",serviceItem.get("finishRemark"));
      if(serviceItem.get("type")===2){
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
      }else{
        console.log("serviceList push:" );
        serviceList.pushObject(serviceItem);
      }
    });
    console.log("customerList in first:",customerList);
    this.set("serviceAllList",serviceList);
    this.set("countList",customerList);
    this.incrementProperty("serviceListFlag");
    this.incrementProperty("countListFlag");
  }.observes("planDataPushFlag").on("init"),

  //按时服务列表变化的监视器
  serviceListObs: function(){
    let _self = this;
    console.log("in serviceListObs serviceListFlag",this.get("serviceListFlag"));
    if(this.get("serviceListFlag")===0){
      return;
    }
    let serviceAllList = this.get("serviceAllList");
    serviceAllList.forEach(function(servicetimeStrOne){
      console.log("servicetimeStrOne in forEach:",servicetimeStrOne.get("timeStrOne"));
      console.log("service in forEach:",servicetimeStrOne);
    });
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
    //分析每一项数据,给他们分配相应的id数据,绘制到页面中,为全部老人右侧滚动条业务做准备,只给每个时间段内的第一条数据设置相应的id
    serviceAllListSort.forEach(function(serviceList) {
      // var timeStrOne = serviceList.get("timeStrDate");
      var timeStrOne = serviceList.get("timeStrOne");
      console.log("timeStrOne in each:",timeStrOne);
      var hasApply = serviceList.get("hasApply");
      console.log("serviceList in hasApply:",hasApply);
      if(hasApply === true){
        console.log("hasApply!!");
        if(!flagBar.flagHasApply){
          console.log("hasApply in if!!");
          serviceList.set('initial',"flagHasApply");
          console.log("serviceList in initial!!",serviceList.get('initial'));
          flagBar.set('flagHasApply',true);
        }else{
          serviceList.set('initial',null);
        }
        return true;
      }
      if( timeStrOne<6 && timeStrOne>=0){
        if(!flagBar.flag0){
          serviceList.set('initial',"flag0");
          flagBar.set('flag0',true);
        }else{
          serviceList.set('initial',null);
        }
      }
      if( timeStrOne<8 && timeStrOne>=6){
        if(!flagBar.flag6){
          serviceList.set('initial',"flag6");
          flagBar.set('flag6',true);
        }else{
          serviceList.set('initial',null);
        }
      }
      if( timeStrOne<10 && timeStrOne>=8){
        if(!flagBar.flag8){
          serviceList.set('initial',"flag8");
          flagBar.set('flag8',true);
        }else{
          serviceList.set('initial',null);
        }
      }
      if( timeStrOne<12 && timeStrOne>=10){
        if(!flagBar.flag10){
          serviceList.set('initial',"flag10");
          flagBar.set('flag10',true);
        }else{
          serviceList.set('initial',null);
        }
      }
      if( timeStrOne<14 && timeStrOne>=12){
        if(!flagBar.flag12){
          serviceList.set('initial',"flag12");
          flagBar.set('flag12',true);
        }else{
          serviceList.set('initial',null);
        }
      }
      if( timeStrOne<16 && timeStrOne>=14){
        if(!flagBar.flag14){
          serviceList.set('initial',"flag14");
          flagBar.set('flag14',true);
        }else{
          serviceList.set('initial',null);
        }
      }
      if( timeStrOne<18 && timeStrOne>=16){
        if(!flagBar.flag16){
          serviceList.set('initial',"flag16");
          flagBar.set('flag16',true);
        }else{
          serviceList.set('initial',null);
        }
      }
      if( timeStrOne<20 && timeStrOne>=18){
        if(!flagBar.flag18){
          serviceList.set('initial',"flag18");
          flagBar.set('flag18',true);
        }else{
          serviceList.set('initial',null);
        }
      }
      if( timeStrOne<24 && timeStrOne>=20){
        if(!flagBar.flag20){
          serviceList.set('initial',"flag20");
          flagBar.set('flag20',true);
        }else{
          serviceList.set('initial',null);
        }
      }
    });
    console.log("sort serviceAllListSort:",serviceAllListSort);
    this.set("serviceList",serviceAllListSort);
    console.log("sort serviceList after:",this.get("serviceList"));
    // this.directInitScoll();
  }.observes("serviceListFlag","toSpecservice","directInitScollFlag").on("init"),
  //计次服务列表变化的监视器
  countListObs: function(){
    var _self = this;
    if(this.get("countListFlag")===0){
      return;
    }
    var falgOfprojectPlanCustomerId = this.get("falgOfprojectPlanCustomerId");//不定时任务 save标识  save了就不让第一个 "expanded"为true
    var falgOfprojectPlanBusiId = this.get("falgOfprojectPlanBusiId");//不定时任务 save标识  save了就不让第一个 "expanded"为true
    var customerList = this.get("countList");
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
          if(serviceItem.get("trueDrugNum")){//如果有的话证明点进 detail里操作的
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
            var servicefinishlevelDrug = _self.get("dataLoader.serviceFinishDefaultList").findBy("remark",Constants.servicefinishlevelDefault);
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
            serviceItem.set("trueDrugNum",drugprojectExe.get("drugNum"));//实际用药量
            console.log("personName in finishService:",user.get("employee.name"));
            serviceItem.set("personName",user.get("employee.name"));//服务人名
            // _self.incrementProperty("queryFlag");
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
              App.lookup("controller:business").popTorMsg("保存失败,此服务已被执行");
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
        console.log("finishLevel in exeRecord save:",serviceItem.get("servicefinishlevel"));
        if(serviceItem.get("servicefinishlevel")){
          exeRecord.set("finishLevel",serviceItem.get("servicefinishlevel"));//标签对象
        }else{
          var servicefinishlevel = _self.get("dataLoader.serviceFinishDefaultList").findBy("remark",Constants.servicefinishlevelDefault);
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
          serviceItem.set("personName",user.get("employee.name"));//服务人名
          _self.incrementProperty("serviceListFlag");
          if(callback){
            callback();
          }
        },function(err){
          let error = err.errors[0];
          if(error.code==="14"){
            App.lookup("controller:business").popTorMsg("保存失败,此服务已被执行");
            App.lookup('controller:business.mainpage').closeMobileShade("保存失败");
          }
          if(error.code==="15"){
            App.lookup("controller:business").popTorMsg("保存失败,请刷新页面后再尝试");
            App.lookup('controller:business.mainpage').closeMobileShade("保存失败");
          }
        });

    }else{//不定时任务  计次服务
      console.log("itemProject111  type 应该是 2",serviceItem.get("type"));
      var servicefinishlevelExe = _self.get("dataLoader.serviceFinishDefaultList").findBy("remark",Constants.servicefinishlevelDefault);
      exeRecord.set("finishLevel",servicefinishlevelExe);//标签对象
      exeRecord.set("itemProject",serviceItem.get("item"));
      exeRecord.save().then(function(exe){
        console.log("exe in save:",exe);
        let countList = _self.get("countList");
        console.log("countList in save:",countList);
        countList.forEach(function(countItem){
          if(countItem.get("id") == serviceItem.get("customerId")){
            console.log("countItem in save:",countItem);
            countItem.get("services").forEach(function(service){
              if(service.get("busiId") == serviceItem.get("busiId")){
                console.log("service in save:",service);
                service.get("itemExes").pushObject(exe);
              }
            });
          }
        });
        console.log("countList in save:",countList);
        _self.set("countList",countList);
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
      console.log('switchTab in,code:' + code);
      this.set("curTabCode",code);
      // this.set("showLoadingImgIn",false);
      if(code=="finished"){
        console.log("LoadingImgInss666");
      }else {
        var showRightFlag = this.get("showRightFlag");
        // var filter = this.get("filter");
        let selectStartTime = this.get("selectStartTime");
        let selectEndTime = this.get("selectEndTime");
        console.log("selectStartTime in switchTab:",selectStartTime);
        console.log("selectEndTime in switchTab:",selectEndTime);
      if(showRightFlag){
        //如果是全部老人,切换tab页时,不进行滚动到指定位置
        this.set("scrollToPosition",false);
        this.incrementProperty("selectStartTimeFlag");
        }
        console.log("LoadingImgInss777");
        // this.set("showLoadingImgIn",false);
        var list = this.get("serviceList");
        if(!list){
          console.log("LoadingImgInss888");
          // this.set("showLoadingImgIn",false);
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
          App.lookup("controller:business").popTorMsg("护理任务--" + item.get("title") + ",已执行");
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
        App.lookup("controller:business").popTorMsg("护理任务--" + serviceItem.get("title") + ",已执行");
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
    //从组件中获取是否去掉loading图标
    showLoadingImgInClose(){
      this.set("showLoadingImgIn",false);
    },
    //从组件中获取是否下拉刷新
    queryFlagInAction(){
      this.queryFlagIn();
    },

  },
});
