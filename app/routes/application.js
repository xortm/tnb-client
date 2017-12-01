import Ember from 'ember';
import CommonUtil from '../utils/common';

export default Ember.Route.extend({
  queryParams: {
      type: {
          refreshModel: true
      },
  },

  dataService: Ember.inject.service("date-service"),


  beforeModel:function(transition){
    // localStorage.clear();
    console.log("location first:" + window.location.href);
    var href = window.location.href;
    //是否在加载的时候去掉loading
    var close = CommonUtil.analysisParam(href,"close");
    //用户类型，包括公众号C端用户，B端用户
    var type = CommonUtil.analysisParam(href,"type");
    //系统类型，1机构2居家
    var systype = CommonUtil.analysisParam(href,"systype");
    var homePage = CommonUtil.analysisParam(href,"homePage");
    console.log("type in params:"  + type);
    if(close&&close.indexOf("#")>0){
      close = close.substring(0,close.indexOf("#"));
    }
    if(type&&type.indexOf("#")>0){
      type = type.substring(0,type.indexOf("#"));
    }
    if(systype&&systype.indexOf("#")>0){
      systype = systype.substring(0,systype.indexOf("#"));
    }
    if(homePage&&homePage.indexOf("#")>0){
      homePage = homePage.substring(0,homePage.indexOf("#"));
    }
    console.log("homePage in loader:",homePage);
    if(homePage && homePage === "consumer-service" || homePage === "publichealth-data" || homePage === "customer-dynamic" || homePage === "accounts-message"){
      localStorage.setItem(Constants.uickey_homePage,homePage);
    }else{
      localStorage.setItem(Constants.uickey_homePage,"");
    }
    console.log("type in params after:"  + type);
    //如果类型是公众号，则设置到全局中
    if(close==="yes"){
      console.log("run in yes");
      this.get("global_curStatus").set("isCloseLoadingPage",true);
      console.log("isCloseLoadingPage in model:",this.get("global_curStatus.isCloseLoadingPage"));
    }
    if(type==="consumer"){
      this.get("global_curStatus").set("isConsumer",true);
      //修改标题
      document.title = '感恩陪伴老人关爱';
    }
    //如果类系统类型是居家，则设置到全局中
    if(systype==="2"){
      this.get("global_curStatus").set("isJujia",true);
      //修改title
      document.title = '康颐老人关爱';
    }
    //第一次必须只访问index页面(移动端)
    if(this.get("global_curStatus").get("isMobile")){
      if(href.indexOf("business")>0){
        console.log("need reindex");
        this.get("global_curStatus").toIndexPage(type);
        return;
      }
    }
    // console.log("today timestamp:" + this.get("dataService").getTodayTimestamp());
    // console.log("7day timestamp:" + this.get("dataService").getDaysBeforeTimestamp(7));
    // this.sendPost();
  },
  makeCall: function(phone) {
    var curUser = this.get("global_curStatus").getUser();
    // this.store.createRecord('user', {
    //   address: curUser.get("address"),
    //   age: curUser.get("age"),
    //   phone: curUser.get("phone"),
    //   weixin: curUser.get("weixin"),
    //   email: curUser.get("email"),
    //   descdesc: curUser.get("desc"),
    //   introduce: curUser.get("introduce"),
    // }).save();
    // entity.save();
    this.store.findRecord('user',1).then(function(user){
      console.log("user get",user);
      user.set("code","test");
      // user.set("extendInfo",null);
      // user.set("cstag",null);
      // user.set("language",null);
      user.save();
    });
  },
  sendQuery: function(){
    // this.store.query("userTask",{filter:{user:{id:1}}});
  },
  sendPost: function(){
    // $.ajax({
    //   type: "OPTIONS",
    //   url: "http://localhost:9080/api/task/1",
    //   data: { name: "John", location: "Boston" }
    // });

  },
  createUser: function(){
    var saveLocalAction = function(userLocal){
      userLocal.set("loginName","111");
      userLocal.set("password","222");
      userLocal.set("current",1);
      userLocal.save().then(function(){
        console.log("save local ok");
      });
    };
    var userLocalEmpty = this.store.createRecord("localstorage/user");
    saveLocalAction(userLocalEmpty);
  },
  afterModel: function(model,transition) {
    console.log("after model in");
  }
});
