/*抽象路由，业务页面的父类*/
import Ember from 'ember';
import Infinite from '../../controllers/infinite-scroll';

export default Ember.Route.extend({
  service_PageConstrut:Ember.inject.service("page-constructure"),
  pathConfiger: Ember.inject.service("path-configer"),
  tableSelector:"#datatable1_wrapper",
  routeShortName: Ember.computed('routeName', function() {
    //取得短名称
    var shortName = "";
    var partList = this.get('routeName').split(".");
    for(var i=0;i<partList.length;i++){
      if(i>1){
        shortName = shortName + "." + partList[i];
      }
    }
    if(shortName.length>0){
      shortName = shortName.substr(1,shortName.length);
    }
    console.log("current routeName:" + shortName);
    return shortName;
  }),
  renderTemplate() {
    console.log("renderTemplate in");
    //只有移动端模式才使用自定义outlet
    if(!this.get("global_curStatus.isMobile")){
      this.render();
      return;
    }
    //定义本路由的out输出
    this.render({
          into: 'business.mainpage',
          outlet: this.get("routeShortName")
    });
  },
  getCurrentController: function(){
    return this.get("controller");
  },
  setupController: function(controller,model){
    var _self = this;
    this._super(controller,model);
    Ember.run.schedule("afterRender",controller,function() {
      console.log("ctr afterRender",_self.get("tableSelector"));
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.showTableLoading($(_self.get("tableSelector")));
    });
    console.log("controller tableSelector:" + this.get("tableSelector"));
    //设置加载标识
    this.set("DISPLAY_initFlag",true);
    //移动端页面统一加无线滚动屏
    if(this.get("global_curStatus.isMobile")){
      // controller.reopen(Infinite);
    }else{
      var exportDef = controller.get("exportDef");
      if(exportDef){controller.set("exportAll",true);}
      //pc端的分页只能在此设置了
      controller.reopen({
        actions:{
          pagiInfinityLoad:function() {
              console.log("pagiInfinityLoad in");
              _self._infinityLoad();
          },
          exportAllExcel(){
            var exportDef = this.get("exportDef");
            var params = _self.buildQueryParams();
            params.export = exportDef.export;
            console.log("params111",params);
            this.store.query(exportDef.model,params).then(function(employees){
              var employee = employees.get("firstObject");
              var url = _self.get("pathConfiger.exportAllUrl")+employee.get("url");
              // window.location.href = url;
              console.log("params111theUrl",employee);
              console.log("params111theUrl",url);
              window.open(url);
            });
          },
        }
      });
    }
    //把当前路由的名称设置到mainpage中，以便后续跟踪
    var mainController = App.lookup("controller:business.mainpage");
    mainController.set("curRouteName",this.get("routeShortName"));
    console.log("setupController in base");
    this.set("controller",controller);
  },
  header_title: null,//标头
  header_description: null,//标头描述内容

  actions:{
    //加载事件
    loading: function(transition,route) {
      console.log("loading action");
    },
    willTransition: function(transition) {
      let routeName = this.get("routeName");
      let targetName = transition.targetName;
      console.log("routeName os:" + routeName + " and targetName:" + targetName);
      //通过transition标志，识别是否history的页面跳转，进行屏蔽
      var preTransitionFlag = this.get("service_PageConstrut.preTransitionFlag");
      var curTransitionFlag = this.get("service_PageConstrut.curTransitionFlag");
      console.log("curTransitionFlag:" + curTransitionFlag + "|preTransitionFlag:" + preTransitionFlag);
      if(curTransitionFlag&&preTransitionFlag===curTransitionFlag&&routeName!==targetName){
        console.log("need abort");
        transition.abort();
        return;
      }
      //设置transition标志，用于识别是否history的页面跳转
      this.set("service_PageConstrut.curTransitionFlag",preTransitionFlag);
    },
    //监控下级页面的跳转事件
    didTransition: function() {
      console.log("currentPathDidChange in:" + this.get("routeShortName"));
      var mainpageController = this.controllerFor("business.mainpage");
      //通知mainpage获取route实例,同时通知状态为已激活
      this.get("service_PageConstrut").dispatchRouteInst(this.get("routeShortName"),2);
      //导航信息处理
      var busiUrlPath = window.location.href.split("#")[1];
      busiUrlPath = this.get('routeName');
      console.log("busiUrlPath in:" + busiUrlPath);
      if(busiUrlPath==="business"){
        return;
      }
      //设置导航树
      mainpageController.set("breadCrumbsPath",busiUrlPath);
      //同时发送给business页面，用于移动端导航条功能
      this.controllerFor("business").set("breadCrumbsPath",busiUrlPath);
      //修改标题
      console.log("title change:" + this.get("header_title"));
      this.controllerFor("business.mainpage").set("busipageTitle",this.get("header_title"));
    },
    deactivate: function(){
      console.log("deactivate in:");
    }
  },
});
