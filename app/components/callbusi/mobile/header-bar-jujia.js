import Ember from 'ember';
import GesturesMixin from 'ember-gestures/mixins/recognizers';

export default Ember.Component.extend(GesturesMixin,{
  feedService: Ember.inject.service('feed-bus'),
  service_PageConstrut: Ember.inject.service('page-constructure'),
  statusService: Ember.inject.service("current-status"),

  popContent: false,//是否显示下拉菜单
  recognizers: 'tap press',//移动端手势
  showModal: false, //弹出层默认是否显示
  // curRoutePath: null,//当前路径

  title: Ember.computed('service_PageConstrut.currentRouteInstance', function() {
    var pageConstruct = this.get('service_PageConstrut');
    var routeInst = pageConstruct.get("currentRouteInstance");
    console.log("routeInst in title",routeInst);
    if(!routeInst){
      return "";
    }
    return routeInst.get("routeInstance.header_title");
  }),
  //返回路径
  backRoutePathObserve: function() {
    console.log("service_PageConstrut.backPath change:" + this.get("service_PageConstrut.backPath"));
    return this.set("backRoutePath",this.get("service_PageConstrut.backPath"));
  }.observes('service_PageConstrut.backPath').on("init"),
  curCustomerObs: function() {
    let curCustomer = this.get("statusService").getCustomer();
    console.log("curCustomer in jujia",curCustomer);
    if(!curCustomer||!curCustomer.get("id")){
      return;
    }
    this.set("curCustomer",curCustomer);
  }.observes("statusService.curStatus.currentCustomer").on("init"),
  actions:{
    transPage(){
      console.log("transPage in comp",this.backRoutePath);
      //防止重复点击
      if(this.get("pageFlag_backTapProcess")){
        return;
      }
      this.set("pageFlag_backTapProcess",true);
      //增加点击动画效果
      $("#pageBackBtn").addClass("tapped");
      var _self = this;
      Ember.run.later(function(){
        $("#pageBackBtn").removeClass("tapped");
        Ember.run.later(function(){
          _self.set("pageFlag_backTapProcess",false);
          var curRouteName = App.lookup('controller:business.mainpage').get('curRouteName');
          _self.sendAction('transPage', _self.backRoutePath,curRouteName);
        },100);
      },200);
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
      this.get('feedService').trigger('headerEvent_Scan');
    },
    //搜索动作
    header_searchAct(searchValue){
      console.log("header_searchAct searchValue",searchValue);
      //发送给搜索页面
      this.get('feedService').trigger('headerEvent_searchAct',searchValue);
    },
    //点击显示弹出层
    showModalAction() {
      this.set('showModal', true);
    },
    //弹出层取消显示
    invitation() {
      this.set('showModal', false);
    },
  }
});
