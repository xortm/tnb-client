import Ember from 'ember';
import finishService from '../../../controllers/finish-service';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(finishService,InfiniteScroll, {
    directInitScollFlag: 0,
    stopScroll:true,
    dateService: Ember.inject.service("date-service"),
    feedService: Ember.inject.service('feed-bus'),
    dataLoader: Ember.inject.service("data-loader"),
    workdeliveryItem: Ember.computed("itemId", "itemIdFlag", "source", function() {
        var _self = this;
        let curuser = this.get('global_curStatus').getUser();
        if (this.get("source") === 'add') {
            this.get("feedBus").set("workdeliveryData", null); //重置feedbus数据
            let workdeliveryItem = this.get('store').createRecord('workdelivery', {
                createDateTime:_self.get("dataLoader").getNowTime(),
                sender: curuser.get('employee'),
                status:_self.get('dataLoader').findDict('workDeliveryStatus1'),
                delStatus: 0
            });
            workdeliveryItem.save().then(function() {

            });
            return workdeliveryItem;
        } else {
            //从全局上下文服务里拿到外层传递的数据
            let workdeliveryItem = this.get("feedBus").get("workdeliveryData");
            console.log("customerwarningItemThe computed:", workdeliveryItem);
            this.get("feedBus").set("workdeliveryData", null); //重置feedbus数据
            //与传参进行比较，一致才设置
            if (workdeliveryItem.get("id") === this.get("itemId")) {
                return workdeliveryItem;
            }
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
