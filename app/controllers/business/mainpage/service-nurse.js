import Ember from 'ember';
import finishService from '../../../controllers/finish-service';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(finishService,InfiniteScroll,{
  directInitScollFlag:0,
  dingshiDataDoneFlag:0,
  suishiDataDoneFlag:0,
  queryFlag: 0,
  stopScroll:true,
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  service_PageConstrut: Ember.inject.service('page-constructure'),
  curTabCode: "todayTask",
  hasOpensuishi: false,
  hasOpendingshi: false,
  //只有当当前页面时route是service-nurse时,才会把切换以后的老人id传递给组件,使其加载数据
  serveCustomerIdObs: function(){
    var customerId = this.get("global_curStatus.serveCustomerId");
    var curRoutePath=this.get('service_PageConstrut').get('curRouteName');
    if(curRoutePath === "service-nurse"){
      this.set("hasOpendingshi",false);
      this.set("hasOpensuishi",false);
      this.set("serveCustomerId",customerId);
    }
  }.observes("global_curStatus.serveCustomerId").on("init"),
  //重新查找数据
  queryObs: function(){
    let _self = this;
    _self.set("service_PageConstrut.showLoader",true);//set 加载图片显示
    console.log("query specservice after showLoader：",_self.get("service_PageConstrut.showLoader"));
    // _self.set("global_curStatus.headerBarHide",true);
    console.log("queryObs run");
    // this.set("showLoadingImgIn",true);//打开加载图片
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
      // this.set("showLoadingImgIn",false);
      this.incrementProperty("showLoadingImgFlag");
      _self.set("service_PageConstrut.showLoader",false);//set 加载图片显示
      // _self.set("global_curStatus.headerBarHide",false);
      return;
    }else{
      console.log("customerId yes",customerId);
      this.set("nocustomerId",false);
      //如果选择的全部
      if(customerId=="all"){
        filter.uid = curuser.get("id");
        //filter.positonType = "postType4";//护士
        filter.itemType = "serviceType1";//专业护理
        filter.queryStartDate = queryCusObj.queryStartDate;
        filter.queryEndDate = queryCusObj.queryEndDate;
        _self.set("showRightFlag",true);
      }else {
        _self.set("showRightFlag",false);
        filter.customerId = customerId;
        //filter.positonType = "postType4";//护士
        filter.itemType = "serviceType1";//专业护理
        filter.queryStartDate = "0";
        filter.queryEndDate = "24";
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
          filter.queryStartDate = startTime;
          filter.queryEndDate = endTime;
        }else {
          //计算当前时间节点
          let sysTime = this.get("dataLoader").getNowTime();
          var nowHour = this.get("dateService").formatDate(sysTime,"hh");
          var numH = Number(nowHour);
          console.log("sysTime nowHour numH",sysTime,nowHour,numH);
          if(numH>=0&&numH<6){
            localObj.queryStartDate = "0";
            localObj.queryEndDate = "6";
            filter.queryStartDate = "0";
            filter.queryEndDate = "6";
          }else if (numH>=6&&numH<8) {
            localObj.queryStartDate = "6";
            localObj.queryEndDate = "8";
            filter.queryStartDate = "6";
            filter.queryEndDate = "8";
          }else if (numH>=8&&numH<10) {
            localObj.queryStartDate = "8";
            localObj.queryEndDate = "10";
            filter.queryStartDate = "8";
            filter.queryEndDate = "10";
          }else if (numH>=10&&numH<12) {
            localObj.queryStartDate = "10";
            localObj.queryEndDate = "12";
            filter.queryStartDate = "10";
            filter.queryEndDate = "12";
          }else if (numH>=12&&numH<14) {
            localObj.queryStartDate = "12";
            localObj.queryEndDate = "14";
            filter.queryStartDate = "12";
            filter.queryEndDate = "14";
          }else if (numH>=14&&numH<16) {
            localObj.queryStartDate = "14";
            localObj.queryEndDate = "16";
            filter.queryStartDate = "14";
            filter.queryEndDate = "16";
          }else if (numH>=16&&numH<18) {
            localObj.queryStartDate = "16";
            localObj.queryEndDate = "18";
            filter.queryStartDate = "16";
            filter.queryEndDate = "18";
          }else if (numH>=18&&numH<20) {
            localObj.queryStartDate = "18";
            localObj.queryEndDate = "20";
            filter.queryStartDate = "18";
            filter.queryEndDate = "20";
          }else if (numH>=20&&numH<24) {
            localObj.queryStartDate = "20";
            localObj.queryEndDate = "24";
            filter.queryStartDate = "20";
            filter.queryEndDate = "24";
          }
        }
      }else {
        localObj.queryStartDate = filter.queryStartDate;
        localObj.queryEndDate = filter.queryEndDate;
      }
      //存入本地
      localStorage.queryCusObj = JSON.stringify(localObj);
      _self.set("localObj",localObj);
    }
    let curTabCode = _self.get("curTabCode");
    if(curTabCode == "todayTask"){
      filter.flagQueryType = "dingshi";
    }else{
      filter.flagQueryType = "suishi";
    }
    this.set("filter",filter);
    params.filter = filter;
    console.log("query specservice before components",customerId,params);
    //查找数据
    this.get("store").query("specservice",params).then(function(itemList){
      let flagQueryType = params.filter.flagQueryType;
      if(flagQueryType == "dingshi"){
        console.log("run in dingshiItemList");
        _self.set("dingshiItemList",itemList);
        let hasOpendingshi = _self.get("hasOpendingshi");
        console.log("hasOpendingshi in dingshi:" + _self.get("hasOpendingshi"));
        _self.set("hasOpendingshi",true);
        _self.incrementProperty("dingshiDataDoneFlag");
      }else{
        console.log("run in suishiItemList");
        _self.set("suishiItemList",itemList);
        let hasOpensuishi = _self.get("hasOpensuishi");
        console.log("hasOpensuishi in countListFlag:" + _self.get("hasOpensuishi"));
        _self.set("hasOpensuishi",true);
        _self.incrementProperty("suishiDataDoneFlag");
      }
    },
    function(){//then 方法500失败后走这个方法
      console.log("LoadingImgInss444");
      // _self.set("showLoadingImgIn",false);
      _self.incrementProperty("showLoadingImgFlag");
      _self.set("service_PageConstrut.showLoader",false);//set 加载图片显示
      // _self.set("global_curStatus.headerBarHide",false);
    });
  }.observes("global_curStatus.commonInitHasCompleteFlag","queryFlag","serveCustomerId").on("init"),

  actions:{
    switchShowAction(){
      this.incrementProperty("directInitScollFlag");
      //当以后切换进入页面时,才把全部选好的老人id传给组件
      var customerId = this.get("global_curStatus.serveCustomerId");
      this.set("serveCustomerId",customerId);
    },
    refreshModel(){
      console.log("run in refreshModel");
      this.incrementProperty("queryFlag");
    },
    refreshData(param1,param2){
      this.set("hasOpendingshi",false);
      this.set("hasOpensuishi",false);
      this.set("startTime",param1);
      this.set("endTime",param2);
      this.incrementProperty("queryFlag");
    },


  },
});
