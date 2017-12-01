import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
import config from '../../../config/environment';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  feedService: Ember.inject.service('feed-bus'),
  infiniteContentPropertyName: "nursinglogDetailList",
  infiniteModelName: "nursinglog",
  infiniteContainerName:"nursinglogDetailContainer",
  stopScroll: true,//阻止下拉刷新的所有操作
  speechFlag:false,
  dynamicsFlag:0,
  //通过event service监控顶部菜单的选择事件，并进行相关方法调用
  listenner: function() {
    this.get('feedService').on('saveFun_save', this, 'save');
    console.log("speech 111  in listenner");
  }.on('init'),

  sourceObserver:function(){
    App.lookup('route:business.mainpage.dynamics-detail').headerTitle();
    //查找出执行标签的字典列表，然后比较
    let _self = this;
    let items = this.get("dataLoader").findDictList("nurseTag");
    items.forEach(function(item){
      item.set("hasSelect",false);
    });
    let nursinglogId = this.get("nursinglogId");
    let customerId  = this.get("customerId");
    var source = this.get("source");
    console.log("customer11111111 in it 1111",customerId);
    var nursinglog;
    if(source=="edit"){
      this.store.findRecord('nursinglog',nursinglogId).then(function(nursinglog){
        console.log("111111111logContent nursinglog remark",nursinglog.get("remark"));
      });
        nursinglog = this.store.peekRecord('nursinglog',nursinglogId);
        _self.set('nursinglog',nursinglog);
        // var  logContent = JSON.parse(nursinglog.get("remark")).content;
        // _self.set('logContent',logContent);
        var logContent;
        _self.set('logContent',nursinglog.get("remarkContent"));
        console.log("111111111logContent",nursinglog.get("remarkContent"));
        console.log("111111111logContent nursinglogId",nursinglogId);
        console.log("111111111logContent nursinglog",nursinglog);
        let remark = _self.get("nursinglog.remark");
        // _self.get("nursinglog").then(function(nursinglog){
        //   console.log("remark1111  then",nursinglog.get("remark"));
        // });
        console.log("remark1111",remark);
        console.log("remark1111",nursinglog.get("remark"));
        let remarkObj = null;
        let logTag ;
        if(remark){
          if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
            remarkObj = JSON.parse(remark);
            logTag = remarkObj.logTag;
            logContent = remarkObj.content;
            console.log("111111111logContent ininin",logContent);
            _self.set('logContent',logContent);
          }
        }
        if(logTag=='537'){
          _self.set("sumup",true);
          _self.set("common",false);
        }else {
          _self.set("common",true);
          _self.set("sumup",false);
        }
        if(remarkObj&&logTag){
          items.forEach(function(item){
            if(item.get("id")==logTag){
              console.log("111111logTagArr item",item.get("id"));
              //如果与字典数据匹配，则设置选中
              item.set("hasSelect",true);
            }
          });

        }
        _self.set("tagItems",items);

    }else if (source === 'add'){
      this.set("common",true);
      this.set("sumup",false);
      nursinglog = this.store.createRecord('nursinglog',{});
      var user = this.get("global_curStatus").getUser();
      nursinglog.set('recordUser',user.get("employee"));
      var customer = this.store.peekRecord('customer',customerId);
      console.log("customer11111111",customer);
      nursinglog.set('nurscustomer',customer);
      nursinglog.set('createUser',user);
      this.set('nursinglog',nursinglog);
      this.set("logContent","");
      items.forEach(function(item){
        item.set("hasSelect",false);
      });
      this.set("tagItems",items);
    }else {
      nursinglog = this.store.peekRecord('nursinglog',nursinglogId);
      _self.set('nursinglog',nursinglog);
    }

  }.observes("source","nursinglogId","customerId","logFlag"),

  //选中的标签数据
  tagItemsObs: function(){
    //查找出执行标签的字典列表，然后比较
    let items = this.get("dataLoader").findDictList("nurseTag");
    items.forEach(function(item){
      item.set("hasSelect",false);
    });
    var theRemark = this.get("theRemark");
    let remark;
    if(theRemark){
      remark = theRemark;
    }else {
      remark = this.get("nursinglog.remark");
    }
    console.log("reg111111111111   middle",this.get("nursinglog.remark"));
    let remarkObj = null;
    if(remark&&remark.length>0){
      if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
        remarkObj = JSON.parse(remark);
      }
    }
    if(remarkObj&&remarkObj.logTag){
      let logTag = remarkObj.logTag;
      items.forEach(function(item){
        if(item.get("id")==logTag){
          //如果与字典数据匹配，则设置选中
          item.set("hasSelect",true);
        }
      });
    }

    // if(remarkObj&&remarkObj.logTag){//修改方案了 放弃了 logTag为数组了
    //   // let logTagArr = (remarkObj.logTag).split(",");
    //   let logTagArr = (remarkObj.logTag);
    //   console.log("reg11111111   Array",logTagArr);
    //   logTagArr.forEach(function(logItem){
    //     items.forEach(function(item){
    //       if(item.get("id")==logItem){
    //         //如果与字典数据匹配，则设置选中
    //         item.set("hasSelect",true);
    //       }
    //     });
    //   });
    //
    // }
    this.set("tagItems",items);
    console.log("reg11111111   items",items);
  }.observes("changeFlag"),

