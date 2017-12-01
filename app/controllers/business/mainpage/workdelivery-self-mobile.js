import Ember from 'ember';
import InfiniteScroll from '../../../controllers/infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll, {
    directInitScollFlag: 0,
    dateService: Ember.inject.service("date-service"),
    feedService: Ember.inject.service('feed-bus'),
    dataLoader: Ember.inject.service("data-loader"),
    infiniteContentPropertyName: "workdeliveryList",
    infiniteModelName: "workdelivery",
    infiniteContainerName: "workdeliveryContainer",
    queryFlagInFlag: 0,
    showLoadingImg: true,
    scrollFlag: false,
    isScrollToTop:false,
    curTabCode: "sendTab",
    didInsertElementObs:function(){
      this.send("didInsertElement");
    }.observes("directInitScollFlag"),

    tabFuncs: Ember.computed("taskList", function() {
        var a = new Ember.A();
        var t1 = Ember.Object.create({
            code: "sendTab",
            text: "交班信息",
            numberTip: 0
        });
        var t4 = Ember.Object.create({
            code: "receiveTab",
            text: "接班信息",
            numberTip: 0
        });
        a.pushObject(t1);
        a.pushObject(t4);
        return a;
    }),
    init: function(){
      this._super(...arguments);
      var _self = this;
      Ember.run.schedule("afterRender",this,function() {
        _self.get("dataLoader").set('conTabCode', "sendTab");
        _self.set("curTabCode","sendTab");
        _self.set("clickActFlag","sendTab");
      });
    },
    workdeliverySendObs: function() {
        var _self = this;
        this._showLoading();
        let curuser = this.get('global_curStatus').getUser();
            if (curuser.employee) {
                var filter = {};
                filter = $.extend({}, filter, {
                    '[sender][id]': curuser.get('employee').get('id')
                });
                // filter = $.extend({}, filter, {
                //     '[receiver][id]': curuser.get('employee').get('id')
                // });
                filter = $.extend({}, filter, {
                    'receiver@$isNotNull@$or2': 'null'
                });
                filter = $.extend({}, filter, {
                    'remark@$isNotNull@$or2': 'null'
                });
                console.log("queryFlagInFlag:", this.get("queryFlagInFlag"));
                _self.store.query('workdelivery', {
                    filter: filter,
                    sort: {
                        createDateTime: 'desc'
                    }
                }).then(function(workdeliveryList) {
                    _self.set("workdeliverySendList", workdeliveryList);
                    _self.hideAllLoading();
                });
            }
        _self.get("feedService").set("workdeliSelfFlag",false);
    }.observes("queryFlagInFlag").on("init"),
    workdeliveryReceiveObs: function() {
        var _self = this;
        let curuser = this.get('global_curStatus').getUser();
            if (curuser.employee) {
                var filter = {};
                filter = $.extend({}, filter, {
                    '[receiver][id]': curuser.get('employee').get('id')
                });
                filter = $.extend({}, filter, {
                    '[status][typecode@$like]@$or1---1': 'workDeliveryStatus2'
                });
                filter = $.extend({}, filter, {
                    '[status][typecode@$like]@$or1---2': 'workDeliveryStatus3'
                });
                // filter = $.extend({}, filter, {
                //     'advName@$isNotNull': 'null'
                // });
                console.log("queryFlagInFlag:", this.get("queryFlagInFlag"));
                _self.store.query('workdelivery', {
                    filter: filter,
                    sort: {
                        createDateTime: 'desc'
                    }
                }).then(function(workdeliveryList) {
                  _self.set("workdeliveryReceiveList", workdeliveryList);
                  _self.hideAllLoading();
                });
            }
        _self.get("feedService").set("workdeliSelfFlag",false);
    }.observes("queryFlagInFlag").on("init"),
    queryFlagIn() {
        this.incrementProperty("queryFlagInFlag");
    },
    /*通过event service监控顶部菜单的选择事件，并进行相关方法调用*/
    listenner: function() {
        console.log("feedService reg");
        this.get('feedService').on('headerEvent_Scan_serviceNurse', this, 'showScanServiceNurse');
    }.on('init'),
    //注销时清除事件绑定
    cleanup: function() {
        console.log("cleanup feed");
        this.get('feedService').off('headerEvent_Scan_serviceNurse', this, 'showScanServiceNurse');
    }.on('willDestroyElement'),

    showScanServiceNurse: function() {
        var itemId = "customer_scan";
        $("#" + itemId).addClass("tapped");
        Ember.run.later(function() {
            $("#" + itemId).removeClass("tapped");
            Ember.run.later(function() {
                var mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('scanQRCode', {
                    type: 'serviceNurse'
                });
                // mainpageController.switchMainPage('scan-qrcode');
                // alert("in action showScan switch");
            }, 100);
        }, 200);
    },


    actions: {
      switchShowAction(){
        this.directInitScoll();
        this.incrementProperty("directInitScollFlag");
        let assessmentFlag = this.get("feedService").get("workdeliSelfFlag");
        if(assessmentFlag){
          this.workdeliveryReceiveObs();
          this.workdeliverySendObs();
        }
      },
      didInsertElement(){
        console.log("insert e in");
        this.directInitScoll();
      },
      switchTab(code){
        console.log('switchTab in,code:' + code);
        this.get("dataLoader").set('conTabCode', code);
        this.set("curTabCode",code);
      },
        addWorkdelivery: function() {
            var _self = this;
            // var params = {
            //     source: 'add',
            //     itemIdFlag:Math.random(),
            //     opType:"send"
            // };
            let curuser = this.get('global_curStatus').getUser();
            let workdeliveryItem = this.get('store').createRecord('workdelivery', {
                createDateTime:_self.get("dataLoader").getNowTime(),
                sender: curuser.get('employee'),
                status:_self.get('dataLoader').findDict('workDeliveryStatus1'),
                delStatus: 0
            });
            workdeliveryItem.save().then(function(data) {
              _self.get("feedService").set("workdeliveryData", data);
              var params = {
                  itemId: data.get("id"),
                  itemIdFlag: Math.random(),
                  source: "edit",
                  opType:'send',
              };
              var itemId = "addWorkdelivery";
              $("#" + itemId).addClass("tapped");
              Ember.run.later(function(){
                $("#" + itemId).removeClass("tapped");
                var mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('workdelivery-detail-mobile', params);
              },200);
            });
        },
        //跳转到detail页面
        gotoWorkdeliveryDetail(type,data) {
            console.log("go workdelivery detail");
            var _self = this;
            var params = {};
            params = {
                itemId: data.get("id"),
                itemIdFlag: Math.random(),
                source: "edit",
                opType:type,
            };
            console.log("gotoDetail params", params);
            var itemId = "item_" + data.get("id");
            $("#" + itemId).addClass("tapped");
            Ember.run.later(function() {
                $("#" + itemId).removeClass("tapped");
                Ember.run.later(function() {
                    var mainpageController = App.lookup('controller:business.mainpage');
                    //通过全局服务进行上下文传值
                    console.log("item in list:", _self.get("item"));
                    _self.get("feedService").set("workdeliveryData", data);
                    mainpageController.switchMainPage('workdelivery-detail-mobile', params);
                }, 100);
            }, 200);
        },
    },
});
