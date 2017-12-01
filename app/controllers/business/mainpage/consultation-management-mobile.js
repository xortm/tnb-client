import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll, {
    dateService: Ember.inject.service("date-service"),
    feedService: Ember.inject.service('feed-bus'),
    dataLoader: Ember.inject.service("data-loader"),
    infiniteContentPropertyName: "consultationList",
    infiniteModelName: "consultinfo",
    infiniteContainerName: "consultationContainer",
    queryFlagInFlag: 0,
    constants: Constants,
    scrollFlag: false,
    customerObs: function() {
        var _self = this;
        var filter = {};
        console.log("testincrease1 ",this.get("queryFlagInFlag"));
        filter = $.extend({}, filter, {
            '[consultStatus][typecode@$like]@$or1---1': 'consultStatus1'
        });
        filter = $.extend({}, filter, {
            '[consultStatus][typecode@$like]@$or1---2': 'consultStatus2'
        });
        filter = $.extend({}, filter, {
            'advName@$isNotNull': 'null'
        });
        console.log("queryFlagInFlag:", _self.get("queryFlagInFlag"));
        // this.store.query("backvist", {
        //     filter: {},
        //     sort: {
        //         createDateTime: 'desc'
        //     }
        // }).then(function(backvistList) {
        // });
        _self.infiniteQuery('consultinfo', {
            filter: filter,
            sort: {
                createDateTime: 'desc'
            }
        });
        _self.get("feedService").set("conManaFlag",false);
    }.observes("queryFlagInFlag").on("init"),

    //当添加完说明后执行此操作
    customerListObs: function() {
        var _self = this;
        if (!this.get("customerListFlag")) {
            return;
        }
        var consultationList = this.get("consultationList");
        //获取保存在feedService里面的数据
        let consultinfoItem = this.get("feedService").get("consultationData");
        console.log("warningItem in out obs:", consultinfoItem);
        if (consultinfoItem) {
            // console.log("warningItem in obs:", consultinfoItem);
            // console.log("warningItem flag:", warningItem.get("flag"));
            // console.log("warningItem typename:", warningItem.get("flag.typename"));
            // console.log("warningItem operateNote:", warningItem.get("operateNote"));
            //遍历list将id相同的数据更新一下
            consultationList.forEach(function(consultinfo) {
                if (consultinfo.get("id") === consultinfoItem.get("id")) {
                    console.log("hbeaconwarning in forEach:", consultinfo);
                    consultinfo.set("advTel", consultinfoItem.get("advTel"));
                    consultinfo.set("advName", consultinfoItem.get("advName"));
                    consultinfo.set("occupancyIntent", consultinfoItem.get("occupancyIntent"));
                    consultinfo.set("advGender", consultinfoItem.get("advGender"));
                    consultinfo.set("consultChannel", consultinfoItem.get("consultChannel"));
                    consultinfo.set("consultRelation", consultinfoItem.get("consultRelation"));
                    consultinfo.set("receiveStaff", consultinfoItem.get("receiveStaff"));
                    consultinfo.set("otherReceiveStaff", consultinfoItem.get("otherReceiveStaff"));
                    consultinfo.set("remark", consultinfoItem.get("remark"));
                    consultinfo.set("customerName", consultinfoItem.get("customerName"));
                    consultinfo.set("customerGender", consultinfoItem.get("customerGender"));
                    consultinfo.set("customerEducation", consultinfoItem.get("customerEducation"));
                    consultinfo.set("customerPS", consultinfoItem.get("customerPS"));
                    consultinfo.set("customerAddr", consultinfoItem.get("customerAddr"));
                    consultinfo.set("customerTel", consultinfoItem.get("customerTel"));
                    consultinfo.set("inPreferenceName", consultinfoItem.get("inPreferenceName"));
                    consultinfo.set("care", consultinfoItem.get("care"));
                    consultinfo.set("dietRequirements", consultinfoItem.get("dietRequirements"));
                    consultinfo.set("roomRequirements", consultinfoItem.get("roomRequirements"));
                    consultinfo.set("serviceRequirements", consultinfoItem.get("serviceRequirements"));
                    consultinfo.set("otherRequirements", consultinfoItem.get("otherRequirements"));
                    consultinfo.set("psychologicalPrice", consultinfoItem.get("psychologicalPrice"));
                    consultinfo.set("discontent", consultinfoItem.get("discontent"));
                    consultinfo.set("appointmentDateString", _self.operateTimeShortString(consultinfoItem.get("appointmentDate")));
                    consultinfo.set("createDateTimeShortString", _self.operateTimeShortString(consultinfoItem.get("advDate")));
                    console.log("hbeaconwarning after in forEach:", consultinfo);
                    _self.get("feedService").set("consultationData", null); //重置feedbus数据
                }
            });
        }
        _self.set("consultationList", consultationList);
    }.observes("customerListFlag").on("init"),

    //处理operateTime为特定格式
    operateTimeShortString(operateTime) {
        var timeStr = this.get("dateService").formatDate(operateTime, "MM-dd hh:mm");
        var timeString = timeStr.replace(/-0/, "月");
        timeString = timeString.replace(/-/, "月");
        timeString = timeString.replace(/ /, "日 ");
        console.log("timeString.charAt(0):", timeString.charAt(0));
        if (timeString.charAt(0) == "0") {
            var operateTimeShortString = timeString.substring(1);
            return operateTimeShortString;
        } else {
            return timeString;
        }
    },

    actions: {
        addConsultInfo: function() {
            var _self = this;
            var params = {
                clickActFlag: 'tabInfo',
                source: 'add',
                itemIdFlag: Math.random()
            };
            _self.get("dataLoader").set('conTabCode', "tabInfo");

            var itemId = "addConsultInfo";
            $("#" + itemId).addClass("tapped");
            Ember.run.later(function() {
                $("#" + itemId).removeClass("tapped");
                var mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('consultation-detail-mobile', params);
            }, 200);
        },
        switchShowAction(){
          this.directInitScoll();
          let assessmentFlag = this.get("feedService").get("conManaFlag");
          if(assessmentFlag){
            this.customerObs();
          }
        },
    },
});
