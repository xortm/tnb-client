import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
import Changeset from 'ember-changeset';
import TradeValidations from '../../../validations/customer-event';
import lookupValidator from 'ember-changeset-validations';
const {
    taskApplyStatus_apply,
    taskApplyStatus_applySuc,
    taskApplyStatus_applyFail
} = Constants;

export default Ember.Controller.extend(InfiniteScroll, {
    feedService: Ember.inject.service('feed-bus'),
    dataLoader: Ember.inject.service("data-loader"),
    infiniteContentPropertyName: "customerList",
    infiniteModelName: "customer",
    infiniteContainerName: "customerContainer",
    dateService:Ember.inject.service("date-service"),
    curTabCode: "user",
    clickFlag: 0, //标识(点击健康档案)
    accountFlag:0,//标识(点击服务信息)
    projectFlag:0,//计次服务标示
    detailFlag:0,//定时服务标示
    eventEditFlag:false,
    showEventModel:false,
    tabFuncs: Ember.computed(function() {
        let a = new Ember.A();
        let t1 = Ember.Object.create({
            code: "user",
            selected: true,
            text: "长者信息"
        });
        let t2 = Ember.Object.create({
            code: "checkIn",
            text: "入住信息"
        });
        let t3 = Ember.Object.create({
            code: "healthy",
            text: "健康信息"
        });
        a.pushObject(t1);
        a.pushObject(t2);
        a.pushObject(t3);
        return a;
    }),

    init: function() {
        let _self = this;
        Ember.run.schedule("afterRender", this, function() {
            _self.set("clickActFlag", "user");
        });
        let eventModel = this.get('store').createRecord("customer-event");
       eventModel = new Changeset(eventModel, lookupValidator(TradeValidations), TradeValidations);
       this.set("eventModel",eventModel);
    },
    planListObs:function(){
      let _self = this;
      let id = _self.get("id");
      let compareDate = this.get("dateService").getDaysBeforeTimestamp(3);
      _self.store.query('nursingplanexe', {
            filter: {
                '[itemProject][project][customer][id]':id,'createDateTime@$gte': compareDate
            },sort:{'createDateTime':'desc'}
      }).then(function(planProjectList) {
        _self.set("planProjectList",planProjectList);
        _self.incrementProperty("projectFlag");
      });
    }.observes("id",'refresh'),

    //exe 定时和计次服务集合
    exePlanObs: function(){
      let _self = this;
      let planList = new Ember.A();
      let  projectFlag = this.get("projectFlag");
      if(!projectFlag){return;}//如果exe查询没有完成就return
      let planProjectList = this.get("planProjectList");//计次
      planProjectList.forEach(function(item){
        planList.pushObject(item);
      });
      planList.forEach(function(plan){//planList 做下最后处理
        let remark=plan.get('remark');
        if(remark){
          let remarkData;
          let remarkTag;
          if(remark.charAt(0)=='{'){
             remarkData = JSON.parse(remark);
          }
          console.log('remarkData:',remarkData);
          if(remarkData){
            remarkTag = remarkData.serviceTag;
          }

          if(remarkTag){
              let executeName = _self.get("dataLoader").findDict(remarkTag).get("typename");
              plan.set('executeName',executeName);
          }else {
            plan.set('executeName','正常完成');
          }
        }else {
          plan.set('executeName','正常完成');
        }
      });
      planList=planList.sortBy("exeStartTime").reverse();
      this.set('planList', planList);
      this.set('refresh',false);
    }.observes("projectFlag","id","dicttype"),

    customerObs: function() {
        let _self = this;
        this.get("store").findRecord('customer', _self.get('id')).then(function(customer) {
            _self.set("customer", customer);
            _self.set("customerInfo", customer);
            Ember.run.schedule('afterRender',function(){
              document.getElementById('first-pane-tab').click();
              $('#tab_1_1').addClass('active in');
            });
        });
    },
    actions: {
        switchTab(code) {
            this.set("curTabCode", code);
        },
        goDetail() {
            let mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('customer-info');
        },
        csItemDetail() {
            let mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('customer-service-detail');
        },
        //个人信息
        information(informationParams) {
            if (informationParams) {
                this.set("informationParams", true);
                this.send('infoClick',"infoParams");
                this.set("healthParams", false);
                this.set("serviceParams", false);
                this.set("recordParams", false);
                this.set("thingParams", false);
                this.set("infoParams", true);
                this.set("liveParams", false);
                this.set("pointParams", false);
                this.set("contactParams", false);
                this.set("healthInfoParams", false);
            }
        },
        //健康监测
        health(healthParams) {
          let _self=this;
            if (healthParams) {
                this.set("informationParams", false);
                this.set("healthParams", true);
                this.set("serviceParams", false);
                this.set("recordParams", false);
                this.set("thingParams", false);
            }
        },
        //服务信息
        service(serviceParams) {
            if (serviceParams) {
                this.set("informationParams", false);
                this.set("healthParams", false);
                this.set("serviceParams", true);
                this.set("recordParams", false);
                this.set("thingParams", false);
            }
            let accountFlag = this.get('accountFlag');
            accountFlag = ++accountFlag;
            this.set('accountFlag', accountFlag);
        },
        //服务记录
        record(recordParams) {
            if (recordParams) {
                this.set("informationParams", false);
                this.set("healthParams", false);
                this.set("serviceParams", false);
                this.set("recordParams", true);
                this.set("thingParams", false);
            }
        },
        //事件记录
        thing(thingParams) {
            if (thingParams) {
                this.set("informationParams", false);
                this.set("healthParams", false);
                this.set("serviceParams", false);
                this.set("recordParams", false);
                this.set("thingParams", true);
            }
        },
        infoClick(infoParams) {
            if (infoParams) {
                this.set("infoParams", true);
                this.set("liveParams", false);
                this.set("pointParams", false);
                this.set("contactParams", false);
                this.set("healthInfoParams", false);
                $("#tab_1_3").removeClass('active in');
                $("#tab_1_4").removeClass('active in');
                $("#tab_1_5").removeClass('active in');
                $("#tab_1_1").addClass('active in');
            }
        },
        liveClick(liveParams) {
            if (liveParams) {
                this.set("infoParams", false);
                this.set("liveParams", true);
                this.set("pointParams", false);
                this.set("contactParams", false);
                this.set("healthInfoParams", false);
            }
        },
        pointClick(pointParams) {
            if (pointParams) {
                this.set("infoParams", false);
                this.set("liveParams", false);
                this.set("pointParams", true);
                this.set("contactParams", false);
                this.set("healthInfoParams", false);
            }
        },
        contactClick(contactParams) {
            if (contactParams) {
                this.set("infoParams", false);
                this.set("liveParams", false);
                this.set("pointParams", false);
                this.set("contactParams", true);
                this.set("healthInfoParams", false);
            }
        },
        healthClick(healthInfoParams) {
            if (healthInfoParams) {
                this.set("infoParams", false);
                this.set("liveParams", false);
                this.set("pointParams", false);
                this.set("contactParams", false);
                this.set("healthInfoParams", true);
            }
            let clickFlag = this.get('clickFlag');
            clickFlag = ++clickFlag;
            this.set('clickFlag', clickFlag);
        },
        addEvent:function(eventModel){
          if (eventModel) {
            this.set("eventEditFlag",true);
            eventModel= new Changeset(eventModel, lookupValidator(TradeValidations), TradeValidations);
            this.set("eventModel",eventModel);
          }else {
            this.set("eventEditFlag",false);
          }
          this.set("showEventModel",true);
        },
        invitationEvent() {
            this.set('showEventModel', false);
        },
        refreshFuntion: function() {
          let _self=this;
        },
        changeEventTime: function(date) {
          this.changeTime(date, "eventModel.eventTime");
        },
        eventTypeSelect: function(type) {
          this.set("eventModel.type", type);
        },
        removeEvent:function(eventModel){
          var self = this;
          App.lookup('controller:business.mainpage').showConfirm("是否确定删除此事件", function() {
            App.lookup('controller:business.mainpage').openPopTip("正在删除");
            eventModel.set("delStatus", 1);
            eventModel.save().then(
              function() {
            var  eventList=self.get("eventList");
              eventList.removeObject(eventModel);
                App.lookup('controller:business.mainpage').showPopTip("删除成功");
              }
            );
          });
        },
        saveEventAction: function(leave) {
          var _self = this;
         var eventModel=this.get("eventModel");
         eventModel.set("customer",this.get("customer"));
          var mainpageController = App.lookup('controller:business.mainpage');
          eventModel.validate().then(function() {
            if (eventModel.get('errors.length') === 0) {
                _self.set("showEventModel",false);
              App.lookup('controller:business.mainpage').openPopTip("正在保存");
              eventModel.save().then(function() {
                var eventEditFlag=_self.get("eventEditFlag");
                if (!eventEditFlag) {
                  var eventList=_self.get("eventList");
                  eventList.pushObject(eventModel);
                eventList =  eventList.sortBy("eventTime");
                   var list  = new Ember.A();
                   for (var i = eventList.length-1; i >=0; i--) {
                    list.pushObject(eventList[i]);
                   }
                  _self.set("eventList",list);
                }
                App.lookup('controller:business.mainpage').showPopTip("保存成功");
               eventModel = _self.get('store').createRecord("customer-event");
               eventModel = new Changeset(eventModel, lookupValidator(TradeValidations), TradeValidations);
               _self.set("eventModel",eventModel);
              },function(err){
                let error = err.errors[0];
              });
            } else {
              eventModel.set("validFlag", Math.random());
            }
          });
        }
    },
    changeTime: function(date, field) {
      if (!date) {
        return;
      }
      var stamp = this.get("dateService").timeToTimestamp(date);
      this.set(field, stamp);
    }
});
