import Ember from 'ember';
import InfiniteScroll from '../../../controllers/infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll, {
    directInitScollFlag: 0,
    dateService: Ember.inject.service("date-service"),
    feedService: Ember.inject.service('feed-bus'),
    // infiniteContentPropertyName: "workdeliveryList",
    // infiniteModelName: "workdelivery",
    infiniteContainerName: "workdeliveryContainer",
    queryFlagInFlagT: 0,
    queryFlagInFlagT1: 0,
    queryFlagInFlagT2: 0,
    showLoadingImg: true,
    scrollFlag: false,
    isScrollToTop: false,
    curTabCode: "houseTab",
    didInsertElementObs: function() {
        this.send("didInsertElement");
    }.observes("directInitScollFlag"),

    tabFuncs: Ember.computed("taskList", function() {
        var a = new Ember.A();
        var t1 = Ember.Object.create({
            code: "houseTab",
            text: "房态图",
            numberTip: 0
        });
        var t2 = Ember.Object.create({
            code: "standardTab",
            text: "收费标准",
            numberTip: 0
        });
        var t4 = Ember.Object.create({
            code: "skillTab",
            text: "营销话术",
            numberTip: 0
        });
        a.pushObject(t1);
        a.pushObject(t2);
        a.pushObject(t4);
        return a;
    }),
    init: function() {
        this._super(...arguments);
        var _self = this;
        Ember.run.schedule("afterRender", this, function() {
            _self.set("curTabCode", "houseTab");
            _self.set("clickActFlag", "houseTab");
        });
    },
    houseObs: function() {
      var _self = this;
      _self._showLoading();

      _self.hideAllLoading();
    }.observes("queryFlagInFlagT").on("init"),
    standardObs: function() {
        var _self = this;
        this._showLoading();
        var filter = {};
        filter = $.extend({}, filter, {
            'remark@$isNotNull': 'null'
        });
        filter = $.extend({}, filter, {
            'title@$isNotNull': 'null'
        });
        console.log("queryFlagInFlagT:", this.get("queryFlagInFlagT"));
        _self.store.query('market-skill', {
            filter: filter,
            // sort: {
            //     createDateTime: 'desc'
            // }
        }).then(function(dataList) {
         console.log("standardList ",dataList);
            _self.set("skillList", dataList);
            _self.hideAllLoading();
        });
    }.observes("queryFlagInFlagT1").on("init"),
    priceObs: function() {
      var _self = this;
      this._showLoading();
      var filter = {};
      filter = $.extend({}, filter, {
          'remark@$isNotNull': 'null'
      });
      filter = $.extend({}, filter, {
          'title@$isNotNull': 'null'
      });
      console.log("queryFlagInFlagT:", this.get("queryFlagInFlagT"));
      _self.store.query('charging-standard', {
          filter: filter,
          // sort: {
          //     createDateTime: 'desc'
          // }
        }).then(function(dataList) {
            _self.set("standardList", dataList);
            _self.hideAllLoading();
        });
    }.observes("queryFlagInFlagT2").on("init"),
    queryFlagIn() {
        console.log("yewutab ",this.get("curTabCode"));
        if(this.get("curTabCode")==='houseTab'){
            this.incrementProperty("queryFlagInFlagT");
        }
        if(this.get("curTabCode")==='skillTab'){
            this.incrementProperty("queryFlagInFlagT1");
        }
        if(this.get("curTabCode")==='standardTab'){
            this.incrementProperty("queryFlagInFlagT2");
        }
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
    actions: {
        didInsertElement() {
            console.log("insert e in");
            this.directInitScoll();
        },
        switchTab(code) {
            console.log('switchTab in,code:' + code);
            this.set("curTabCode", code);
        },
        switchShowAction() {
            this.incrementProperty("directInitScollFlag");
        },
        addMarketSkill: function() {
            var _self = this;
            var params = {
                source: 'add',
                itemIdFlag: Math.random(),
                opType: "send"
            };
            var mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('marketskill-detail-mobile', params);
        },
        addChargingStandard: function() {
            var _self = this;
            var params = {
                source: 'add',
                itemIdFlag: Math.random(),
                opType: "send"
            };
            var mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('chargestandard-detail-mobile', params);
        },
        //跳转到detail页面
        gotoMarketSkillDetail(type, data) {
            console.log("go workdelivery detail");
            var _self = this;
            var params = {};
            params = {
                itemId: data.get("id"),
                itemIdFlag: Math.random(),
                source: "edit",
                opType: type,
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
                    //_self.get("feedService").set("workdeliveryData", data);
                    mainpageController.switchMainPage('marketskill-detail-mobile', params);
                }, 100);
            }, 200);
        },
        gotoChargingStandardDetail(type, data) {
            console.log("go workdelivery detail");
            var _self = this;
            var params = {};
            params = {
                itemId: data.get("id"),
                itemIdFlag: Math.random(),
                source: "edit",
                opType: type,
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
                    //_self.get("feedService").set("workdeliveryData", data);
                    mainpageController.switchMainPage('chargestandard-detail-mobile', params);
                }, 100);
            }, 200);
        },
    },
});
