import Ember from 'ember';
import finishService from '../../../controllers/finish-service';

export default Ember.Controller.extend(finishService, {
    directInitScollFlag: 0,
    dateService: Ember.inject.service("date-service"), 
    feedService: Ember.inject.service('feed-bus'),
    dataLoader: Ember.inject.service("data-loader"),
    backvistItemId: Ember.computed("dataId","infoId","itemIdFlag", "source", function() {
        var _self = this;
        if (this.get("source") === 'add') {
            // this.get("feedBus").set("backvistData", null); //重置feedbus数据
            // let backvistInfo = this.get('store').createRecord('backvist', {
            //     consultInfo:_self.get('store').peekRecord('consultinfo',_self.get('infoId')),
            //     createDateTime:_self.get("dataLoader").getNowTime(),
            //     delStatus: 0
            // });
            // backvistInfo.save().then(function() {
            //
            // });
            return -1;
        } else {
            //从全局上下文服务里拿到外层传递的数据
            // let backvistInfo = this.get("feedBus").get("backvistData");
            // console.log("customerwarningItemThe computed:", backvistInfo);
            // this.get("feedBus").set("backvistData", null); //重置feedbus数据
            // //与传参进行比较，一致才设置
            // if (backvistInfo.get("id") === this.get("dataId")) {
            //     return backvistInfo;
            // }
            return this.get("dataId");
        }
    }),
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
        switchShowAction() {
            this.incrementProperty("directInitScollFlag");
        },

    },
});
