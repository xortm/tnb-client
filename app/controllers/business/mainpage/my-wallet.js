import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
const {bizTypeCsOnline_Pay,bizTypeWithdraw_Cash,bizTypeCsCallOut_Pay,bizTypeCsCallIn_Pay,bizTypeCsMake_ADeal,
  bizTypeCsInviteCode_Commission,bizTypeCsForwCircle_FriendsPay,withdraw_Cash,payStatus_processing,
  payType_apply,authenticate_succ,proportion_platform} = Constants;

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "tradingRecord",
  infiniteModelName: "deal-flow",
  infiniteContainerName:"myWalletContainer",
  showModal:false,
  content:'',

  curuserId:Ember.computed(function(){
    var curuser = this.get('global_curStatus').getUser();
    return curuser.get('id');
  }),
  myBalance:Ember.computed("balance",function () {
    var _self = this;
    var curuser = this.get('global_curStatus').getUser();
    this.store.query("account",{filter:{user:{id:curuser.get("id")}}}).then(function(item){
      var theUser = item.get('firstObject');
      console.log("theUser",theUser);
      console.log("theUser",theUser.get('balance'));
      _self.set("myBalance",theUser.get('balance'));
    });
  }),
  provalue:Ember.computed(function(){
    var _self = this;
    this.get('store').query('charge',{filter:{code:proportion_platform}}).then(function(proportions){
      var proportion = proportions.get('firstObject');
      console.log('proportion get in apply-cash of js',proportion.get('value'));
      _self.set('provalue',(proportion.get('value'))*100);
    });
  }),
  // applyDisabled:Ember.computed('content',function() {
  //   console.log('in applyDisabled now ');
  //   var reg = /^[1-9]\d*$/;
  //   console.log('reg get in prepaid',reg.test(this.get('content')));
  //   if(this.get('content')>=2 && reg.test(this.get('content'))) {
  //     console.log('false here in js');
  //     return false;
  //   }else {
  //     console.log('true here in js');
  //     return true;
  //   }
  // }),
  actions:{
    applycash(){
      var self = this;
      self.set('applyDisabled',true);
      var curuser = this.get('global_curStatus').getUser();
      var amount = this.get('content');
      var reg = /^[1-9]\d*$/;
      if(amount>=2 && reg.test(amount)) {
        console.log('false here in js');
        var paytype = payType_apply;
        console.log("paytype",paytype);
        var paystatus = payStatus_processing;
        var remark = this.get('remark');//备注
        //var userAccount = this.get('store').query('account',{filter:{user:{id:curuser.get('id')}}});
        var user = this.get('store').createRecord('user',{});
        var payRecord = this.get('store').createRecord('pay-record',{});

        user.set('id',curuser.get('id'));
        payRecord.set('amount',amount);
        payRecord.set('payType',paytype);
        payRecord.set('payStatus',paystatus);//后面再改状态是后台修改
        payRecord.set('remark',remark);
        payRecord.set('user',user);

        // payRecord.set('errcode','1');
        // payRecord.set('failReason','次数过多！');

        payRecord.save().then(function(record){
          console.log('getgetget!!!!!',record.get('errcode'));
          if(!record.get('errcode')){
            console.log('in shenqing chenggong ');
            alert('申请提交成功！');
          }
          else{
            console.log('in shenqing shibai ');
            alert(record.get('failReason'));//显示提现失败原因，后台返回数据
          }
          self.set('showModal',false);
          self.set("content","");
          self.get('target').send('saveRefresh');
          //self.get('target').refresh();
          //self.refresh();
        });
      }else {
        return alert("请填写正确提现金额");
      }
    },
    withdraw(){
      var self = this;
      // this.set('applyDisabled',false);
      console.log("jinrucifangfa");
      var curuser = this.get('global_curStatus').getUser();
      if(curuser.get('status')===authenticate_succ){
        self.store.query('wechat',{filter:{user:{id:curuser.get('id')}}}).then(function(wechats){
          var wechat = wechats.get('firstObject');
          if(wechat && wechat.get('bindStatus')){
            self.set("showModal",true);
          }
          else{
            if(!wechat){
              var wechatsave = self.store.createRecord('wechat',{});
              self.get('global_ajaxCall').set('action','wechatBind');
              wechatsave.save().then(function(wechatGet){
                self.set('QrUrl',wechatGet.get('AbsoluteqrUrl'));
                self.set('wechatModal',true);
              });
            }
            else{
              wechat.save().then(function(wechatGet){
                self.set('QrUrl',wechatGet.get('AbsoluteqrUrl'));
                self.set('wechatModal',true);
              });
            }

          }
        });
      }
      else{
        this.set('alertmodal',true);
      }
    },
    confirmbind(){
      var self = this;
      var curuser = this.get('global_curStatus').getUser();
      this.store.query('wechat',{filter:{user:{id:curuser.get('id')}}}).then(function(wechats){
        var wechat = wechats.get('firstObject');
        if(wechat && wechat.get('bindStatus')){
          self.set('wechatModal',false);
          self.set('showModal',true);
        }
        else{
        self.set('binderror','未绑定成功，请重试');
        }
      });
      self.set('binderror','');
    },
    cancelSubmit(){
      this.set('showModal',false);
    },
    cancelwechat(){
      this.set('wechatModal',false);
      this.set('binderror','');
    },
    // cancelwechatBindSuc(){
    //   this.set('bindwechatSucModal',false);
    // },
    cancelwechatBindFail(){
      console.log('in wechatFailModal set false');
      this.set('bindwechatFailModal',false);
    },
    cancelpassSubmit(){
      this.set('alertmodal',false);
    },
    transationTo(){
      var controller = App.lookup('controller:business.mainpage');
      controller.switchMainPage('business-mine');
      this.set('alertmodal',false);
    },

  }

});
