import Ember from 'ember';
import BaseBusiness from '../base-business';
const {accountType1,accountType2} = Constants;
export default BaseBusiness.extend({
  dateService: Ember.inject.service("date-service"),
  header_title: "老人信息",
  model(){
    return {};
  },
  setupController: function(controller,model){
    this._super(controller,model);
    var _self = this;

      // _self.store.query("tradeaccount",{filter:{customer:{id:customerId}}}).then(function(tradeaccounts){
      //   var tradeaccount = tradeaccounts.get("firstObject");
      //   //tradeaccounts 只会有两条 一条是电子钱包 一条是保证金账户
      //   console.log("tradeaccount1 tradeaccounts",tradeaccounts);
      //   tradeaccounts.forEach(function(item){
      //     var balance = item.get("balance");
      //     var type = item.get("type.typecode");
      //     console.log("tradeaccount1 itemType.typecode",type);
      //     if(type==Constants.accountType2){//电子钱包
      //       controller.set("eWallet",balance);
      //       console.log("tradeaccount1 eWallet",balance);
      //     }else if(type==Constants.accountType1){//保证金账户
      //       controller.set("deposit",balance);
      //       console.log("tradeaccount1 deposit",balance);
      //     }
      //   });
      //   console.log("customer111111",customer);
      // });
      // controller.set("customer",customer);

  },
});
