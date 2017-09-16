import Ember from 'ember';
import InfiniteScroll from '../../../controllers/infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll, {
    directInitScollFlag: 0,
    dateService: Ember.inject.service("date-service"),
    feedService: Ember.inject.service('feed-bus'),
    infiniteContentPropertyName: "workdeliveryList",
    infiniteModelName: "workdelivery",
    infiniteContainerName: "workdeliveryViewContainer",
    queryFlagInFlag: 0,
    showLoadingImg: true,
    scrollFlag: false,
    isScrollToTop: false,
    curTabCode: "sendTab",
    workdeliverySendObs: function() {
        var _self = this;
        this._showLoading();
        var employeeId = this.get("global_curStatus.attendanceEmployeeId");
        console.log("employeeId in log", employeeId);
        var filter = {};
        filter = $.extend({}, filter, {
            'receiver@$isNotNull@$or2': 'null'
        });
        filter = $.extend({}, filter, {
            'remark@$isNotNull@$or2': 'null'
        });
        filter = $.extend({}, filter, {
            '[status][typecode@$like]@$or1---1': 'workDeliveryStatus2'
        });
        filter = $.extend({}, filter, {
            '[status][typecode@$like]@$or1---2': 'workDeliveryStatus3'
        });
        if (employeeId) {
            filter = $.extend({}, filter, {
                '[sender][id]': employeeId
            });
        }
        console.log("queryFlagInFlag:", this.get("queryFlagInFlag"));
        _self.infiniteQuery('workdelivery', {
            filter: filter,
            sort: {
                createDateTime: 'desc'
            }
        }).then(function(workdeliveryList) {
            _self.set("workdeliveryList", workdeliveryList);
            _self.hideAllLoading();
        });

    }.observes("global_curStatus.attendanceEmployeeId", "queryFlagInFlag").on("init"),

    // queryFlagIn() {
    //     this.incrementProperty("queryFlagInFlag");
    // },


    actions: {
        //跳转到detail页面
        gotoWorkdeliveryDetail(type, data) {
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
                    _self.get("feedService").set("workdeliveryData", data);
                    mainpageController.switchMainPage('workdelivery-view-detail', params);
                }, 100);
            }, 200);
        },
    },
});
