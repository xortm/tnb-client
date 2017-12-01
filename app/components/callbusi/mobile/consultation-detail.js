import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';
//
import InfiniteScroll from '../../../controllers/infinite-scroll';
const {
    useDrugResult1,liveIntent1,consultChannelTel
} = Constants;

export default BaseUiItem.extend(InfiniteScroll, {
    store: Ember.inject.service("store"),
    feedService: Ember.inject.service('feed-bus'),
    dataLoader: Ember.inject.service("data-loader"),
    dateService: Ember.inject.service("date-service"),
    feedBus: Ember.inject.service("feed-bus"),
    service_PageConstrut: Ember.inject.service("page-constructure"),
    global_curStatus: Ember.inject.service("current-status"),
    infiniteContentPropertyName: "consultinfoData",
    infiniteModelName: "consultinfo",
    infiniteContainerName: "consultDetailContainer",
    constants: Constants,
    //mainController: Ember.inject.controller('business.mainpage'),
    planDataPushFlag: 0,
    planDataPushFlagT:0,
    queryFlag: 0,
    refreshFlag:0,
    scrollFlag:false,
    isScrollToTop:false,
    btnFlag: false,
    queryFlagInFlagBack: 0,
    curTabCode: "tabInfo",
    clickActFlag:"tabInfo",
    // screenOffset: 160,
    tabFuncs: Ember.computed("taskList", function() {
        var a = new Ember.A();
        var t1 = Ember.Object.create({
            code: "tabInfo",
            text: "咨询信息",
            numberTip: 0
        });
        var t4 = Ember.Object.create({
            code: "tabCallBack",
            text: "跟进记录",
            numberTip: 0
        });
        a.pushObject(t1);
        a.pushObject(t4);
        return a;
    }),
    // consultinfoDataObsT: function() {
    //     console.log("flushtest T ",this.get("curTabCode"));
    //     var _self = this;
    //     var infoId = this.get('itemId');
    //     var source = this.get('source');
    //     _self.set("clickActFlag", _self.get("curTabCode"));
    //     if (source ==="add" ) {
    //       let curuser = this.get('global_curStatus').getUser();
    //       let consultinfo = this.get('store').createRecord('consultinfo', {
    //           advDate:_self.get("dataLoader").getNowTime(),
    //           consultStatus: _self.get('dataLoader').findDict('consultStatus1'),
    //           liveIntent:_self.get('dataLoader').findDict(_self.get('constants').liveIntent1),
    //           receiveStaff:curuser.get("employee"),
    //           delStatus: 0
    //       });
    //       consultinfo.save().then(function(data) {
    //         _self.set("consultinfoDataId",data.get("id"));
    //         _self.set("itemId",data.get("id"));
    //         _self.set("consultinfoData", data);
    //         _self.directInitScoll(true);
    //       });
    //     }else{
    //       _self.get("store").findRecord("consultinfo", infoId).then(function(consultationData) {
    //           _self.get("store").query("backvist", {
    //               filter: {
    //                   '[consultInfo][id]': infoId
    //               }
    //           }).then(function(backvistList) {
    //               backvistList = backvistList.sortBy('createDateTime').reverse();
    //               consultationData.set('backVistInfos', backvistList);
    //               console.log("consultinfoData:" + consultationData);
    //               _self.set("consultinfoData", consultationData);
    //               _self.directInitScoll(true);
    //           });
    //       });
    //     }
    // }.observes("planDataPushFlagT"),
    consultinfoDataObs: function() {
              console.log("flushtest T1");
              console.log("itemIdFlag:",this.get("itemIdFlag"));
              console.log("planDataPushFlag:",this.get("planDataPushFlag"));
        var _self = this;
        // let planDataPushFlag = this.get("planDataPushFlag");
        // if(!planDataPushFlag){return;}
        this._showLoading();
        var infoId = this.get('itemId');
        var source = this.get('source');
        _self.set("clickActFlag", "tabInfo");
        if (source ==="add" ) {
          let curuser = this.get('global_curStatus').getUser();
          let consultinfo = this.get('store').createRecord('consultinfo', {
              advDate:_self.get("dataLoader").getNowTime(),
              consultStatus: _self.get('dataLoader').findDict('consultStatus1'),
              liveIntent:_self.get('dataLoader').findDict(_self.get('constants').liveIntent1),
              receiveStaff:curuser.get("employee"),
              consultChannel: _self.get('dataLoader').findDict(_self.get('constants').consultChannelTel),
              delStatus: 0
          });
          consultinfo.save().then(function(data) {
            _self.set("consultinfoDataId",data.get("id"));
            _self.set("itemId",data.get("id"));
            _self.set("consultinfoData", data);
            //_self.directInitScoll(true);
            _self.hideAllLoading();
          });
        }else{
          _self.get("store").findRecord("consultinfo", infoId).then(function(consultationData) {
            console.log("consultationData after find:",consultationData);
              _self.get("store").query("backvist", {
                  filter: {
                      '[consultInfo][id]': infoId
                  }
              }).then(function(backvistList) {
                  backvistList = backvistList.sortBy('createDateTime').reverse();
                  consultationData.set('backVistInfos', backvistList);
                  console.log("consultinfoData:",consultationData);
                  _self.set("consultinfoData", consultationData);
                  // if(_self.get("consultinfoData").get('advGender')){
                  //      _self.set('advGenderOther',_self.get("consultinfoData").get('advGender').get('typename'));
                  // }
                  //_self.directInitScoll(true);
                  _self.hideAllLoading();
              });
          });
        }
        //重新进行tab选择
        console.log("need change refreshFlag");
        this.set("refreshFlag",this.get("itemIdFlag"));
        _self.get("feedService").set("conDataFlag",false);
        console.log("refreshFlag after:" + this.get("refreshFlag"));
    }.observes("itemIdFlag").on("init"),
    init: function() {
        this._super(...arguments);
        this.get("service_PageConstrut").set("showLoader", false); //先关闭mainpage的
        this.set("showLoadingImgIn", true);
        var _self = this;
        _self.set("clickActFlag", "tabInfo");
        _self.set("curTabCode", "tabInfo");
    },
    directInitScollFlagObs: function() {
        this.send("switchShowAction");
    }.observes("directInitScollFlag"),

    queryFlagIn: function() {
              console.log("flushtest T2");
        this.set('source','none');
        this.consultinfoDataObs();
        // this.incrementProperty("planDataPushFlag");
    },

    actions: {
      switchShowAction(){
        this.refreshScrollerAction();
        let assessmentFlag = this.get("feedService").get("conDataFlag");
        if(assessmentFlag){
          this.consultinfoDataObs();
        }
      },
        //页面跳转
        addBackvist: function() {
          var _self = this;
          let curuser = this.get('global_curStatus').getUser();
          let backvistInfo = this.get('store').createRecord('backvist', {
              consultInfo:_self.get('store').peekRecord('consultinfo',this.get('itemId')),
              createDateTime:_self.get("dataLoader").getNowTime(),
              vistUser:curuser.get('employee'),
              liveIntent:_self.get('dataLoader').findDict(_self.get('constants').liveIntent1),
              delStatus: 0
          });
          backvistInfo.save().then(function(backvist) {
            var params = {
                dataId: backvist.id,
                infoId: _self.get('itemId'),
                source: 'edit',
                itemIdFlag:Math.random()
            };
            var itemId = 'addBackvist';
            $("#" + itemId).addClass("tapped");
            Ember.run.later(function() {
                $("#" + itemId).removeClass("tapped");
                Ember.run.later(function() {
                  var mainController = App.lookup("controller:business.mainpage");
                  console.log('2222222');
                  mainController.switchMainPage("backvist-detail-mobile",params);
                }, 100);
            }, 200);
          });

        },
        toBackvist: function(backvist) {
            var _self = this;
            if (!_self.get('consultinfoDataId')) {
                console.log("consultinfoData:null");
            }
            var params = {
                dataId: backvist.id,
                infoId: _self.get('consultinfoDataId'),
                source: 'edit',
                itemIdFlag:Math.random()
            };
            Ember.run.later(function() {
                Ember.run.later(function() {
                    var mainController = App.lookup("controller:business.mainpage");
                    _self.get("feedBus").set("backvistData", backvist);
                    mainController.switchMainPage('backvist-detail-mobile', params);
                }, 100);
            }, 200);
        },
        modification: function(amend, elementId) {
            var _self = this;
            if (!_self.get('consultinfoDataId')) {
                console.log("consultinfoData:null");
            }
            var params = {
                source: amend,
                infoId: _self.get('consultinfoDataId'),
                editType: 'input'
            };
            var itemId = elementId;
            $("#" + itemId).addClass("tapped");
            Ember.run.later(function() {
                $("#" + itemId).removeClass("tapped");
                Ember.run.later(function() {
                    var mainController = App.lookup("controller:business.mainpage");
                    mainController.switchMainPage('consultation-edit-mobile', params);
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
                infoId: _self.get('consultinfoDataId'),
                editType: flag
            };
            var itemId = elementId;
            $("#" + itemId).addClass("tapped");
            Ember.run.later(function() {
                $("#" + itemId).removeClass("tapped");
                Ember.run.later(function() {
                    var mainController = App.lookup("controller:business.mainpage");
                    mainController.switchMainPage('consultation-edit-mobile', params);
                }, 100);
            }, 200);
        },
        switchPage(pageName) {
            var mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage(pageName);
        },

        switchTab(code) {
            console.log(' ' + code);
            this.set("curTabCode", code);
            this.set("showLoadingImgIn", false);
            if (code == "tabInfo") {
                console.log("LoadingImgInss666");
                this.get("dataLoader").set('conTabCode', "tabInfo");
            } else {
                this.get("dataLoader").set('conTabCode', "tabCallBack");
            }
            // this.directInitScoll();
        },

        //这个是判断 list是否在hbs加载完毕标示
        didInsertAct(code) {

        },

    },
});
