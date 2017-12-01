import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  dataLoader: Ember.inject.service("data-loader"),
  feedService: Ember.inject.service('feed-bus'),

  infiniteContentPropertyName: "customerdynamicList",
  infiniteModelName: "customerdynamic",
  infiniteContainerName:"customerDynamicListContainer",
  "page[size]": 10,
  pageScrollY: 120,
  stopScroll: true,//阻止下拉刷新的所有操作
  uploadUrl: Ember.computed(function() {return this.get("pathConfiger").get("uploadUrl");}),
  constants:Constants,

  customerObs: function(){
    var _self = this;
    //获取headerbar中的老人id
    var customerId = this.get("healtyCustomerId");
    if(!customerId){
      //如果不存在id
      this.set("nocustomerId",true);
      _self.hideAllLoading();
      return;
    }else{
      //如果存在id,则是页面可以滑动
      this.set("stopScroll",false);
    }
    this.set("nocustomerId",false);
    this.set("customerId",customerId);
    // this.set("hasRender",true);
    // this.set("oriTaskId",customerId);
    var params = {
      filter:{
        customer:{id:customerId}
      },
      sort:{
        createDateTime:"desc"
      }
    };
    console.log("infiniteQuery run");
    this.infiniteQuery('customerdynamic',params);
  }.observes("healtyCustomerId").on("init"),

  actions:{
    //开始录制
    videoRecord(){
      this.set("showVideoRecord",true);
    },
    //录制结束
    afterStopRecord(){
      //结束后关闭录制屏幕
      this.set("showVideoRecord",true);
    },
    delItemAction:function(dynamicId){
      let _self = this;
      //弹出遮罩层提示
      // App.lookup('controller:business.mainpage').showMobileShade("正在删除,请稍候..");
      App.lookup('controller:business.mainpage').showMobileLoading();
      let customerdynamicList = this.get("customerdynamicList");
      let customerdynamic = customerdynamicList.findBy("id",dynamicId);
      customerdynamic.set("delStatus", 1);
      console.log("customerdynamic",customerdynamic);
      customerdynamic.save().then(function() {
        //关闭遮罩层提示
        // App.lookup('controller:business.mainpage').closeMobileShade("删除成功");
        App.lookup('controller:business.mainpage').closeMobileLoading();
        App.lookup("controller:business").popTorMsg("删除成功");
        _self.customerObs();
      },function(err){
        App.lookup("controller:business").popTorMsg("删除失败");
        App.lookup('controller:business.mainpage').closeMobileLoading();
        // let error = err.errors[0];
        // if(error.code==="8"){
        //   App.lookup("controller:business").popTorMsg("删除失败");
        // }
      });
    },
    // uploadSucc: function(response) {
    //   console.log("response in uploader:",response);
    //   var res = JSON.parse(response);
    //   console.log("res", res);
    //   var picPath = res.relativePath;
    //   console.log("picPath", picPath);
    // },
    // addDynamicImg:function(){
    //   let customerId = this.get("customerId");
    //   if(!customerId){
    //     App.lookup("controller:business").popTorMsg("请在上方选择老人");
    //     return false;
    //   }
    // },
    addDynamic:function(param){
      let _self = this;
      let itemClass = "addDynamicText";
      if(param != "text"){
        itemClass = "imgWrapperInner";
      }
      $("." + itemClass).addClass("tapped");
      Ember.run.later(function(){
        $("." + itemClass).removeClass("tapped");
        Ember.run.later(function(){
          console.log("param in addDynamic:",param);
          let customerId = _self.get("customerId");
          if(!customerId){
            App.lookup("controller:business").popTorMsg("请在上方选择老人");
            return;
          }
          //获取headerbar中选择的老人对象
          let healtyCustomer = _self.get("global_curStatus.healtyCustomer");
          console.log("healtyCustomer in dy:",healtyCustomer);
          //获取当前user
          var curUser = _self.get("global_curStatus").getUser();
          console.log("curUser in dy:",curUser);
          //获取当前服务器时间
          let sysTime = _self.get("dataLoader").getNowTime();
          console.log("sysTime in dy:",sysTime);
          //文字对象
          var dynamicObj4 = _self.get("dataLoader").findDict(Constants.dynamicType4);
          console.log("dynamicObj4 in dy:",dynamicObj4);
          //视频对象
          var dynamicObj3 = _self.get("dataLoader").findDict(Constants.dynamicType3);
          console.log("dynamicObj3 in dy:",dynamicObj3);
          let customerdynamicModel = _self.get('store').createRecord("customerdynamic",{
            // dynamicType:dynamicObj,
            createDateTime:sysTime,
            customer:healtyCustomer,
            createUser:curUser,
          });
          let dynamicText;
          let picPath;
          if(param == "text"){
            let dynamicText = $(".dynamicText").val();
            if(dynamicText === "" || dynamicText === " "){
              App.lookup("controller:business").popTorMsg("添加内容不能为空");
              return;
            }else{
              // App.lookup('controller:business.mainpage').showMobileShade("正在添加老人动态..");
              App.lookup('controller:business.mainpage').showMobileLoading();
              customerdynamicModel.set("contents",dynamicText);
              customerdynamicModel.set("dynamicType",dynamicObj4);
            }
          }else{
            // App.lookup('controller:business.mainpage').showMobileShade("正在添加老人动态..");
            App.lookup('controller:business.mainpage').showMobileLoading();
            //解析上传的图片信息
            let res = JSON.parse(param);
            let picPath = res.relativePath;
            console.log("picPath:",picPath);
            customerdynamicModel.set("picPath",picPath);
            customerdynamicModel.set("dynamicType",dynamicObj3);
          }
          customerdynamicModel.save().then(function() {
            // App.lookup('controller:business.mainpage').closeMobileShade("添加成功");
            App.lookup('controller:business.mainpage').closeMobileLoading();
            App.lookup("controller:business").popTorMsg("添加成功");
            $(".dynamicText").val("");
            _self.customerObs();
          },function(err){
            App.lookup("controller:business").popTorMsg("添加失败");
            App.lookup('controller:business.mainpage').closeMobileLoading();
            // let error = err.errors[0];
            // if(error.code==="8"){
            //   App.lookup("controller:business").popTorMsg("删除失败");
            // }
          });
        },50);
      },100);

    },
    addImgDynamic:function(param){
      let _self = this;
      console.log("param in addDynamic:",param);
      let customerId = _self.get("customerId");
      if(!customerId){
        App.lookup("controller:business").popTorMsg("请在上方选择老人");
        return;
      }
      //获取headerbar中选择的老人对象
      let healtyCustomer = _self.get("global_curStatus.healtyCustomer");
      console.log("healtyCustomer in dy:",healtyCustomer);
      //获取当前user
      var curUser = _self.get("global_curStatus").getUser();
      console.log("curUser in dy:",curUser);
      //获取当前服务器时间
      let sysTime = _self.get("dataLoader").getNowTime();
      console.log("sysTime in dy:",sysTime);
      //文字对象
      var dynamicObj4 = _self.get("dataLoader").findDict(Constants.dynamicType4);
      console.log("dynamicObj4 in dy:",dynamicObj4);
      //视频对象
      var dynamicObj3 = _self.get("dataLoader").findDict(Constants.dynamicType3);
      console.log("dynamicObj3 in dy:",dynamicObj3);
      let customerdynamicModel = _self.get('store').createRecord("customerdynamic",{
        // dynamicType:dynamicObj,
        createDateTime:sysTime,
        customer:healtyCustomer,
        createUser:curUser,
      });
      let dynamicText;
      let picPath;
      if(param == "text"){
        let dynamicText = $(".dynamicText").val();
        if(dynamicText === "" || dynamicText === " "){
          App.lookup("controller:business").popTorMsg("添加内容不能为空");
          return;
        }else{
          // App.lookup('controller:business.mainpage').showMobileShade("正在添加老人动态..");
          App.lookup('controller:business.mainpage').showMobileLoading();
          customerdynamicModel.set("contents",dynamicText);
          customerdynamicModel.set("dynamicType",dynamicObj4);
        }
      }else{
        // App.lookup('controller:business.mainpage').showMobileShade("正在添加老人动态..");
        App.lookup('controller:business.mainpage').showMobileLoading();
        //解析上传的图片信息
        let res = JSON.parse(param);
        let picPath = res.relativePath;
        console.log("picPath:",picPath);
        customerdynamicModel.set("picPath",picPath);
        customerdynamicModel.set("dynamicType",dynamicObj3);
      }
      customerdynamicModel.save().then(function() {
        // App.lookup('controller:business.mainpage').closeMobileShade("添加成功");
        App.lookup('controller:business.mainpage').closeMobileLoading();
        App.lookup("controller:business").popTorMsg("添加成功");
        $(".dynamicText").val("");
        _self.customerObs();
      },function(err){
        App.lookup("controller:business").popTorMsg("添加失败");
        App.lookup('controller:business.mainpage').closeMobileLoading();
        // let error = err.errors[0];
        // if(error.code==="8"){
        //   App.lookup("controller:business").popTorMsg("删除失败");
        // }
      });

    },
    //切换到此页面,执行操作
    switchShowAction(){
      this.directInitScoll();
    },

  },
});
