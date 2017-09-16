import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';
const {payStatus_not,payStatus_processing,payType_recharge,authenticate_succ} = Constants;

export default BaseBusiness.extend(Pagination,{
  header_title:'充值记录',
  model(){
    var _self = this;
    this.set('header_title','充值记录');
    var curUser = this.get('global_curStatus').getUser();
      var params = _self.buildQueryParams();
      var payrecordList = _self.findPaged('pay-record',params);
      return Ember.RSVP.hash({
        curUser:curUser,
        payrecordList:payrecordList,
      });
  },
  setupController(controller,model){
    console.log('nfffffffffffffffffffffffwe');
    this._super(controller,model);
    var _self = this;
    var curuser = this.get('global_curStatus').getUser();
    this.get('store').query('account',{filter:{user:{id:curuser.get('id')}}}).then(function(accounts){
      var account = accounts.get('firstObject');
      controller.set('balance',account.get('balance'));
    });
    controller.reopen({
      dateService: Ember.inject.service('date-service'),
      showModal:false,
      alertmodal:false,
      // wechatmodal:false,
      content:'',
      prepaidDisabledClick:true,
      prepaidDisabled: Ember.computed('content','prepaidDisabledClick',function() {
        // var reg = /^[0-9]*$/;
        var reg = /^[1-9]\d*$/;
        console.log('reg get in prepaid',reg.test(this.get('content')));
        if(this.get('prepaidDisabledClick')){
        if(this.get('content') && reg.test(this.get('content'))) {
          console.log('false here in js');
          return false;
        }
        else {
          console.log('true here in js');
          return true;
        }
      }
      return true;
      }),
      // chooseDateFrom:Ember.computed(function(){
      //   var date = new Date();
      //   var format = ("YYYY-MM-DD");
      //   return moment(date).format(format);
      // }),
      chooseDateTo:Ember.computed(function(){
        var date = new Date();
        var format = ("YYYY-MM-DD");
        return moment(date).format(format);
      }),
      actions:{
        doRepayment:function(payrecord){
          this.set('QrWechat',payrecord.get('wechatQrPayUrl'));
          this.set('wechatmodal',true);
        },
        rechargeSuccCheck: function(){
          console.log('in rechargeSuccCheck here ');
          this.set('wechatSucModal',true);
          this.set('wechatmodal',false);
        },
        rechargeFailCheck:function(){
          this.set('wechatFailModal',true);
          this.set('wechatmodal',false);
        },
        prepaidCash(){
          var self = this;
          // console.log('get prepaidCash at before',controller.get('prepaidDisabled'));
          self.set('prepaidDisabledClick',false);
          // console.log('get prepaidCash at ',controller.get('prepaidDisabled'));
          var curuser = this.get('curUser');
          var curtask = this.get('global_curStatus').getTask();
          var amount = this.get('content');
          var paytype = payType_recharge;
          var paystatus = payStatus_not;
          var remark = this.get('remark');
          //var userAccount = this.get('store').query('account',{filter:{user:{id:curuser.get('id')}}});
          var user = this.get('store').createRecord('user',{});
          var payRecord = this.get('store').createRecord('pay-record',{});

          user.set('id',curuser.get('id'));
          payRecord.set('amount',amount);
          payRecord.set('payType',paytype);
          payRecord.set('payStatus',paystatus);//后面再改状态是后台修改
          payRecord.set('remark',remark);
          payRecord.set('user',user);
          payRecord.set('payChannel',1);

          // payRecord.set('errcode','1');
          // payRecord.set('failReason','次数过多！');

          payRecord.save().then(function(record){
            console.log('getgetget!!!!!',record.get('errcode'));
            if(!record.get('errcode')){
              console.log('in shenqing chenggong ');
            }
            else{
              console.log('in shenqing shibai ');
              alert(record.get('failReason'));
            }
            if(record.get('wechatQrPay')){
              console.log('jfoeihfwieauhfiega',record.get('wechatQrPay'));
              self.set('QrWechat',record.get('wechatQrPayUrl'));
              self.set('wechatmodal',true);
            }
            self.set('showModal',false);
            _self.refresh();
          });
        },
        doPrepaid(){
        //   var curuser = this.get('global_curStatus').getUser();
        //   if(curuser.get('status')===authenticate_succ){
            this.set("showModal",true);
        //   }
        //   else{
            // this.set('alertmodal',true);
          // }
        },
        choosetime(){
          console.log('choose time ');
          function change(time){
            var date = new Date();
            date.setFullYear(time.substring(0,4));
            date.setMonth(time.substring(5,7)-1);
            date.setDate(time.substring(8,10));
            date.setHours(time.substring(11,13));
            date.setMinutes(time.substring(14,16));
            date.setSeconds(time.substring(17,19));
            return Date.parse(date)/1000;
          }
          var endTime = this.chooseDateTo;
          console.log('endTimeendTime',endTime);
          var a = this.get('dateService').getLastSecondStampOfDayString(endTime);
          var beginTime = this.chooseDateFrom;
          var b = change(beginTime);
          this.set('a',a);
          this.set('b',b);
          console.log('aaabbb a',this.get('a'));
          _self.doQuery();
        },
        cancelpassSubmit(){
          this.set('alertmodal',false);
        },
        cancelSubmit(){
          this.set('showModal',false);
        },
        cancelwechat(){
          console.log('cancel wechat out this',this);
          console.log('cancel wechat out wechatmodal before',this.get('wechatmodal'));
          this.set('wechatmodal',false);
          console.log('cancel wechat out wechatmodal',this.get('wechatmodal'));
        },
        cancelwechatSuc(){
          console.log('fewfnjjjjjw');
          _self.refresh();
          this.set('wechatSucModal',false);
        },
        cancelwechatFail(){
          this.set('wechatFailModal',false);
        },
        transationTo(){
          var csInfoController = App.lookup('controller:business.mainpage');
          csInfoController.switchMainPage('cs-info');
          this.set('alertmodal',false);
        },
      },
    });
    controller.setProperties(model);
  },
  buildQueryParams(){
    var _self = this;
    var params = this.pagiParamsSet();
    // var curTask = this.get('global_curStatus').getTask().get('task');
    var curUser = this.get('global_curStatus').getUser();
    var curController = this.getCurrentController();
    var filter = {};
    filter = $.extend({},filter,{user:{id:curUser.get('id')}});
    filter = $.extend({},filter,{payType:payType_recharge});
    if(curController && (curController.get('chooseDateFrom') || curController.get('chooseDateTo'))){
      filter = $.extend({},filter,{'createTime@$lte':curController.get('a'),'createTime@$gte':curController.get('b')});
    }
    var sort = {createTime:"desc"};
    params.sort = sort;
    params.filter = filter;
    console.log("params is:",params);
    return params;
  },
  doQuery: function(){
    console.log('defaultCallaaaaaa');
    var params = this.buildQueryParams();//拼查询条件
    var payrecordList = this.findPaged('pay-record',params);
    this.getCurrentController().set("payrecordList",payrecordList);
  },
});
