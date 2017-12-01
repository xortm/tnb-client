import Ember from 'ember';
import GesturesMixin from 'ember-gestures/mixins/recognizers';

export default Ember.Component.extend(GesturesMixin,{
  feedService: Ember.inject.service('feed-bus'),
  global_curStatus: Ember.inject.service('current-status'),
  service_PageConstrut: Ember.inject.service('page-constructure'),
  classNameBindings: ['classStatic:position-relative'],

  headerBarHide: false,//是否显示下拉菜单
  popContent: false,//是否显示下拉菜单
  recognizers: 'tap press',//移动端手势
  // curRoutePath: null,//当前路径

  title: Ember.computed('service_PageConstrut.currentRouteInstance', function() {
    var pageConstruct = this.get('service_PageConstrut');
    var routeInst = pageConstruct.get("currentRouteInstance");
    console.log("routeInst in title",routeInst);
    if(!routeInst){
      return "";
    }
    var targetController = App.lookup("route:business.mainpage." + routeInst.get("routeName"));
    let headerTitle = targetController.get("header_title");
    return headerTitle;
    // return routeInst.get("routeInstance.header_title");
  }),
  //获取此用户角色是否具有多功能区权限
  currentMobileFunctionsNums: Ember.computed('global_curStatus.currentMobileFunctionsNums', function() {
    var globalCurStatus = this.get('global_curStatus');
    var currentMobileFunctionsNums = globalCurStatus.get("currentMobileFunctionsNums");
    console.log("currentMobileFunctionsNums in title",currentMobileFunctionsNums);
    return currentMobileFunctionsNums;
  }),
  //返回路径
  backRoutePathObserve: function() {
    console.log("service_PageConstrut.backPath change:" + this.get("service_PageConstrut.backPath"));
    console.log("service_PageConstrut.curRouteName change:" + this.get("service_PageConstrut.curRouteName"));
    let routeId = this.get("routeId");
    console.log("routeId change:" + routeId);
    let curRouteName = this.get("service_PageConstrut.curRouteName");
    let backPath = this.get("service_PageConstrut.backPath");
    let backRoutePath = this.get("backRoutePath");
    if(curRouteName == routeId){
      console.log("backRoutePath in obs:"+backRoutePath);
      console.log("backRoutePath in obs:"+backPath);
      this.set("backRoutePath",backPath);
    }
  }.observes('service_PageConstrut.backPath').on("init"),
  //隐藏下拉选择操作
  headerBarHideObserve: function() {
    console.log("global_curStatus.headerBarHide change:" + this.get("global_curStatus.headerBarHide"));
    return this.set("headerBarHide",this.get("global_curStatus.headerBarHide"));
  }.observes('global_curStatus.headerBarHide'),
  //返回路径
  curRoutePathObserve: function() {
    this.set("isExpandMode",false);
  }.observes('service_PageConstrut.curRouteName'),

  // isEdit:  Ember.computed('service_PageConstrut.curRouteName', 'service_PageConstrut.hideHeaderFunc', function(){
  //   var curRoutePath=this.get('service_PageConstrut').get('curRouteName');
  //
  //   if(curRoutePath==="consultation-edit-mobile"){
  //     return 8;
  //   }
  //
  //   return false;
  // }),
  // isEditBack:  Ember.computed('service_PageConstrut.curRouteName', 'service_PageConstrut.hideHeaderFunc', function(){
  //   var curRoutePath=this.get('service_PageConstrut').get('curRouteName');
  //
  //   if(curRoutePath==="backvist-edit-mobile"){
  //     return 8;
  //   }
  //   if(curRoutePath==="workdelivery-edit-mobile"){
  //     return 9;
  //   }
  //   if(curRoutePath==="marketskill-edit-mobile"){
  //     return 10;
  //   }
  //   if(curRoutePath==="chargestandard-edit-mobile"){
  //     return 11;
  //   }
  //   return false;
  // }),
  hasBoxShadow: Ember.computed('routeId', function(){
    var routeId = this.get('routeId');
    if(routeId=="service-care" || routeId=="service-nurse" || routeId=="workdelivery-self-mobile" || routeId=="consultation-detail-mobile"|| routeId=="service-order-look"){
      return false;
    }
    return true;
  }),
  hasDateSelect: Ember.computed('routeId', function(){
    var routeId = this.get('routeId');
    if(routeId=="attendance-check" || routeId=="employee-assessment"){
      return true;
    }
    return false;
  }),
  isSquare: Ember.computed('routeId', function(){
    var curRoutePath=this.get('routeId');
    if(curRoutePath==="function-page"){
      return 0;
    }
    //根据不同页面显示不同的功能
    console.log("curRoutePath isssssssssssssssss:" + curRoutePath);
    if(curRoutePath==="task-square"){
      return 1;
    }
    if(curRoutePath==="myinfo-item-edit"){
      return 2;
    }
    if(curRoutePath==="task-detail"){
      return 3;
    }
    if(curRoutePath==="myinfo-certification"){
      return 4;
    }
    if(curRoutePath==="customer-service-m"){
      return 5;
    }
    if(curRoutePath==="customer-search"){
      return 6;
    }
    if(curRoutePath==="service-care"||curRoutePath==="service-nurse"){
      return 7;
    }
    if(curRoutePath==="cs-info"||curRoutePath==="consumer-service"||curRoutePath==="customer-dynamic"||curRoutePath==="accounts-message"||curRoutePath==="customer-warning"||curRoutePath==="service-query"||curRoutePath==="other-business"||curRoutePath==="consultation-management-mobile"||curRoutePath==="service-check-list-mobile"||curRoutePath==="view-score"||curRoutePath==="my-order-looking"){
      return 8;
    }
    if(curRoutePath==="customer-business"){
      return 9;
    }
    if(curRoutePath==="nurse-log"){
      return 10;
    }
    if(curRoutePath==="publichealth-data"){
      return 11;
    }
    if(curRoutePath==="attendance-check"||curRoutePath==="employee-assessment"||curRoutePath==="workdelivery-view-mobile"){
      return 12;
    }
    if(curRoutePath==="connect-manage"){
      return 14;
    }
    if(curRoutePath==="service-order-looking"){
      return 15;
    }
    return false;
  }),

  actions:{
    aa(){
      console.log("run in aa");
      this.get("global_curStatus").set("footBarMenusShowFlag","cs-user");
    },
    transPage(homePage){
      console.log("homePage in comp",homePage);
      console.log("transPage in comp",this.backRoutePath);
      console.log("service_PageConstrut.backPath change:" + this.get("service_PageConstrut.backPath"));
      console.log("service_PageConstrut.curRouteName change:" + this.get("service_PageConstrut.curRouteName"));
      //防止重复点击
      if(this.get("pageFlag_backTapProcess")){
        return;
      }
      this.set("pageFlag_backTapProcess",true);
      let routeId = this.get("routeId");
      let itemId = "#" + routeId + "-pageBackBtn";
      //增加点击动画效果
      $(itemId).addClass("tapped");
      var _self = this;
      Ember.run.later(function(){
        $(itemId).removeClass("tapped");
        Ember.run.later(function(){
          _self.set("pageFlag_backTapProcess",false);
          var curRouteName = App.lookup('controller:business.mainpage').get('curRouteName');
          var controllerName = "business.mainpage." + curRouteName;
          var controller = App.lookup("controller:" + controllerName);
          //发送回退前切换事件
          controller.send("switchBackAction");
          if(homePage){
            _self.get("global_curStatus").set("functionPageRoute",_self.get("service_PageConstrut.curRouteName"));
            _self.sendAction('transPage',homePage);
          }else{
            console.log('backtest ',curRouteName+"--->"+_self.backRoutePath);
            _self.sendAction('transPage', _self.backRoutePath,curRouteName);
          }
        },100);
      },200);
      this.incrementProperty('global_curStatus.pageBackTime');
      this.set('global_curStatus.formEditModel',null);
    },
    showToast(){
      console.log("showToast keep");
      this.get("service_PageConstrut").showToast();
    },
    popSelectContent(){
      console.log("popSelectContent in");
      this.toggleProperty("popContent");
    },
    header_queryTask(code){
      console.log("header_queryTask in comp:" + code);
      console.log("feedService is",this.get('feedService'));
      this.get('feedService').trigger('headerEvent_queryTask', code);
    },
    header_saveFun(code){
      console.log("saveFun_save", this.backRoutePath);
      this.get('feedService').trigger('saveFun_save', code);
      // this.sendAction('transPage', this.backRoutePath);
    },
    header_saveFunCS(code){
      console.log("saveFun_save", this.backRoutePath);
      this.get('feedService').trigger('saveFun_save_cs', code);
      // this.sendAction('transPage', this.backRoutePath);
    },
    header_saveFunMS(code){
      console.log("saveFun_save", this.backRoutePath);
      this.get('feedService').trigger('saveFun_save_ms', code);
      // this.sendAction('transPage', this.backRoutePath);
    },
    header_saveFunCon(code){
      console.log("saveFun_save", this.backRoutePath);
      this.get('feedService').trigger('saveFun_save_con', code);
      // this.sendAction('transPage', this.backRoutePath);
    },
    header_saveFunBack(code){
      console.log("saveFun_save", this.backRoutePath);
      this.get('feedService').trigger('saveFun_save_back', code);
      // this.sendAction('transPage', this.backRoutePath);
    },
    header_saveFunDelivery(code){
      console.log("saveFun_save", this.backRoutePath);
      this.get('feedService').trigger('saveFun_save_deli', code);
      // this.sendAction('transPage', this.backRoutePath);
    },
    header_applyTask(code){
      console.log("header_applyTask in comp:" + code);
      console.log("feedService is",this.get('feedService'));
      this.get('feedService').trigger('headerEvent_applyTask', code);
    },
    header_approve(){
      console.log("approve_saveeeeeeeeeee", this.backRoutePath);
      console.log("this.get('feedService').trigger()",this.get('feedService'));
      this.get('feedService').trigger('approve_save');
    },
    header_customerSearch(){
      this.get('feedService').trigger('headerEvent_showSearch');
    },
    header_Scan(){
      var curRoutePath= this.get('service_PageConstrut').get('curRouteName');
      if(curRoutePath==="service-care"){
        this.get('feedService').trigger('headerEvent_Scan_serviceCare');
      }else if(curRoutePath==="service-nurse"){
        this.get('feedService').trigger('headerEvent_Scan_serviceNurse');
      }else if(curRoutePath==="customer-business"){
        this.get('feedService').trigger('headerEvent_Scan_customerBusiness');
      }else if(curRoutePath==="nurse-log"){
        this.get('feedService').trigger('headerEvent_Scan_nurseLog');
      }
    },
    //搜索动作
    header_searchAct(searchValue){
      console.log("header_searchAct searchValue",searchValue);
      //发送给搜索页面
      this.get('feedService').trigger('headerEvent_searchAct',searchValue);
    },
    toCusSerM(){
      var _self = this;
      var itemId = "header_bar_seach";
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          _self.get('feedService').trigger('headerEvent_toCusSerM');
        },100);
      },200);
    },
    searchTimeChange(){
      let curRoutePath=this.get('service_PageConstrut').get('curRouteName');
      console.log('curRoute in timeChange',curRoutePath);
      if(curRoutePath=='employee-assessment'){
        this.incrementProperty('global_curStatus.assessmentTimeSearchFlag');
      }
      if(curRoutePath=='attendance-check'){
        this.incrementProperty('global_curStatus.attendanceTimeSearchFlag');
      }
    },
  }
});
