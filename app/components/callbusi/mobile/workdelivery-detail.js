import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';
//
import InfiniteScroll from '../../../controllers/infinite-scroll';
const {useDrugResult1} = Constants;

export default BaseUiItem.extend(InfiniteScroll,{
  store: Ember.inject.service("store"),
  feedService: Ember.inject.service('feed-bus'),
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  feedBus: Ember.inject.service("feed-bus"),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  global_curStatus: Ember.inject.service("current-status"),
  constants: Constants,
  //mainController: Ember.inject.controller('business.mainpage'),
  serviceListFlag: 0,
  countListFlag: 0,
  queryFlag: 0,
  i: 0,
  k: 0,
  planDataPushFlag:0,
  scrollPrevent:true,
  btnFlag:false,
  infiniteContentPropertyName: 'workdeliveryData',
  infiniteModelName: "workdelivery",
  infiniteContainerName: "workdeliveryDetailContainer",
  screenOffset:160,
  squareScanShow:true,
  panmoveMode: "showFunc",//划动处理，showFunc：显示按钮 delete：删除本条
  curExpService: null,//当前展开的服务内容
  tabFuncs:Ember.computed("taskList",function() {
    var a = new Ember.A();
    var t1 = Ember.Object.create({
      code:"tabInfo",
      text:"跟进信息",
      numberTip:0
    });
    a.pushObject(t1);

    return a;
  }),
  dataType:"task",
  oriCountItemId: null,

  init: function(){
    this._super(...arguments);
    // this.set("directInitScollFlag",true);
    // this.incrementProperty("queryFlag");
    this.get("service_PageConstrut").set("showLoader", false);//先关闭mainpage的
    this.set("showLoadingImgIn",true);
    var _self = this;
    Ember.run.schedule("afterRender",this,function() {
      //设置默认显示tab页
      // console.log("menuitem in tab init");
      // _self.set("clickActFlag","tabInfo");
      // this.set("countListFlag",0);//计次
      // this.set("serviceListFlag",0);//定时
      // this.incrementProperty("planDataPushFlag");
      // _self.queryFlagIn();
    });
  },
  didInsertElementObs:function(){
    this.send("didInsertElement");
  }.observes("directInitScollFlag"),
  preventRepeatSubmitFlagObs:function(){
    var preventRepeatSubmitFlag = this.get("global_curStatus.preventRepeatSubmitFlag");
    console.log("queryObs run preventRepeatSubmitFlag",preventRepeatSubmitFlag);
    if(!preventRepeatSubmitFlag){
      return;
    }
    App.lookup('controller:business.mainpage').closeMobileShade("保存成功");
  }.observes("global_curStatus.preventRepeatSubmitFlag"),
  queryFlagIn: function(){
    this.incrementProperty("queryFlag");
    console.log("in itqueryFlagIn");
    this.set("countListFlag",0);//计次
    this.set("serviceListFlag",0);//定时
    // this.set("planDataPushFlag",false);
    this.incrementProperty("planDataPushFlag");
    // this.set("directInitScollFlag",false);
  },
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
    let serviceItem = this.get("feedBus").get("serviceData");
    if(serviceItem){
      console.log("sort serviceItem:",serviceItem);
      serviceAllList.forEach(function(service){
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
    this.set("serviceList",serviceAllList.sortBy("hasApply","timeStrOne"));
    console.log("sort serviceList after:",this.get("serviceList"));
    this.directInitScoll();
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


//集合项 服务computed属性
  createServiceItem:function(){

  },
  //集合项  typeOneProject 用药计划
  typeOneProject:function(serviceItem,item){

  },
  //集合项  typeOneItem 定时任务
  typeOneItem:function(serviceItem,item){

  },
  //集合项  typeTwo 不定时任务
  typeTwo:function(serviceItem,item,itemExes){

  },

  actions:{
    //确定接班
    receiveDone:function(){
      var _self = this;
      _self.set("reasonRece","");
      _self.set("reasonRe","");
      _self.get('store').findRecord("workdelivery",_self.workdeliveryData.get("id")).then(function(data){
        data.set('status',_self.get('dataLoader').findDict('workDeliveryStatus2'));
        data.set('receiveTime',_self.get("dataLoader").getNowTime());
        data.save();
        _self.directInitScoll();
      });

    },
    //确定交班
    sendDone:function(){
      var _self = this;
      _self.set("reasonRece","");
      _self.set("reasonRe","");
      if(_self.workdeliveryData.get("receiver").get("id")=== undefined){
          _self.set("reasonRece","请选择接班人");

          return;
      }
      if(!_self.workdeliveryData.get("remark")||_self.workdeliveryData.get("remark")===null||_self.workdeliveryData.get("remark")===""){
          _self.set("reasonRe","请填写备注");

          return;
      }
      this.get('store').findRecord("workdelivery",this.workdeliveryData.get("id")).then(function(data){
        data.set('status',_self.get('dataLoader').findDict('workDeliveryStatus3'));
        data.set('createDateTime',_self.get("dataLoader").getNowTime());
        _self.set("reasonRece","");
        _self.set("reasonRe","");
        data.save();
        _self.directInitScoll();
      });

    },

    statusFun1:function(){
      var _self = this;
      _self.set("reasonRece","");
      _self.set("reasonRe","");
      _self.get('store').findRecord("workdelivery",_self.workdeliveryData.get("id")).then(function(data){
        data.set('status',_self.get('dataLoader').findDict('workDeliveryStatus2'));
        data.set('receiveTime',_self.get("dataLoader").getNowTime());
        data.save();
      });
      this.set('changeSexModel',false);
    },
    statusFun2:function(){
      var _self = this;
      _self.set("reasonRece","");
      _self.set("reasonRe","");
      if(_self.workdeliveryData.get("receiver").get("id")=== undefined){
          _self.set("reasonRece","请选择接班人");
          _self.set('changeSexModel',false);
          return;
      }
      if(!_self.workdeliveryData.get("remark")||_self.workdeliveryData.get("remark")===null||_self.workdeliveryData.get("remark")===""){
          _self.set("reasonRe","请填写备注");
          _self.set('changeSexModel',false);
          return;
      }
      this.get('store').findRecord("workdelivery",this.workdeliveryData.get("id")).then(function(data){
        data.set('status',_self.get('dataLoader').findDict('workDeliveryStatus3'));
        data.set('createDateTime',_self.get("dataLoader").getNowTime());
        _self.set("reasonRece","");
        _self.set("reasonRe","");
        data.save();
      });
      this.set('changeSexModel',false);
    },
    statusFun:function(){
      this.set('changeSexModel',true);
    },
    closeFun:function(){
      this.set('changeSexModel',false);
    },
    remarkFun:function(){
      this.set('changeRemarkModel',true);
    },
    closeRemarkFun:function(){
      this.set('changeRemarkModel',false);
    },
    //页面跳转
    modification:function (amend,elementId) {
      var _self = this;
      _self.set("reasonRece","");
      _self.set("reasonRe","");
      var params = {source:amend,infoId:_self.get('workdeliveryData').get('id'),editType:'input'};
      var itemId = elementId;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainController = App.lookup("controller:business.mainpage");
          mainController.switchMainPage('workdelivery-edit-mobile',params);
        },100);
      },200);
    },
    //跳转选择 self-choose
    toSelfChoose:function (amend,elementId) {
      var _self = this;
      _self.set("reasonRece","");
      _self.set("reasonRe","");
      var flag='select';
      if(amend==='receiver'){
        flag='staff';
      }
      var params = {source:amend,infoId:_self.get('workdeliveryData').get('id'),editType:flag};
      var itemId = elementId;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainController = App.lookup("controller:business.mainpage");
          mainController.switchMainPage('workdelivery-edit-mobile',params);
        },100);
      },200);
    },
    switchPage(pageName) {
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage(pageName);
    },
    finishSave(item,callback){
      console.log("init queryEndDateasdadasdas");
      this.finishService(item,callback);
    },
    switchTab(code){
      console.log('switchTab in,code:' + code);
      this.set("curTabCode",code);
      if(code=="tabInfo"){
        console.log("LoadingImgInss666");
        this.set("showLoadingImgIn",false);
      }else {

      }
      // this.directInitScoll();
    },

    //这个是判断 list是否在hbs加载完毕标示
    didInsertAct(code){

    },
    //添加单项的遮罩this.get("infiniteContainerName") +
     addItemMask(itemName){
       let el = $("div[name='" + itemName + "']");
       let mkName = 'elmk_' + itemName;
       el.find("div[name='" + mkName + "']").remove();
       let mkContent = "<div name='" + mkName + "' style='position:absolute;background:white;width:100%;height:100%;'>正在加载...</div>";
      //  el.append(mkContent);
      //  el.find("div[name='listContainer']").hide();
     },
     //取消单项的遮罩
     removeItemMask(itemName){
       let el = $("div[name='" + itemName + "']");
       let mkName = 'elmk_' + itemName;
       el.find("div[name='" + mkName + "']").remove();
       el.find("div[name='listContainer']").show();
     },
    //这个是判断 list是否在hbs加载完毕标示
    didInsertActCustomer(code){
      var countList = this.get("countList");
      var k = this.get("k");
      k++;
      this.set("k",k);
      console.log("k and countListLenght",k,countList.get("length"));
      if(k >= countList.get("length")){
        this.set("btnFlag",false);
        console.log("LoadingImgInss101010");
        this.set("showLoadingImgIn",false);//关闭加载图片
        this.set("k",0);
        console.log("k and countListLenght",k);
      }
    },
    goCountDetail(){
      var serviceItem = this.get("serviceItem");
      console.log("serviceItem in goDetail:",serviceItem);
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
    },
    queryTime(param1,param2){
      this.set("startTime",param1);
      this.set("endTime",param2);
      this.incrementProperty("queryFlag");
    },
    // queryFlagAction(){
    //   this.incrementProperty("queryFlag");
    // },
  },
});
