import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  feedService: Ember.inject.service('feed-bus'),
  infiniteContentPropertyName: "customerSearch",
  infiniteModelName: "customer",
  infiniteContainerName:"customerSearchContainer",
  searchValue:null,//搜索内容
  type:'all',//搜索的类型
  dateService: Ember.inject.service("date-service"),

  init: function(){
    var _self = this;
    this.set("searchPrompt","搜索指定内容");
    Ember.run.schedule("afterRender",this,function() {
      _self.set("clickActFlag","user");
    });
    //注册搜索动作
    this.get('feedService').on('headerEvent_searchAct', this, 'searchAct');
    this.get('feedService').on('headerEvent_toCusSerM', this, 'toCusSerM');
  },
  customerObs: function(){
    var _self = this;
    console.log("QQQQQ",_self.get('id'));
    this.get("store").findRecord('customer',_self.get('id')).then(function(customer){
      _self.set("customer",customer);
      //  var customerInfo=_self.get("store").peekRecord('customer',_self.get('id'));
      //  _self.set("customerInfo",customerInfo);
    });
    this.get("store").findRecord('customer',_self.get('id')).then(function(customerInfo){
      _self.set("customerInfo",customerInfo);
    });
  },
  // searchData:Ember.computed(function(){
  //   //从全局上下文服务里拿到外层传递的数据
  //   let searchData = this.get("feedService").get("searchData");
  //   return searchData;
  // }),
  searchValueObs:function(){
    var _self = this;
    let searchValue = this.get("feedService").get("searchData");
    // let searchValue = this.get("searchValue");
    this.set("searchValueStr",searchValue);
      console.log("searchValue11111 initvalueDataObs1111",searchValue);
      // let arr = searchValue.split("-");
      // if(arr.length===2&&arr[0].length===4&&arr[1].length<=2){
      //   //判断如果为日期格式，则显示日期查询
      //   this.set("isDateSearch",true);
      //   this.set("searchValueDate",arr[0]+ "年" + arr[1] + "月");
      //   this.set("searchValueDateString",searchValue);
      //   // var theTime = arr[0]+ "年" + arr[1] + "月";
      //   // this.set("searchValueStr","查询入住日期为 "+theTime+" 的客户");
      //   // this.store.query('customer',{}).then(function(customerInfo){
      //   //   var customerList = new Ember.A();
      //   //   customerInfo.forEach(function(item){//checkInDate入住日期
      //   //     var customerTime = _self.get("dateService").formatDate(item.get("checkInDate"),"yyyy-MM");
      //   //     if(searchValue == customerTime){
      //   //       customerList.pushObject(item);
      //   //     }
      //   //   });
      //   //   console.log("customerList111 date",customerList);
      //   //   _self.set("customerList",customerList);
      //   // });
      // }else{
      //   this.set("isDateSearch",false);
      //   this.set("searchValueStr",searchValue);
      //   // var regNum = /^[1-9]\d*$/;//验证是数字的正则
      //   // if(regNum.test(searchValue)){
      //   //   if(/\d{11}/.test(searchValue)){//电话号码
      //   //     // this.set("searchValueStr","查询手机号为  "+ searchValue +" 的客户");
      //   //     this.store.query('customer',{filter:{phone:searchValue}}).then(function(customerList){
      //   //       console.log("customerList111 phone",customerList);
      //   //       _self.set("customerList",customerList);
      //   //     });
      //   //   }else {//反之 床位号
      //   //     // this.set("searchValueStr","查询床位号为  "+ searchValue +" 的客户");
      //   //     this.store.query('customer',{filter:{bed:{room:{name:searchValue}}}}).then(function(customerList){
      //   //       console.log("customerList111 bed",customerList);
      //   //       _self.set("customerList",customerList);
      //   //     });
      //   //   }
      //   //
      //   // }else {//名字
      //   //   // this.set("searchValueStr","查询名字为  "+ searchValue +" 的客户");
      //   //   this.store.query('customer',{filter:{name:searchValue}}).then(function(customerList){
      //   //     console.log("customerList111 name",customerList);
      //   //     _self.set("customerList",customerList);
      //   //   });
      //   // }
      //
      // }
    // }
  }.observes("feedService.searchData"),
  //搜索动作
  searchAct(valueEvent){
    let searchValue = $(valueEvent.target).val();
    this.set("searchValue",searchValue);
  },
  toCusSerM(elementId){
    var queryValue = this.get("searchValueStr");
    var queryType = this.get("type");
    var $changePlaceholder = $("#changePlaceholder");
    if(!queryValue){
      $changePlaceholder.attr("placeholder","请输入搜索条件");
      return;
    }
    // else {//这段其实不需要
    //   if(queryType=="all"){
    //     $changePlaceholder.attr("placeholder","搜索房间或老人");
    //   }else if (queryType=="name") {
    //     $changePlaceholder.attr("placeholder","搜索老人");
    //   }else if (queryType=="room") {
    //     $changePlaceholder.attr("placeholder","搜索房间");
    //   }
    // }

    var _self = this;
    var params = {
      queryType:queryType,
      queryValue:queryValue
    };
    console.log("month1111 customerListObs in,queryType:111111the",queryValue);
    console.log("month1111 customerListObs in,queryType:params",params);
    // var mainpageController = App.lookup("controller:business.mainpage");
    // mainpageController.switchMainPage("customer-service-m",params);
    var itemId = elementId;
    if(itemId){
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup("controller:business.mainpage");
          mainpageController.switchMainPage("customer-service-m",params);
          _self.set("searchValueStr","");//跳转后 set为空
          _self.get("feedService").set("searchData","");
        },100);
      },200);
    }else {
      var mainpageController = App.lookup("controller:business.mainpage");
      mainpageController.switchMainPage("customer-service-m",params);
      _self.set("searchValueStr","");//跳转后 set为空
      _self.get("feedService").set("searchData","");
    }
  },

  actions:{
    switchTab(code){
      //console.log('switchTab in,code:' + code);
      this.set("curTabCode",code);
    },
    switchShowAction(){
      this.set("nameFlag",false);//初始都是false
      this.set("roomFlag",false);
      this.set("type","all");
    },
    backCustomerServiceM(elementId){//去customer-service-m 查询
      this.toCusSerM(elementId);
    },
    queryAll(elementId){
      var params = {
        queryType:"",
        queryValue:""
      };
      var _self = this;
      var itemId = elementId;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup("controller:business.mainpage");
          mainpageController.switchMainPage("customer-service-m",params);
          _self.set("searchValueStr","");//跳转后 set为空
          _self.get("feedService").set("searchData","");
        },100);
      },200);

    },
    searchType(type,eleId){
      var searchData = this.get("feedService").set("searchData");
      var $changePlaceholder = $("#changePlaceholder");
      if(type=='room'){
        this.set("nameFlag",false);
        this.set("roomFlag",true);
        $changePlaceholder.attr("placeholder","搜索房间");
      }else {
        this.set("nameFlag",true);
        this.set("roomFlag",false);
        $changePlaceholder.attr("placeholder","搜索老人");
      }
      this.set("type",type);
    },
    goDetail(){
      //console.log("go detail");
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('customer-info');
    },
    csItemDetail(){
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('customer-service-detail');
    },
  }
});