// http://localhost:4200/index.html#/business/mainpage/dynamics-detail?addLogFlag=0&customerId=236&source=add
// http://localhost:4200/index.html#/business/mainpage/dynamics-detail?addLogFlag=0&customerId=236&nursinglogId=131&source=edit
  save:function(){
    var _self = this;
    var saveFlag = this.get("saveFlag");
    var dynamicsFlag = this.get("dynamicsFlag");
    this.incrementProperty("dynamicsFlag");
    var params = {
      dynamicsFlag:dynamicsFlag
    };
    if(saveFlag){return;}//网络问题会导致保存按钮不触发 一直点击重复保存所以set 一个flag
    _self.set("saveFlag",true);
    var theRemark = this.get("theRemark");//这里这样做是为了不点保存 不改变日志状态
    var nursinglogId = this.get("nursinglogId");
    var customerId = this.get("customerId");
    var remarkContent = this.get("logContent");
    console.log("111111remarkContent",remarkContent);
    if(!remarkContent){
      App.lookup("controller:business").popTorMsg("日志内容不能为空");
      _self.set("saveFlag",false);
      return ;
    }
    // let remark = this.get("nursinglog.remark");
    let remark = theRemark;
    let remarkObj = null;
    if(remark){
      if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
        remarkObj = JSON.parse(remark);
      }else {
        remarkObj = {};
        remarkObj.content = remark;
      }
    }else {
      remarkObj = {};
    }
    remarkObj.content = remarkContent;
    var nursinglog = this.get("nursinglog");
    var source= this.get("source");
    nursinglog.set("remark",JSON.stringify(remarkObj));
    if(source === 'edit'){
      nursinglog.save().then(function(){
        _self.set("saveFlag",false);
        let items = _self.get("tagItems");
        items.forEach(function(item){
          item.set("hasSelect",false);
        });
        _self.set("tagItems",items);
        _self.set("common",true);
        _self.set("sumup",false);
        _self.set("logContent","");
        App.lookup("controller:business").popTorMsg("护理日志已保存成功");
        var mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('nurse-log',params);
      });
    }else{
      // var customer = this.store.createRecord('customer',{});
      // customer.set("id",customerId);
      //let sysTime = _self.get("dataLoader").getNowTime();
      // nursinglog.set('nursingDate',sysTime);//护理日期
      nursinglog.save().then(function(){
        // _self.set('nursinglog.remark','');//这个教训要记住
        _self.set("saveFlag",false);
        App.lookup("controller:business").popTorMsg("护理日志创建成功");
        let items = _self.get("tagItems");
        items.forEach(function(item){
          item.set("hasSelect",false);
        });
        _self.set("tagItems",items);
        _self.set("common",true);
        _self.set("sumup",false);
        _self.set("logContent","");
        var mainpageController = App.lookup('controller:business.mainpage');
        console.log("id1111111111111111",customerId);
        mainpageController.switchMainPage('nurse-log',params);
        // var dynamicsComponent = App.lookup('component:callbusi.mobile.customer-detail-dynamics');
        // dynamicsComponent.refresh(customerId);//刷新客户动态页面
      });
    }

  },

  actions:{
    saveLog(){
      var _self = this;
      var itemId = "save_log";
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        console.log("111111remarkContent  init");
        _self.save();
      },200);

    },
    switchShowAction(){
      this.set("speechFlag",false);
    },
    commonaction(){
      this.set("common",true);
      this.set("sumup",false);
    },
    sumupaction(){//总结
      this.set("sumup",true);
      this.set("common",false);
      var tagId = 537;//总结
      let remark = this.get("nursinglog.remark");
      let remarkObj = null;
      if(!remark){
        remarkObj = {};
      }else{
        if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
          remarkObj = JSON.parse(remark);
        }else {
          remarkObj = {};
          remarkObj.content = remark ;
        }
      }
      remarkObj.logTag = tagId;
      this.set("theRemark",JSON.stringify(remarkObj));
      // this.get("nursinglog").set("remark",JSON.stringify(remarkObj));
      this.incrementProperty("changeFlag");
    },
    tagChoice(tagId){
      let remark = this.get("nursinglog.remark");
      let remarkObj = null;
      if(!remark){
        remarkObj = {};
      }else{
        if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
          remarkObj = JSON.parse(remark);
        }else {
          remarkObj = {};
          remarkObj.content = remark ;
        }
      }
      remarkObj.logTag = tagId;
      this.set("theRemark",JSON.stringify(remarkObj));
      // this.get("nursinglog").set("remark",JSON.stringify(remarkObj));
      this.incrementProperty("changeFlag");
    },
    arrayAbandonTagChoice(tagId){
      //标签选中后与对象关联
      let remark = this.get("nursinglog.remark");
      console.log("reg111111111111   top",remark);
      let remarkObj = null;
      if(!remark){
        remarkObj = {};
      }else{
        if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
          remarkObj = JSON.parse(remark);
        }else {
          remarkObj = {};
          remarkObj.content = remark ;
        }
      }
      if(remarkObj.logTag&&remarkObj.logTag.length>0){
        // if(remarkObj.logTag.indexOf(tagId)==-1){
        //   remarkObj.logTag = remarkObj.logTag +','+tagId;
        // }else {
        //   var reg = new RegExp(tagId);
        //   console.log("reg111111111111",reg);
        //   remarkObj.logTag = remarkObj.logTag.replace(reg,'');
        // }
        var logTagStr = remarkObj.logTag.join(",");
        if(logTagStr.indexOf(tagId)==-1){
          remarkObj.logTag.push(tagId);
        }else {
          for (var i = 0; i < remarkObj.logTag.length; i++) {
            if(remarkObj.logTag[i]==tagId){
              remarkObj.logTag.splice(i,1);
              break;
            }
          }
        }

      }else {
        var arr = [];
        arr.push(tagId);
        remarkObj.logTag = arr;
      }
      console.log("reg111111111111 logTag",tagId);
      console.log("reg111111111111 remarkObj",remarkObj);
      this.get("nursinglog").set("remark",JSON.stringify(remarkObj));
      console.log("reg111111111111   bottom",this.get("nursinglog.remark"));
      this.incrementProperty("changeFlag");
    },

    //调用微信语音输入 转为文字方法(已经简单实现，不过暂时废弃不用)
    speechInput:function(){
      $("#speech").addClass("tapped");
      setTimeout(function(){$("#speech").removeClass("tapped");},200);
      var speechFlag = this.get("speechFlag");
      var _self = this;
        this.store.query('wechatinfo', {
            filter: {
                scanurl: config.wxScanurl, //必须是调用JS接口页面的完整URL   http://web.tiannianbao.net.cn/business/mainpage/scanQRCode
            }
        }).then(function(dataList) {
            var scanParms = dataList.get("firstObject");
            console.log("speechInput in it",scanParms);
            // alert("http://web.tnb99.cn/index.html");
            console.log( dataList.get("firstObject").get("appId")+"  "+Number(dataList.get("firstObject").get("timeStamp"))+"  "+dataList.get("firstObject").get("nonceStr")+"  "+dataList.get("firstObject").get("signature"));
            wx.config({
                debug: false,
                appId: dataList.get("firstObject").get("appId"),
                timestamp: Number(dataList.get("firstObject").get("timeStamp")),
                nonceStr: dataList.get("firstObject").get("nonceStr"),
                signature: dataList.get("firstObject").get("signature"),
                jsApiList: [
                    'startRecord','stopRecord','translateVoice'
                ]
            });
            wx.ready(function() {
              wx.startRecord({
                success: function(){
                  localStorage.rainAllowRecord = 'true';
                  _self.set("speechFlag",true);
                },
                cancel: function () {
                    alert('用户拒绝授权录音');
                }
              });
            });

            wx.error(function(res) { //错误时调用
                alert(res.errMsg);
            });
        });
    },
    speechEnd(){
      $("#speechEnd").addClass("tapped");
      setTimeout(function(){$("#speechEnd").removeClass("tapped");},200);
      var remarkContent = this.get("logContent");
      var _self = this;
        this.store.query('wechatinfo', {
            filter: {
                scanurl: config.wxScanurl, //必须是调用JS接口页面的完整URL   http://web.tiannianbao.net.cn/business/mainpage/scanQRCode
            }
        }).then(function(dataList) {
            var scanParms = dataList.get("firstObject");
            console.log("speechInput in it",scanParms);
            // alert("http://web.tnb99.cn/index.html");
            console.log( dataList.get("firstObject").get("appId")+"  "+Number(dataList.get("firstObject").get("timeStamp"))+"  "+dataList.get("firstObject").get("nonceStr")+"  "+dataList.get("firstObject").get("signature"));
            wx.config({
                debug: false,
                appId: dataList.get("firstObject").get("appId"),
                timestamp: Number(dataList.get("firstObject").get("timeStamp")),
                nonceStr: dataList.get("firstObject").get("nonceStr"),
                signature: dataList.get("firstObject").get("signature"),
                jsApiList: [
                    'startRecord','stopRecord','translateVoice'
                ]
            });
            wx.ready(function() {
              wx.stopRecord({
                  success: function (res) {
                    var localId = res.localId;
                    speechMessage(localId);
                  }
              });
            });
            function speechMessage(localId){
              wx.translateVoice({
                 localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
                  isShowProgressTips: 1, // 默认为1，显示进度提示
                  success: function (res) {
                    alert(res.translateResult); // 语音识别的结果
                    var speechMess = res.translateResult;
                    _self.set("logContent",remarkContent + speechMess);
                    _self.set("speechFlag",false);
                  }
              });
            }

            wx.error(function(res) { //错误时调用
                alert(res.errMsg);
            });
        });
    },

  },

});
