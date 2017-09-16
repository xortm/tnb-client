import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
const { taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail} = Constants;

export default Ember.Controller.extend(InfiniteScroll,{
  service_PageConstrut:Ember.inject.service("page-constructure"),
  feedService: Ember.inject.service('feed-bus'),
  dateService:Ember.inject.service('date-service'),
  infiniteContentPropertyName: "customerList",
  infiniteModelName: "customer",
  infiniteContainerName:"customerContainer",
  queryType:null,//条件查询类别
  queryValue:null,//条件查询内容
  customerListObs: function(){
    this.set("showModel",false);
    this.set("global_pageConstructure.showLoader",true);//set 加载图片显示
    let queryType =  this.get("queryType");
    let queryValue =  this.get("queryValue");
    let _self = this;
    console.log("month1111 customerListObs in,queryType:" + queryType + " and queryValue:" + queryValue);
    let queryParams = {};
    let filter ={};
    // if(!queryValue){// 下面的and 过滤条件实在 不知道怎么写，小bug(search的时候不是入住试住的也能search到)
    //   filter = {
    //     'customerStatus---1':{'typecode@$or1---1':'customerStatusIn'},
    //     'customerStatus---2':{'typecode@$or1---2':'customerStatusTry'}
    //   };
    // }
    filter = {
      'customerStatus---1':{'typecode@$or1---1':'customerStatusIn'},
      'customerStatus---2':{'typecode@$or1---2':'customerStatusTry'}
    };

    //拼装条件
    if(queryType&&queryType.length>0){
      if(queryValue){
        this.set("searchHas",true);
      }
      if(queryType==="all"){//all 是老人名字和房间
        filter["name@$like@$or2"]= queryValue;
        filter["[bed][room][name@$like]@$or2"]= queryValue;
        this.set("searchMessage","搜索老人名字或房间号："+queryValue);
      }
      //按客户姓名，手机号，身份证查询
      if(queryType==="name"||queryType==="phone"){
        console.log("month1111 name",queryValue);
        filter["name@$like@$or2"]= queryValue;
        filter["phone@$or2"]= queryValue;
        // filter["cardCode@$like@$or1"]= queryValue;
        if(queryType==="name"){
          this.set("searchMessage","搜索老人名字："+queryValue);
        }
        // else {
        //   this.set("searchMessage","搜索老人手机号："+queryValue);
        // }
      }
      //按房间查询
      if(queryType==="room"){
        console.log("month1111 room",queryValue);
        filter["[bed][room][name@$like]"]= queryValue;
        this.set("searchMessage","搜索房间："+queryValue);
      }
      //按入住时间查
      if(queryType==="date"){
        console.log("month1111 value",queryValue);
        let year = queryValue.split("-")[0];
        let month = queryValue.split("-")[1];
        if(month == 12){
          year = Number(year) + 1;
          month = 1;
        }else {
          month = Number(month) + 1;
        }
        console.log("month1111 year",year);
        console.log("month1111 month",month);
        // let firstTime = this.get("dateService").getFirstSecondStampOfMonth(year,month);//时间方法有问题
        // let lastTime = this.get("dateService").getLastSecondStampOfMonth(year,month);
        let firstTime = (new Date(queryValue +"-01 00:00:01").getTime())/1000;
        let lastTime = (new Date(year + "-" + month +"-01 00:00:01").getTime())/1000;
        console.log("month1111 first",firstTime);
        console.log("month1111 last",lastTime);
        filter["checkInDate@$gte"] = firstTime;
        filter["checkInDate@$lte"] = lastTime;
      }
    }else {
      this.set("searchHas",false);
    }
    queryParams.filter = filter;
    //按照房间序号排序
    queryParams.sort = {
      '[bed][room][seq]': 'asc',
      '[bed][name]': 'asc'
    };
    var nursingprojectList = this.get("nursingprojectList");//所有的护理方案
    this.infiniteQuery('customer',queryParams).then(function(customerList){
      if(!customerList&&customerList.get("length")===0){
        _self.set("global_pageConstructure.showLoader",false);//set 加载图片隐藏
      }
      console.log("month1111infiniteQuery nursingprojectList",nursingprojectList);
      customerList.forEach(function(cusItem){
        nursingprojectList.forEach(function(proItem){
          if(cusItem.get("id")==proItem.get("customer.id")){
            cusItem.set("projectLevelName",proItem.get("level.name"));//给customer-detail 的护理等级字段用
          }
        });
      });


      console.log("month1111infiniteQuery customerList",customerList);
      _self.set("customerList",customerList);
      _self.get("service_PageConstrut").set("showLoader", false);
    });

  }.observes('queryValue'),

  /*通过event service监控顶部菜单的选择事件，并进行相关方法调用*/
  listenner: function() {
    console.log("feedService reg");
    this.get('feedService').on('headerEvent_showSearch', this, 'showSearch');
    this.get('feedService').on('headerEvent_Scan', this, 'showScan');
  }.on('init'),
  //注销时清除事件绑定
  cleanup: function() {
    console.log("cleanup feed");
    this.get('feedService').off('headerEvent_showSearch', this, 'showSearch');
    this.get('feedService').off('headerEvent_Scan', this, 'showScan');
  }.on('willDestroyElement'),

  showSearch: function(){
    // var mainpageController = App.lookup('controller:business.mainpage');
    // mainpageController.switchMainPage('customer-search');
    var itemId = "customer_search";
    $("#" + itemId).addClass("tapped");
    Ember.run.later(function(){
      $("#" + itemId).removeClass("tapped");
      Ember.run.later(function(){
        var mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('customer-search');
      },100);
    },200);
  },
  showScan: function(){
    var itemId = "customer_scan";
    $("#" + itemId).addClass("tapped");
    Ember.run.later(function(){
      $("#" + itemId).removeClass("tapped");
      Ember.run.later(function(){
        var mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('scanQRCode',{type:'customer'});
        // mainpageController.switchMainPage('scan-qrcode');
        // alert("in action showScan switch");
      },100);
    },200);
  },

  actions:{
    switchTab(code){
      console.log('switchTab in,code:' + code);
      this.set("curTabCode",code);
    },
    goDetail(customer){
      console.log("go detail",customer);
      var id = customer.get("id");
      console.log("go detail id",id);
      var params ={
        id:id
      };
      // var mainpageController = App.lookup('controller:business.mainpage');
      // mainpageController.switchMainPage('customer-detail',params);
      var itemId = "customerItem_" + id;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('customer-detail',params);
        },100);
      },200);
    },
    toAddPage(){
      var mainpageController = App.lookup('controller:business.mainpage');
      //var id = this.get("customer").get("id");
     mainpageController.switchMainPage('customer-add');
   },
   closeSearchHas(){
     this.set("searchHas",false);
     this.set("queryValue",'');
    //  this.get("feedService").set("searchData","");
   },
  }
});
