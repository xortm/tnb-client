import Ember from 'ember';

export default Ember.Controller.extend({
    showAudit: false,
    dataLoader: Ember.inject.service("data-loader"),
    constants: Constants,
    actions: {
      rejectedModel(){
        this.set('showRejectedModel',true);
      },
        detailCancel() {
            let mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('audit-management');
        },
        audit() {
          this.set('showAudit', true);
        },
        passed() {
            let _self = this;
            let billInfo = this.get('billInfo');

            let flag = this.get('flag');
            if(flag == 'billType'){
              let status = this.get("dataLoader").findDict("billStatus2");
              billInfo.set('billStatus', status);
            }else if(flag == 'rechargeType'){
              let status = this.get("dataLoader").findDict("rechargeStatus2");
              billInfo.set('rechargeStatus', status);
            }

            App.lookup('controller:business.mainpage').openPopTip("正在审核");
            billInfo.save().then(function() {
                App.lookup('controller:business.mainpage').showPopTip("审核成功");
                _self.set('showAudit', false);
                let mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('audit-management');

            },function(err){
              App.lookup('controller:business.mainpage').showPopTip("审核失败");
            });
        },
        recall() {
            this.set('showAudit', false);
            this.set('showRejectedModel',false);
            this.set('showAuditRecharge', false);
            this.set('showRejectedModelRecharge',false);
        },
        rejected() {
            let _self = this;
            let billInfo = this.get('billInfo');

            let flag = this.get('flag');
            if(flag == 'billType'){
              let status = this.get("dataLoader").findDict("billStatus3");
              billInfo.set('billStatus', status);
            }else if(flag == 'rechargeType'){
              let status = this.get("dataLoader").findDict("rechargeStatus3");
              billInfo.set('rechargeStatus', status);
            }
            App.lookup('controller:business.mainpage').openPopTip("正在审核");
            billInfo.save().then(function() {

                App.lookup('controller:business.mainpage').showPopTip("审核成功");
                _self.set('showRejectedModel', false);
                let mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('audit-management');

            },function(err){
              App.lookup('controller:business.mainpage').showPopTip("审核失败");
            });
        }
    }
});
