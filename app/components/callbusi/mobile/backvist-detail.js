import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';
import Echarts from "npm:echarts";
import InfiniteScroll from '../../../controllers/infinite-scroll';
const {useDrugResult1,liveIntent1} = Constants;

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
  scrollFlag:false,
  btnFlag:false,
  infiniteContentPropertyName: 'backvistData',
  infiniteModelName: "backvist",
  infiniteContainerName: "backvistDetailContainer",
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
  dataObs: function() {
      var _self = this;
      var infoId = this.get('dataId');
      var source = this.get('source');
      console.log("dataObs planDataPushFlag:",this.get("planDataPushFlag"));
      console.log("dataObs itemIdFlag:",this.get("itemIdFlag")); 
      if (source ==="add" ) {
        let curuser = this.get('global_curStatus').getUser();
        let backvistInfo = this.get('store').createRecord('backvist', {
            consultInfo:_self.get('store').peekRecord('consultinfo',_self.get('infoId')),
            createDateTime:_self.get("dataLoader").getNowTime(),
            vistUser:curuser.get('employee'),
            liveIntent:_self.get('dataLoader').findDict(_self.get('constants').liveIntent1),
            delStatus: 0
        });
        backvistInfo.save().then(function(data) {
          _self.set("backvistItemId",data.get("id"));
          _self.set("dataId",data.get("id"));
          _self.set("backvistData", data);
          _self.directInitScoll(true);
        });
      }else{
        _self.get("store").findRecord("backvist", infoId).then(function(data) {
                console.log("backvistData:" + data);
                _self.set("backvistItemId",data.get("id"));
                _self.set("dataId",data.get("id"));
                _self.set("backvistData", data);
                _self.directInitScoll(true);
        });
      }
      //重新进行tab选择
      console.log("need change refreshFlag");
      this.set("refreshFlag",this.get("itemIdFlag"));
      console.log("refreshFlag after:" + this.get("refreshFlag"));
  }.observes("planDataPushFlag", "itemIdFlag").on("init"),
  init: function(){
    this._super(...arguments);
    this.get("service_PageConstrut").set("showLoader", false);//先关闭mainpage的
    this.set("showLoadingImgIn",true);
    this.incrementProperty("planDataPushFlag");
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
    //页面跳转
    modification:function (amend,elementId) {
      var _self = this;

      var params = {source:amend,infoId:_self.get('dataId'),editType:'input'};
      var itemId = elementId;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainController = App.lookup("controller:business.mainpage");
          mainController.switchMainPage('backvist-edit-mobile',params);
        },100);
      },200);
    },
    //跳转选择 self-choose
    toSelfChoose:function (amend,elementId) {
      var _self = this;
      var flag='select';
      if(amend==='createDateTime'){
        flag='date';
      }
      if(amend==='vistUser'){
        flag='staff';
      }
      var params = {source:amend,infoId:_self.get('dataId'),editType:flag};
      var itemId = elementId;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainController = App.lookup("controller:business.mainpage");
          mainController.switchMainPage('backvist-edit-mobile',params);
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
