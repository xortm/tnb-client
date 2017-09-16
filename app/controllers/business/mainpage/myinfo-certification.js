import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "userMyInfoCertification",
  infiniteModelName: "user",
  infiniteContainerName:"userMyInfoCertificationContainer",

  feedService: Ember.inject.service('feed-bus'),
  pathConfiger: Ember.inject.service("path-configer"),

  constants:Constants,
  backRoutePath:null,//返回路径
  curRoutePath: null,//当前路径
  isSquare:true,

  isDisabled: Ember.computed('model.curUser.status',function () {
    if(this.get('model.curUser').get('status') === 2||this.get('model.curUser').get('status') === 3){
      return true;
    }
    return false;
  }),
  trueOrFalse: Ember.computed('model.curUser.status',function () {
    if(this.get('model.curUser').get('status') === 3||this.get('model.curUser').get('status') === 2){
      return false;
    }
    return true;
  }),
  FailReason: Ember.computed('model.curUser.status',function () {
    if(this.get('model.curUser').get('status') === 4){
      return true;
    }
    return false;
  }),
  uploadUrl: Ember.computed('property', function() {return this.get("pathConfiger").get("uploadUrl");}),
  isMobile: Ember.computed(function () {
    return this.get("global_curStatus").get("isMobile");
  }),
  listenner: function() {
    this.get('feedService').on('approve_save', this, 'save');
  }.on('init'),

  save:function(code){
    var _self=this;
    var curUser = this.get("global_curStatus").getUser();
    console.log("this.get('model.curUser').get('status')",this.get('model.curUser').get('status'));
    var saveThenAct = function(){
      console.log("need save then");
      var mainController = App.lookup("controller:business.mainpage");
      mainController.switchMainPage("business-mine");
    };
    if(!(curUser.get('edinfo').get('idPhoto')) || !(curUser.get('edinfo').get('idPhotoReverse')) || !curUser.get('edinfo').get('idcardNum') ){
      this.set('hidden',true);
      this.set('succeed','身份证号码、证件照没有上传哦');
    }
    else if(  !curUser.get('sex') || !curUser.get('name')  ||  !curUser.get('phone')){
      this.set('hidden',true);
      this.set('succeed','*用户名、性别、身份证、手机号码必须填写');
    }
    else {
      this.set('hidden',false);
      if(this.get('model.curUser').get('status') === 1||this.get('model.curUser').get('status') === 4){
        this.store.findRecord("userPrivate",curUser.get("id")).then(function(userEnt){
          userEnt.set("status",2);
          _self.get('global_ajaxCall').set("action",'applyVerify');
          userEnt.save().then(function(){
            saveThenAct();
          });
        });
      }else{
        console.log("this.get('model.curUser').get('status') === ",curUser.get('status'));
      }
      if(_self.get("model.curUser.edinfo.idcardNum")){
        this.store.findRecord("edinfo",curUser.get("edinfo").get("id")).then(function(userEnt){
          userEnt.set("idcardNum",_self.get("model.curUser.edinfo.idcardNum"));
          userEnt.save().then(function(){
            saveThenAct();
          });
        });
      }else {
        console.log("this  idcardNum is none");
      }
    }
  },
  actions:{
    //上传证件照
    uploadidcardImg: function(response) {
      var curUser=this.get('global_curStatus').getUser();
      var res=JSON.parse(response);
      this.store.findRecord("edinfo",curUser.get('edinfo').get('id')).then(function(userEnt){
        userEnt.set("idPhoto",res.relativePath);
        userEnt.save();
      });
      this.set('color1',false);
      this.set("errorText1","");
    },
    //上传证件照反面
    uploadidcardImgReverse:function(response){
      var res=JSON.parse(response);
      var curUser=this.get('global_curStatus').getUser();
      this.store.findRecord("edinfo",curUser.get("edinfo").get("id")).then(function(userEnt){
        userEnt.set("idPhotoReverse",res.relativePath);
        userEnt.save();
        console.log("res.relativePath",res.relativePath);
      });
      this.set("errorText2","");
      this.set('color2',false);
    }
  },

});
