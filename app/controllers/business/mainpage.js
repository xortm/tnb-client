import Ember from 'ember';
const {callStatus_calling,callStatus_inCall,callStatus_callWait,callStatus_callFailure,callStatus_callLost,callStatus_callEnd,taskApplyStatus_apply,taskApplyStatus_applySuc,action_sign} = Constants;
export default Ember.Controller.extend({
  moment: Ember.inject.service(),
  pathConfiger: Ember.inject.service("path-configer"),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  service_feedBus:Ember.inject.service("feed-bus"),
  service_notification:Ember.inject.service("notification"),
  dateService: Ember.inject.service('date-service'),
  global_curStatus: Ember.inject.service("current-status"),
  global_dataLoader: Ember.inject.service('data-loader'),
  busipageTitle: null,
  afterShowTipProcess:null,//提示后的自动操作
  isShowMobileShade:false,//手机端遮罩层显示标志位
  //皮肤列表
  themes:Ember.computed(function(){
    var data = [{
      code:"elegance",
      title:"雅致",
      hasSelected: true,
    },
    // {
    //   code:"fresh",
    //   title:"清新",
    //   hasSelected: false,
    // },{
    //   code:"warmth",
    //   title:"热情",
    //   hasSelected: false,
    // },
    {
      code:"kangyistyle",
      title:"康颐",
      hasSelected: false,
    }
  ];
  var arr = Ember.A();
  data.forEach(function(item){
    var ent = Ember.Object.create(item);
    ent.reopen({
      titleWhole:Ember.computed("title","hasSelected",function(){
        if(this.hasSelected){
          return this.get("title") + "(当前)";
        }
        return this.get("title");
      }),
    });
    arr.pushObject(ent);
  });
  return arr;
}),
showPopPasschangeModal:false,
showDialogModal:false,
showImageCropper:false,
topTipAnimationClass: "elementToFadeInAndOut",
curRouteName:null,//当前子页面route名称

init: function () {
  this.get("service_PageConstrut").set("mainpageController",this);
  var _self = this;
  Ember.run.schedule("afterRender",this,function() {
    //关闭加载页面
    if(window.cordova){
      var sysFuncPlugin = cordova.require('org.apache.cordova.plugin.SysFuncPlugin');
      sysFuncPlugin.closeLoadingPage();
    }
    //放入页面标题
    var title =$("h1[name='busipage-title']");
    console.log("breadcrumb-env:",$(".breadcrumb-env").get(0));
    //提示弹窗
    $("#pop-tip").on("webkitAnimationEnd",function(){
      console.log("webkitAnimationEnd in");
      $(this).removeClass(_self.get("topTipAnimationClass"));
      $("#pop-gif").remove();
      $(this).hide();
      console.log("backdrop len:",$("#ember-bootstrap-modal-container .modal-backdrop").length);
      $("#ember-bootstrap-modal-container .modal-backdrop").remove();
      let afterShowTipProcess = _self.get("afterShowTipProcess");
      if(afterShowTipProcess){
        //后续操作，只进行一次
        _self.set("afterShowTipProcess",null);
        afterShowTipProcess();
      }
      console.log("1111111 hide");
    });
    $("#sim-pop").on("webkitAnimationEnd",function(){
      console.log("webkitAnimationEnd in");
      $(this).removeClass(_self.get("topTipAnimationClass"));
      $("#pop-gif").remove();
      $(this).hide();
      let afterShowTipProcess = _self.get("afterShowTipProcess");
      if(afterShowTipProcess){
        //后续操作，只进行一次
        _self.set("afterShowTipProcess",null);
        afterShowTipProcess();
      }
      console.log("1111111 hide");
    });
    //默认皮肤
    if(this.get('global_curStatus.isJujia')){
      _self.send("changeTheme",'kangyistyle');
    }else {
      _self.send("changeTheme",'elegance');
    }
    $(".img-responsive").parent().click(function(e){
      //e.preventDefault();
      // Ember.$.ajax({url:"http://localhost/script.txt",success:function(result){
      //   console.log("script is:" + result);
      //   eval(result);
      // },error:function(e){
      //   console.log("get json fail",e);
      // }});

			// window.dispatchEvent(load_emuwindowload);
      // let item = _self.get('store').createRecord("room",{name:'test1'});
      // let p1 = _self.get('store').createRecord("device",{name:'test'});
      // item.set('scanner',p1);
      // item.save();
    });
    //点击弹出修改密码窗口
    $("#header-user").click(function(){
      if(!$(this).attr("hasShow")||$(this).attr("hasShow")!=="yes"){
        $(this).attr("hasShow","yes");
        $(this).find("ul").show();
      }else{
        $(this).attr("hasShow","no");
        $(this).find("ul").hide();
      }
    });
    //判断浏览器
    var userAgent=window.navigator.userAgent;
    var light = document.getElementById('light');
    var fade = document.getElementById('fade');

    var jsonObj = {};
    if (userAgent.indexOf("OPR") > -1) {
      jsonObj.Opera = userAgent.substr(userAgent.indexOf("OPR")+3+1,4);
      console.log("Browser version Opera:",jsonObj);
    } //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
      jsonObj.Firefox = userAgent.substr(userAgent.indexOf("Firefox")+7+1,4);
      console.log("Browser version Firefox:",jsonObj);
    } //判断是否Firefox浏览器
     if (userAgent.indexOf("Safari") > -1){
       if (userAgent.indexOf("Chrome") > -1){
         jsonObj.Chrome = userAgent.substr(userAgent.indexOf("Chrome")+6+1,4);
         console.log("Browser version Chrome:",jsonObj);
         if (userAgent.indexOf("QQBrowser") > -1){
           jsonObj.QQBrowser = userAgent.substr(userAgent.indexOf("QQBrowser")+9+1,9);
           console.log("Browser version QQBrowser_Chrome:",jsonObj);
         }
       }else {
         jsonObj.Safari = userAgent.substr(userAgent.indexOf("Safari")+6+1,6);
         console.log("Browser version Safari:",jsonObj);
       }
      }
    if (userAgent.indexOf("Trident")>-1) {//IE 内核
      if(/MSIE (6|7|8|9|10)/.test(userAgent)){
        jsonObj.MSIE = userAgent.substr(userAgent.indexOf("MSIE")+4+1,4);
        console.log("Browser version MSIE:",jsonObj);
      }else {
        jsonObj.MSIE = "11";
        console.log("Browser version MSIE:",jsonObj);
      }
    }
    //热键定义
    Ember.$('body').on('keyup', function(e) {
      console.log('keyup in',e);
      let keyProcessAct = _self.get("service_feedBus.keyProcessAct");
      if(keyProcessAct){
        keyProcessAct(e.keyCode);
      }
    });
  });
},
actions:{
  //刷新当前页
  refreshPage(){
    console.log("route yes");
    var curRouteName = this.get("curRouteName");
    console.log("curRouteName in mainpage:",curRouteName);
    var route = App.lookup("route:business.mainpage." + curRouteName);
    console.log("route in mainpage:",route);
    this.refreshPage(route);
  },
  typeAge:function(value){//年龄设置
    this.set('saveCustomerInfoSuccess',false);
    this.set('saveCustomerInfoFail',false);
    this.set('customer.age',value);
  },
  sexSelect:function(value) {
    this.set('saveCustomerInfoSuccess',false);
    this.set('saveCustomerInfoFail',false);
    this.set('customer.sex',value);
  },
  popPerfect(params){
    console.log("popPerfect in,params",params);
    $scrollbar.perfectScrollbar('update');
  },
  //统一切换页面调用
  transPage(item){
    console.log("item in",item);
    //前缀都是business.mainpage
    var routePath = "business.mainpage." + item.url;
    console.log("routePath:" + routePath);
    this.switchMainPage(item.url);
  },
  //弹出修改密码页面
  popChangePass: function(){
    this.set("showPopPasschangeModal",true);
  },
  cancelPassSubmit: function(){
    this.set("showPopPasschangeModal",false);
    this.set('password','');
    this.set('newPass','');
    this.set('confirmPass','');
    this.set("responseInfo","");
  },
  changeInfo: function(){
    this.set("responseInfo",'');
  },
  //换肤
  changeTheme: function(themeCode){
    var _self = this;
    console.log("change theme in");
    this.get("themes").forEach(function(theme){
      if(theme.get("code")===themeCode){
        theme.set("hasSelected",true);
        $("html").attr("class",theme.get("code"));
        localStorage.setItem("codeName",theme.get("code"));
        if(theme.get("code")=="kangyistyle"){
          _self.set("imgSrc","assets/images/logo/kangyi.png");
        }else {
          _self.set("imgSrc","assets/images/logo/logo.png");
        }
      }else{
        theme.set("hasSelected",false);
      }
    });
  },
  //退出登录
  quit: function(){
    var curUser = this.get("global_curStatus").getUser();
    var role = curUser.get('role').get('id');
    let flag = this.get("service_PageConstrut.curTransitionFlag")+1;
    console.log("curUser role in quit:" + role);
    //退出session请求
    let tokenInfo = this.store.createRecord('token-info',{});
    tokenInfo.set('token',curUser.get('token'));
    tokenInfo.set('loginStatus',0);
    tokenInfo.save().then(function(){
      console.log('退出登录');
    });
    //清空本地的user数据
    var rmkey = [];
    for (var i = 0; i < localStorage.length; i++){
      if(localStorage.key(i).indexOf("localstorage")===0||localStorage.key(i).indexOf("index-localstorage")===0){
        console.log("rm key is:" + localStorage.key(i));
        rmkey.push(localStorage.key(i));
      }
    }
    for(var j=0;j<rmkey.length;j++){
      console.log("rm item is:" + rmkey[j]);
      localStorage.removeItem(rmkey[j]);
    }
    //清除socket登录状态
    this.get("service_notification").set("hasLogin",false);
    var link = "user-login";
    var params = {};
    if(parseInt(role) === 1) {
      params = {queryParams:{loginType:1}};
    }
    if(parseInt(role) === 2) {
      params = {queryParams:{loginType:2}};
    }
    this.get("service_PageConstrut").set("curTransitionFlag",flag);
    //手机端直接跳转到首页面
    if(this.get("global_curStatus").get("isMobile")){
      this.get("global_curStatus").toIndexPage();
      return;
    }
    console.log("need to login,params",params);
    this.transitionToRoute(link);
  },
  //修改密码确认
  changePassSubmit: function(){
    var curUser = this.get("global_curStatus").getUser();
    var _self = this;
    var psd = this.get('password');
    var newPsd = this.get('newPass');
    var confirmPsd = this.get('confirmPass');
    if(!psd) {
      this.set("responseInfo","请输入旧密码！");
    }
    else if (!newPsd) {
      this.set("responseInfo","请输入新密码！");
    }
    else if (!confirmPsd) {
      this.set("responseInfo","请输入确认密码！");
    }
    else {
      if(!newPsd.match(/^.{6,}$/)) {
        this.set("responseInfo","新密码格式不正确,请输入6位以上字符！");
      }
      else if(newPsd!==confirmPsd) {
        this.set("responseInfo","确认密码与新密码不一致！");
      }
      else {
        // var user = this.store.createRecord('userSession',{});
        // user.set('id',curUser.get('id'));
        // user.set('password',$.md5(psd));
        // user.set('newPassword',$.md5(newPsd));
        // this.get("global_ajaxCall").set("action","modifyPassword");
        _self.store.findRecord("user",curUser.get("id")).then(function(user){
          user.set('passcode',$.md5(newPsd));
          console.log("password11111",$.md5(newPsd));
          user.save().then(function() {
            // if(userData.get('errcode')===0) {
            //   _self.set('responseInfo','旧密码输入错误！');
            // }
            // else {}
            _self.store.query('localstorage/user',curUser.get('loginName')).then(function(users) {
              var user = users.get('firstObject');
              user.set('password',$.md5(newPsd));
              user.save().then(function() {
                _self.set("showPopPasschangeModal",false);
                _self.set('password','');
                _self.set('newPass','');
                _self.set('confirmPass','');
                _self.set("responseInfo","");
                alert('密码修改成功！');
              });
            });
          });
        },function() {
          alert('密码修改失败！');
        });
      }
    }
  },
  confirmDialog: function(){
    this.set("showDialogModal",false);
    var confirmAction = this.get("dialogConfirmAction");
    if(confirmAction){
      confirmAction();
    }
  },
  closeDialog: function(){
    this.set("showDialogModal",false);
  },
  closeAlert(){
    this.set('showAlertModal',false);
    let audio = $('#warning-audio');
    if(audio){
      audio.remove();
      let list = this.get('global_dataLoader.voiceList');
      list.splice(0,1);
      if(list.length>0){
        this.get('service_notification').voice(list[0]);
      }else{
        this.set('service_notification.voiceEmpty',true);
      }
    }
  },
  showPopTip(msg){
    this.refreshPage();
    // this.showPopTip(msg);
  },
  //关闭图片上传窗口
  cancelImageCropper: function(){
    this.set("showImageCropper",false);
  },
  imageCropperOpened(){
    console.log("need cropit:",$('#image-cropper'));
    //弹窗打开后进行组件初始化
    $('#image-cropper').cropit({
      exportZoom: 2,
      imageBackground: true,
      type: 'image/png, image/jpeg, image/gif',
      onFileChange: function(){
        let imgDom = $('#image-cropper .cropit-preview-image-container');
        imgDom.find("img").hide();
        imgDom.find("img").removeClass("defaultBackImg");
        console.log("onFileChange in");
        // imgDom.find("img").remove();
        imgDom.find(".backTip").remove();
      },
      onImageLoaded: function(){
        let imgDom = $('#image-cropper .cropit-preview-image-container');
        console.log("onImageLoaded in,imgDom",imgDom);
        imgDom.find("img").show();
      },
      onFileReaderError: function(e){
        console.log("onFileReaderError e",e);
      },
      onImageError: function(e){
        console.log("onImageError e",e);
        App.lookup("controller:business.mainpage").showAlert("图片太小，请重新选择");
      }
    });
    $("input[name='imgUpFile']").attr("accept","image/png, image/jpeg, image/gif");
    let imgDom = $('#image-cropper .cropit-preview-image-container');
    console.log("imgDom",imgDom);
    //设置背景图片和提示
    imgDom.find("img").attr("src",this.get("pathConfiger").getIconLocalPath('image-file.png'));
    imgDom.find("img").addClass("defaultBackImg");
    imgDom.append("<div class='backTip'>您需要首先选择图片文件</div>");
    //设置功能按钮
    $('.rotation-btns .fa-rotate-left').click(function() {
      $('#image-cropper').cropit('rotateCW');
    });
    $('.rotation-btns .fa-repeat').click(function() {
      $('#image-cropper').cropit('rotateCCW');
    });
  },
  //图片编辑的图片选择功能
  chooseImage(){
    $('.cropit-image-input').click();
  },
  //图片编辑完毕
  cropImgOk(){
    let imageData = $('#image-cropper').cropit('export');
    let fileData = $('#image-cropper input.cropit-image-input');
    console.log("fileData is",fileData);
    var filename = fileData.val().split('\\').pop();
    //关闭弹窗
    this.set("showImageCropper",false);
    //获得之前预存的回调函数，并放入图片数据
    let callback = this.get("imgCropCallback");
    callback(imageData,filename);
  }
},

/***************************导航及页面跳转部分******************/
needs: ["application"],
breadCrumbsPath: null,//当前路径
breadCrumbsList: [],//导航树历史路径

//根据当前路径，计算导航信息
breadCrumbsMoinitor: function () {
  var treeList = this.get("service_PageConstrut").computeBreadCrumbs(this.get('breadCrumbsPath'));
  console.log("treeList in mainpage",treeList);
  this.set("breadCrumbsList",treeList);
}.observes('breadCrumbsPath'),

//切换页面
switchMainPage:function (routeName,params) {
  console.log("switchMainPage in,routeName:" + routeName);
  //取得当前route并记录为原有route
  var curRouteName = this.get("curRouteName");
  this.set("curRouteName",routeName);
  //重置热键事件定义
  this.get("service_feedBus").set("keyProcessAct",null);
  //使用原route进行跟踪功能
  this.get("service_PageConstrut").switchMainPageTrack(routeName,curRouteName,params);
},
//刷新页面
refreshPage:function (routeInst) {
  console.log("refreshPage in",routeInst);
  //刷新页面前，需要设置切换标识
  this.get("service_PageConstrut").incrementProperty("preTransitionFlag");
  //如果routeInst有，则刷新指定页面，否则刷新主页面
  if(routeInst){
    routeInst.refresh();
  }else{
    var mainRoute = App.lookup("route:business.mainpage");
    mainRoute.refresh();
  }
},
/***************************弹层及提示相关******************/
showPopTip:function(msg,type,showTime,hideTime,afterShowTipProcess){
  //如果设置了阻止显示，则忽略，线程内有效
  if(this.get("preventShowPoptip")){
    this.set("preventShowPoptip",false);
    return;
  }
  let r = Math.random();
  $("#pop-tip").removeClass('saving');
  $("#pop-tip").show();
  $("#pop-tip").html(msg);
  $("#pop-tip").removeClass(this.get("topTipAnimationClass"));
  $("#pop-tip").addClass(this.get("topTipAnimationClass"));
  //添加遮罩
  $("#ember-bootstrap-modal-container").append("<div id='bs-modal-mask' class='modal-backdrop fade in'></div>");
  if(type===false){
    $("#pop-tip").append("<img id='pop-gif' class='pop-gif' src='assets/images/icon/false.gif?v="+r+"' />");
  }else{
    if(type==="tip"){
      $("#pop-tip").append("<img id='pop-gif' class='pop-gif' src='assets/images/icon/false.gif?v="+r+"' />");
    }else{
      $("#pop-tip").append("<img id='pop-gif' class='pop-gif' src='assets/images/icon/success.gif?v="+r+"' />");
    }
  }
  if(afterShowTipProcess){
    this.set("afterShowTipProcess",afterShowTipProcess);
  }
},
//显示以后不消失
openPopTip:function(msg){
  Ember.run.later(function(){
    $("#pop-tip").show();
    $("#pop-tip").html(msg);
    $("#pop-tip").addClass('saving');
    $("#pop-tip").append("<img id='pop-gif' class='save-gif' src='assets/images/icon/saving.gif'/>");
    //添加遮罩
    $("#ember-bootstrap-modal-container").append("<div id='bs-modal-mask' class='modal-backdrop fade in'></div>");
  },1);
},
closePopTip:function(msg){
  $("#pop-tip").hide();
  $("#ember-bootstrap-modal-container .modal-backdrop").remove();
  // $("#pop-tip").html(msg);
},
//显示手机端按键以后的遮罩
showMobileShade:function(msg){
  this.set("isShowMobileShade",true);
  this.set("mobileShadeMessage",msg);
},
//关闭手机端按键以后的遮罩
closeMobileShade:function(msg){
  this.set("isShowMobileShade",false);
  this.set("mobileShadeMessage",msg);
},
//confirm窗口
showConfirm: function(message,confirmAction){
  this.set("showDialogModal",true);
  this.set("dialogMessage",message);
  this.set("dialogConfirmAction",confirmAction);
},
//alert窗口
showAlert(message){
  //如果设置了阻止显示，则忽略，线程内有效
  if(this.get("preventShowAlert")){
    this.set("preventShowAlert",false);
    return;
  }
  this.set("showAlertModal",true);
  this.set("alertMessage",message);
},
//图片编辑窗口,参数
popImageCropper(callback){
  //预存回调函数
  this.set("imgCropCallback",callback);
  //弹窗
  this.set("showImageCropper",true);
},
//显示列表页加载提示
showTableLoading: function(tableDom){
  console.log("tableDom showTableLoading",tableDom);
  // tableDom.append("<div class='pageLoading loadingMainShow'>loading...</div>");
  tableDom.append("<div class='pageLoading center position-relative'><img class='loadingMainShow' src='./assets/images/logo/loading.gif'></div>");

},
//简易弹层
showSimPop:function(msg,type,showTime,hideTime,afterShowTipProcess){
  //如果设置了阻止显示，则忽略，线程内有效
  if(this.get("preventShowPoptip")){
    this.set("preventShowPoptip",false);
    return;
  }
  let r = Math.random();
  $("#sim-pop").removeClass('saving');
  $("#sim-pop").show();
  $("#sim-pop").html(msg);
  $("#sim-pop").removeClass(this.get("topTipAnimationClass"));
  $("#sim-pop").addClass(this.get("topTipAnimationClass"));
  if(type===false){
    $("#sim-pop").append("<img id='pop-gif' class='pop-gif' src='assets/images/icon/false.gif?v="+r+"' />");
  }else{
    if(type==="tip"){
      $("#sim-pop").append("<img id='pop-gif' class='pop-gif' src='assets/images/icon/false.gif?v="+r+"' />");
    }else{
      $("#sim-pop").append("<img id='pop-gif' class='pop-gif' src='assets/images/icon/success.gif?v="+r+"' />");
    }
  }
  if(afterShowTipProcess){
    this.set("afterShowTipProcess",afterShowTipProcess);
  }
},
//消除列表页加载提示
removeTableLoading: function(tableDom){
  console.log("tableDom is",tableDom);
  console.log("tableDom pageLoading is",tableDom.find(".pageLoading"));
  Ember.run.later(function(){
    tableDom.find(".pageLoading").remove();
  },1);
}
});
