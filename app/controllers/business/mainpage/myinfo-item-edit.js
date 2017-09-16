import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
const {educationLevelPrimary,educationLevelJunior,educationLevelSenior,educationLevelUniversity} = Constants;

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "userMyInfoItemEdit",
  infiniteModelName: "user",
  infiniteContainerName:"userMyInfoItemEditContainer",

  dataLoader: Ember.inject.service("data-loader"),
  feedService: Ember.inject.service('feed-bus'),
  editEnd:true,
  backRoutePath:null,//返回路径
  curRoutePath: null,//当前路径
  isSquare:true,

  // theObsever:function(){
  //   console.log("jinru 1111111");
  //   var _self = this;
  //   var curUser = this.get("global_curStatus").getUser();
  //   var source = this.get("name");
  //   this.store.findRecord('user',curUser.get("id")).then(function(user){
  //     if(source==="name"){
  //       _self.set('name',user.get("name"));
  //     }else if(source==="age"){
  //       _self.set('age',user.get("age"));
  //     }
  //   });
  // }.observes("user"),
  queryObs:function(){
    App.lookup('route:business.mainpage.myinfo-item-edit').doQuery();
  }.observes("source"),

  isMobile: Ember.computed(function () {
    console.log("isMobile in:", this.get("global_curStatus").get("isMobile"));
    return this.get("global_curStatus").get("isMobile");
  }),

  //通过event service监控顶部菜单的选择事件，并进行相关方法调用
  listenner: function() {
    this.get('feedService').on('saveFun_save', this, 'save');
  }.on('init'),
  ageRegular: Ember.computed(function(){
    var num=this.get('edit');
    var Reg= /[1-9]?[0-9]|100/;
    return this.Regular(num,Reg);
  }).property('edit'),
  phoneRegular: Ember.computed(function(){
    var num=this.get('edit');
    var Reg= /^1\d{10}/;
    return this.Regular(num,Reg);
  }).property('edit'),
  emailRegular:Ember.computed(function(){
    var num=this.get('edit');
    var Reg=  /^\w+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;
    return this.Regular(num,Reg);
  }).property('edit'),
  codeRegular:Ember.computed(function(){
    var num=this.get('edit');
    var Reg=  /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
    return this.Regular(num,Reg);
  }).property('edit'),
  Regular:function(num,Reg){
    if (num && !(Reg.test(num))) {
      return false;
    }
    return true;
  },
  maxlength: Ember.computed("source",function () {
    var maxlength = "";
    var source = this.get("source");
    if(source === 'age'){
      maxlength ="3";
    }
    if(source === 'staffMail'){
      maxlength ="33";
    }
    if(source === 'staffTel'){
      maxlength = '11';
    }
    if(source === 'staffCardCode'){
      maxlength = '18';
    }
    if(source === 'weixin'){
      maxlength = '33';
    }
    return maxlength;
  }),
  editPlaceholder: Ember.computed("source",function () {
    var editPlaceholder = "";
    var source = this.get("source");
    if(source === 'name'){
      editPlaceholder ="请输入用户名";
    }
    if(source === 'age'){
      editPlaceholder ="请输入年龄";
    }
    if(source === 'staffCardCode'){
      editPlaceholder ="请输入身份证号";
    }
    if(source === 'staffTel'){
      editPlaceholder = '请输入手机号码';
    }
    if(source === 'staffMail'){
      editPlaceholder ="请输入邮箱账号";
    }
    if(source === 'weixin'){
      editPlaceholder = '请输入微信账号';
    }
    if(source === 'curAddress'){
      editPlaceholder = '请输入家庭住址';
    }
    return editPlaceholder;
  }),
  /**
  * 保存——钩：调用Fun()方法；
  * code
  * lishan
  * 2016-8-4
  */
  save() {
    var _self=this;
    var source = _self.get('source');
    var edit = _self.get("edit");
    console.log("this.edit",edit);
    var curUser = this.get("global_curStatus").getUser();
    if(source==="staffMail" && !this.get('emailRegular')){
      this.set('succeed','请输入正确的邮箱账号！');
    }else if (source==="staffTel" && !this.get('phoneRegular')) {
      this.set('succeed','请输入正确的手机号码！');
    }else if (source==="age" && !this.get('ageRegular')) {
      this.set('succeed','请输入正确0-100的年龄！');
    }else if (source==="staffCardCode" && !this.get('codeRegular')) {
      this.set('succeed','请输入正确的身份证号码！');
    }
    else if ( !edit){
      console.log('_self.get in edit is none ,not do save');
      var mainController = App.lookup("controller:business.mainpage");
      mainController.switchMainPage("business-mine");
    }
    else {
      var leaveStatusObj = null;
      this.store.findRecord("user",curUser.get("id")).then(function(userEnt){
        if(source==="name"){
          userEnt.set("name",edit);
        }else if (source==="age") {
          userEnt.set("age",edit);
        }else if (source==="staffCardCode") {//身份证号码
          userEnt.set("staffCardCode",edit);
        }else if (source==="staffTel") {
          userEnt.set("staffTel",edit);
        }else if (source==="staffMail")  {
          userEnt.set("staffMail",edit);
        }else if(source === 'curAddress'){//家庭住址
          userEnt.set("curAddress",edit);
        }
        userEnt.save().then(function(ll){
          var mainController = App.lookup("controller:business.mainpage");
          mainController.switchMainPage("business-mine");
        });
      });
    }
  },
});
