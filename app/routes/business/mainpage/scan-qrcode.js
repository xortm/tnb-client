import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
import config from '../../../config/environment';

export default BaseBusiness.extend(Pagination, {
    header_title: '扫码',
    service_PageConstrut:Ember.inject.service("page-constructure"),
    global_curStatus: Ember.inject.service("current-status"),
    feedBus: Ember.inject.service("feed-bus"),
    queryParams: {
        type: {
            refreshModel: true
        },
    },
    model() {
        return {};
    },
    scanQrcode:function(){
      let _self = this;
      var type = this.getCurrentController().get("type");
      console.log("scan type:" + type);
      //扫码成功后执行函数
      let scanSucc = function(cid){
        console.log("resultText cid",cid);
        var mainpageController = App.lookup('controller:business.mainpage');
        // if(!isNaN(cid)){
        if(cid.indexOf('tnbId:')>-1){
          cid = cid.substr(6);
          console.log("the cid",cid);
          if(type=='serviceNurse'){
            let queryCusObj = {};
            queryCusObj.queryCusFlag = "personal";
            localStorage.queryCusObj = JSON.stringify(queryCusObj);
            _self.get("global_curStatus").set("serveCustomerId",cid);
            _self.get("global_curStatus").set("queryCusObj",queryCusObj);
            _self.get("global_curStatus").set("queryCusFlag",queryCusObj.queryCusFlag);
            // mainpageController.switchMainPage('customer-detail',{id:cid,scanFlag:Math.random()});
            mainpageController.switchMainPage('service-nurse');
          }else if(type=='serviceCare'){
            let queryCusObj = {};
            queryCusObj.queryCusFlag = "personal";
            localStorage.queryCusObj = JSON.stringify(queryCusObj);
            _self.get("global_curStatus").set("serveCustomerId",cid);
            _self.get("global_curStatus").set("queryCusObj",queryCusObj);
            _self.get("global_curStatus").set("queryCusFlag",queryCusObj.queryCusFlag);
            mainpageController.switchMainPage('service-care');
          }else if(type=='customerBusiness'){
            _self.get("global_curStatus").set("healtyCustomerId",cid);
            mainpageController.switchMainPage('customer-business');
          }else if(type=='nurseLog'){
            _self.get("global_curStatus").set("logCustomerId",cid);
            mainpageController.switchMainPage('nurse-log');
          }else{
            _self.get("global_curStatus").set("serveCustomerId","all");
            mainpageController.switchMainPage('service-nurse');
          }

        }else {
          alert("请扫描老人二维码");
          if(type=='serviceNurse'){
            mainpageController.switchMainPage('service-nurse');
          }else if(type=='serviceCare'){
            mainpageController.switchMainPage('service-care');
          }else if(type=='customerBusiness'){
            mainpageController.switchMainPage('customer-business');
          }else if(type=='nurseLog'){
            mainpageController.switchMainPage('nurse-log');
          }else{
            mainpageController.switchMainPage('service-nurse');
          }
        }
      };
      //扫码失败后执行函数
      let scanFail = function(error){
        alert(error);
      };
      console.log("window.cordova:" + window.cordova);
      //如果不是android的app执行微信
      if(!window.cordova){
        console.log("wechat in wxScanurl:",config.wxScanurl);
        // alert(config.wxScanurl);
        //微信扫码模式
        this.store.query('wechatinfo', {
            filter: {
                scanurl: config.wxScanurl, //必须是调用JS接口页面的完整URL   http://web.tiannianbao.net.cn/business/mainpage/scanQRCode
            }
        }).then(function(dataList) {
            var scanParms = dataList.get("firstObject");
            console.log("theWechat log" ,dataList.get("firstObject").get("appId")+"  "+Number(dataList.get("firstObject").get("timeStamp"))+"  "+dataList.get("firstObject").get("nonceStr")+"  "+dataList.get("firstObject").get("signature"));
            wx.config({
                debug: false,
                appId: dataList.get("firstObject").get("appId"),
                timestamp: Number(dataList.get("firstObject").get("timeStamp")),
                nonceStr: dataList.get("firstObject").get("nonceStr"),
                signature: dataList.get("firstObject").get("signature"),
                jsApiList: [
                    'scanQRCode'
                ]
            });
            wx.ready(function() {
                // 9.1.2 扫描二维码并返回结果
                console.log("scan ready in");
                wx.scanQRCode({
                    needResult: 1,
                    desc: 'scanQRCode desc',
                    success: function(res) {
                        console.log("res.resultStr scan successIn",res.resultStr);
                        var mainpageController = App.lookup('controller:business.mainpage');
                        if(!res.resultStr){//如果没有值
                          if(type=='serviceNurse'){
                            mainpageController.switchMainPage('service-nurse');
                          }else if(type=='serviceCare'){
                            mainpageController.switchMainPage('service-care');
                          }else if(type=='customerBusiness'){
                            mainpageController.switchMainPage('customer-business');
                          }else if(type=='nurseLog'){
                            mainpageController.switchMainPage('nurse-log');
                          }else{
                            mainpageController.switchMainPage('service-nurse');
                          }
                        }else {
                          var cid = res.resultStr;
                          if(cid.indexOf('tnbId:')>-1){
                            cid = cid.substr(6);
                            console.log("the cid",cid);
                            if(type=='serviceNurse'){
                              let queryCusObj = {};
                              queryCusObj.queryCusFlag = "personal";
                              localStorage.queryCusObj = JSON.stringify(queryCusObj);
                              _self.get("global_curStatus").set("serveCustomerId",cid);
                              _self.get("global_curStatus").set("queryCusObj",queryCusObj);
                              _self.get("global_curStatus").set("queryCusFlag",queryCusObj.queryCusFlag);
                              // mainpageController.switchMainPage('customer-detail',{id:cid,scanFlag:Math.random()});
                              mainpageController.switchMainPage('service-nurse');
                            }else if(type=='serviceCare'){
                              let queryCusObj = {};
                              queryCusObj.queryCusFlag = "personal";
                              localStorage.queryCusObj = JSON.stringify(queryCusObj);
                              _self.get("global_curStatus").set("serveCustomerId",cid);
                              _self.get("global_curStatus").set("queryCusObj",queryCusObj);
                              _self.get("global_curStatus").set("queryCusFlag",queryCusObj.queryCusFlag);
                              mainpageController.switchMainPage('service-care');
                            }else if(type=='customerBusiness'){
                              _self.get("global_curStatus").set("healtyCustomerId",cid);
                              mainpageController.switchMainPage('customer-business');
                            }else if(type=='nurseLog'){
                              _self.get("global_curStatus").set("logCustomerId",cid);
                              mainpageController.switchMainPage('nurse-log');
                            }else{
                              _self.get("global_curStatus").set("serveCustomerId","all");
                              mainpageController.switchMainPage('service-nurse');
                            }

                          }else {
                            alert("请扫描老人二维码");
                            if(type=='serviceNurse'){
                              mainpageController.switchMainPage('service-nurse');
                            }else if(type=='serviceCare'){
                              mainpageController.switchMainPage('service-care');
                            }else if(type=='customerBusiness'){
                              mainpageController.switchMainPage('customer-business');
                            }else if(type=='nurseLog'){
                              mainpageController.switchMainPage('nurse-log');
                            }else{
                              mainpageController.switchMainPage('service-nurse');
                            }
                          }
                        }


                    },
                    error:function(){
                      alert("错误 Error");
                    }
                });
            });
            wx.error(function(res) { //错误时调用
                scanFail(res.errMsg);
            });
        });
      }else{
        console.log("barcodeScanner innnn:" + cordova.plugins.barcodeScanner);
        //原生模式，调用cordova插件进行扫码
        cordova.plugins.barcodeScanner.scan(
           function (result) {
            //  alert("We got a barcode\n" +
            //        "Result: " + result.text + "\n" +
            //        "Format: " + result.format + "\n" +
            //        "Cancelled: " + result.cancelled);
            console.log("result",result);
            console.log("resultText",result.text);
            if(!result.text){//如果没有值
              var mainpageController = App.lookup('controller:business.mainpage');
              if(type=='serviceNurse'){
                mainpageController.switchMainPage('service-nurse');
              }else if(type=='serviceCare'){
                mainpageController.switchMainPage('service-care');
              }else if(type=='customerBusiness'){
                mainpageController.switchMainPage('customer-business');
              }else if(type=='nurseLog'){
                mainpageController.switchMainPage('nurse-log');
              }else{
                mainpageController.switchMainPage('service-nurse');
              }
            }else {
              scanSucc(result.text);
            }
           },
           function (error) {
               scanFail(error);
           }
        );
      }
    },
    setupController: function(controller, model) {
      this._super(controller,model);
      this.scanQrcode();
      this.defineController(controller,model);
    },
    defineController:function(controller,model){
      var _self = this;
      controller.reopen({
        actions:{
          switchShowAction:function(){
            console.log("res.resultStr in switchShowAction");
            _self.scanQrcode();
          },
        },

      });
    },
});
