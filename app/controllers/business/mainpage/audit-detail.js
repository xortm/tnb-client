import Ember from 'ember';

export default Ember.Controller.extend({
    showAudit: false,
    dataLoader: Ember.inject.service("data-loader"),
    constants: Constants,
    actions: {
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
            let status = this.get("dataLoader").findDict("billStatus2");
            billInfo.set('billStatus', status);
            billInfo.save().then(function() {
                App.lookup('controller:business.mainpage').openPopTip("正在审核");
                _self.set('showAudit', false);
                let mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('audit-management');
                App.lookup('controller:business.mainpage').showPopTip("审核成功");
            });
        },
        recall() {
            this.set('showAudit', false);
        },
        rejected() {
            let _self = this;
            let billInfo = this.get('billInfo');
            let status = this.get("dataLoader").findDict("billStatus3");
            billInfo.set('billStatus', status);
            billInfo.save().then(function() {
                App.lookup('controller:business.mainpage').openPopTip("正在审核");
                _self.set('showAudit', false);
                let mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('audit-management');
                App.lookup('controller:business.mainpage').showPopTip("审核成功");
            });
        }
    }
});
