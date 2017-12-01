import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';
//
import InfiniteScroll from '../../../controllers/infinite-scroll';
const {
    useDrugResult1
} = Constants;

export default BaseUiItem.extend(InfiniteScroll, {
    store: Ember.inject.service("store"),
    feedService: Ember.inject.service('feed-bus'),
    dataLoader: Ember.inject.service("data-loader"),
    dateService: Ember.inject.service("date-service"),
    feedBus: Ember.inject.service("feed-bus"),
    service_PageConstrut: Ember.inject.service("page-constructure"),
    global_curStatus: Ember.inject.service("current-status"),
    infiniteContentPropertyName: "marketskillData",
    infiniteModelName: "market-skill",
    infiniteContainerName: "marketskillDetailContainer",
    constants: Constants,
    //mainController: Ember.inject.controller('business.mainpage'),
    planDataPushFlag: 0,
    queryFlag: 0,
    refreshFlag: 0,
    scrollFlag: false,
    isScrollToTop: false,
    btnFlag: false,
    queryFlagInFlagBack: 0,
    screenOffset: 160,
    consultinfoDataObs: function() {
        var _self = this;
        this._showLoading();
        var infoId = this.get('itemId');
        var source = this.get('source');

        if (source === "add") {
            let consultinfo = this.get('store').createRecord('market-skill', {

            });
            consultinfo.save().then(function(data) {
                _self.set("marketskillId", data.get("id"));
                _self.set("itemId", data.get("id"));
                _self.set("marketskillData", data);
                _self.hideAllLoading();
            });
        } else {
            _self.get("store").findRecord("market-skill", infoId).then(function(marketskillData) {
                console.log("marketskillData:" + marketskillData);
                _self.set("marketskillData", marketskillData);
                _self.hideAllLoading();
            });
        }

        //重新进行tab选择
        console.log("need change refreshFlag");
        this.set("refreshFlag", this.get("itemIdFlag"));
        console.log("refreshFlag after:" + this.get("refreshFlag"));
    }.observes("planDataPushFlag", "itemIdFlag").on("init"),
    init: function() {
        this._super(...arguments);
        this.get("service_PageConstrut").set("showLoader", false); //先关闭mainpage的
        var _self = this;
    },
    directInitScollFlagObs: function() {
        this.send("switchShowAction");
    }.observes("directInitScollFlag"),

    queryFlagIn: function() {
        this.set('source', 'none');
        this.incrementProperty("planDataPushFlag");
    },

    actions: {
        switchShowAction() {
            console.log("switchShowAction in cd");
            this._super();
        },
        //页面跳转
        modification: function(amend, elementId) {
            var _self = this;
            if (!_self.get('marketskillId')) {
                console.log("consultinfoData:null");
            }
            var params = {
                source: amend,
                infoId: _self.get('marketskillId'),
                editType: 'input'
            };
            var itemId = elementId;
            $("#" + itemId).addClass("tapped");
            Ember.run.later(function() {
                $("#" + itemId).removeClass("tapped");
                Ember.run.later(function() {
                    var mainController = App.lookup("controller:business.mainpage");
                    mainController.switchMainPage('marketskill-edit-mobile', params);
                }, 100);
            }, 200);
        },
        //跳转选择 self-choose
        toSelfChoose: function(amend, elementId) {
            var _self = this;
            var flag = 'select';
            if (amend === 'appointmentDate' || amend === 'advDate') {
                flag = 'date';
            }
            if (amend === 'otherReceiveStaff' || amend === 'receiveStaff') {
                flag = 'staff';
            }
            var params = {
                source: amend,
                infoId: _self.get('marketskillId'),
                editType: flag
            };
            var itemId = elementId;
            $("#" + itemId).addClass("tapped");
            Ember.run.later(function() {
                $("#" + itemId).removeClass("tapped");
                Ember.run.later(function() {
                    var mainController = App.lookup("controller:business.mainpage");
                    mainController.switchMainPage('marketskill-edit-mobile', params);
                }, 100);
            }, 200);
        },
        switchPage(pageName) {
            var mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage(pageName);
        },

        //这个是判断 list是否在hbs加载完毕标示
        didInsertAct(code) {

        },

    },
});
