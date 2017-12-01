import Ember from 'ember';
import BaseBusiness from '../base-business';
const { taskStatus_begin,taskStatus_isPassed,taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail,taskApplyStatus_invited,taskApplyStatus_SuccNotLocateSeat,taskApplyStatus_refuseInvitation} = Constants;

export default BaseBusiness.extend({
  pageyModelListName: "content",
  feedService: Ember.inject.service('feed-bus'),
  // header_title: "任务列表",
  queryParams: {
      customerIdParams: {
          refreshModel: true
      },
      scanFlag: {
          refreshModel: true
      },
  },

  model() {
    return {};
  },
  setupController(controller, model){
    var _self = this;
    this._super(controller, model);
    // controller.set("sortShow",true);
    controller.set("squareScanShow",true);
  },

  initCustomerServiceData:function(){
    var c1 = Ember.Object.create({
      id:1,
      name:'刘立娜',
      room:'A301-5床',
      staffName: '护工一',
      services:new Ember.A([Ember.Object.create({
        id:1,
        name:'翻身',
        cnt:1,
        detail:new Ember.A([{
          content:"翻身时长为5分钟，客户没有不良反应(11:20)"
        },{
          content:"翻身时长为3分钟，客户没有不良反应(15:20)"
        }]),
      }),Ember.Object.create({
        id:2,
        name:'喂药',
        cnt:2,
        detail:new Ember.A([{
          content:"xx药品，喂了3粒，顺利完成(13:20)"
        }]),
      }),Ember.Object.create({
        id:3,
        name:'上厕所',
        cnt:1
      })]),
    });
    var c2 = Ember.Object.create({
      id:2,
      name:'王贵福',
      room:'A301-6床',
      staffName: '护工一',
      services:new Ember.A([Ember.Object.create({
        id:4,
        name:'翻身',
        cnt:1
      }),Ember.Object.create({
        id:5,
        name:'喂药',
        cnt:2
      }),Ember.Object.create({
        id:6,
        name:'上厕所',
        cnt:1
      })]),
    });
    return new Ember.A([c1,c2]);
  }
});
