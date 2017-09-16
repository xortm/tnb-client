import Ember from 'ember';
import Changeset from 'ember-changeset';
import ReportValidations from '../../../validations/execution-report';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(ReportValidations, {
    constants: Constants,
    detailEdit: false,
    delFlag: true,
    dateService: Ember.inject.service("date-service"),
    store: Ember.inject.service("store"),
    today: Ember.computed(function() {
        let today = this.get('dateService').getCurrentTime();
        //today=parseInt(today)-86400;
        today = this.get("dateService").timestampToTime(today);
        console.log('today is:',today);
        return today;
    }),
    reportObs: function() {
        var model = this.get("report");
        console.log("model report", model);
        if (!model) {
            return null;
        }
        var reportModel = new Changeset(model, lookupValidator(ReportValidations), ReportValidations);
        this.set("reportModel", reportModel);
    }.observes("report"),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.exe-report-data');
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    actions: {
        dpShowAction(e) {},
        invalid() {
            //alert("invalid");
        },
        //编辑按钮
        detailEditClick: function() {
            this.set('detailEdit', true);
        },
        //取消按钮
        detailCancel: function() {
            var id = this.get('id');
            var editMode = this.get('editMode');
            var mainpageController = App.lookup('controller:business.mainpage');
            this.set('detailEdit', false);
            //alert("详情");
            if (id && editMode == 'edit') {
                this.get("report").rollbackAttributes();
                this.set("reportModel", new Changeset(this.get("report"), lookupValidator(ReportValidations), ReportValidations));
            } else {
                mainpageController.switchMainPage('exe-report-data', {});
            }
        },
        //存储
        saveReport() {
            console.log("++++++++++++delFlag+++++++++++++", this.get("delFlag"));
            if (this.get("delFlag")) {
                //alert("保存进来了");
                var _self = this;
                var reportModel = this.get("reportModel");
                var mainpageController = App.lookup('controller:business.mainpage');
                var editMode = this.get('editMode');
                var id = this.get('id');
                reportModel.validate().then(function() {
                    if (reportModel.get('errors.length') === 0) {
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                        reportModel.save().then(function() {
                            App.lookup('controller:business.mainpage').showPopTip("保存成功");
                            if (id && editMode == 'edit') {
                                _self.set('detailEdit', false);
                            } else {
                                mainpageController.switchMainPage('exe-report-data');
                                _self.set('detailEdit', false);
                            }
                        });
                    } else {
                        reportModel.set("validFlag", Math.random());
                    }
                });
            }
        },
        changeCreateTimeAction(date) {
            console.log("date is who", date);
            var stamp = this.get("dateService").timeToTimestamp(date);
            this.set("reportModel.createTime", stamp);
        },
        selectCustomer(customer){
          this.get('report').set('customer',customer);
          this.get('reportModel').set('customer',customer);
        },
        //删除按钮
        delById: function() {
            this.set("delFlag", false);
            var report=this.get('report');
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此执行报告", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                report.set("delStatus", 1);
                report.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    _self.set("delFlag", true);
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('exe-report-data');
                });
            });
        },
    }
});
