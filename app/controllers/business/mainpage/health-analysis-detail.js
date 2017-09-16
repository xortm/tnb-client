import Ember from 'ember';
import Changeset from 'ember-changeset';
import AnalysisValidations from '../../../validations/health-analysis';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(AnalysisValidations, {
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
    analysisObs: function() {
        var model = this.get("analysis");
        console.log("model analysis", model);
        if (!model) {
            return null;
        }
        var analysisModel = new Changeset(model, lookupValidator(AnalysisValidations), AnalysisValidations);
        this.set("analysisModel", analysisModel);
    }.observes("analysis"),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.health-analysis');
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    defaultCustomer: Ember.computed('analysis.customer', 'customerListFirst', function() {
        return this.get('analysis.customer');
    }),
    // defaultStaff: Ember.computed('warning.operater', 'staffListFirst', function() {
    //     return this.get('warning.operater');
    // }),
    actions: {
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
                this.get("analysis").rollbackAttributes();
                this.set("analysisModel", new Changeset(this.get("analysis"), lookupValidator(AnalysisValidations), AnalysisValidations));
            } else {
                mainpageController.switchMainPage('health-analysis', {});
            }
        },
        //存储
        saveAnalysis() {
            //alert("保存");
            console.log("++++++++++++delFlag+++++++++++++", this.get("delFlag"));
            if (this.get("delFlag")) {
                //alert("保存进来了");
                var _self = this;
                var analysisModel = this.get("analysisModel");
                var mainpageController = App.lookup('controller:business.mainpage');
                var editMode = this.get('editMode');
                var id = this.get('id');
                analysisModel.validate().then(function() {
                    //alert("save   out");
                    if (analysisModel.get('errors.length') === 0) {
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                        analysisModel.save().then(function() {
                            App.lookup('controller:business.mainpage').showPopTip("保存成功");
                            if (id && editMode == 'edit') {
                                console.log("id is", id);
                                console.log("editMode is", editMode);
                                _self.set('detailEdit', false);
                            } else {
                                mainpageController.switchMainPage('health-analysis');
                                _self.set('detailEdit', false);
                            }
                        });
                    } else {
                        analysisModel.set("validFlag", Math.random());
                    }
                });
            }
        },
        //用户姓名
        selectParent(customer) {
            this.get('analysisModel').set("customer", customer);
            this.set('analysis.customer', customer);
        },
        //处理人
        // selectStaff(staff) {
        //     this.set("staff", staff);
        //     this.get("warning").set("operater", staff);
        // },
        changeAnalysisAction(date) {
            console.log("date is who", date);
            var stamp = this.get("dateService").timeToTimestamp(date);
            this.set("analysisModel.createTime", stamp);
        },
        typeSelect: function(typeDict) {
            this.get("analysis").set("type", typeDict);
        }, //血型字典
        //删除按钮
        delById: function() {
            this.set("delFlag", false);
            var analysis=this.get('analysis');
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此健康建议", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                analysis.set("delStatus", 1);
                analysis.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    _self.set("delFlag", true);
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('health-analysis');
                });
            });
        },
        dpShowAction(e) {},
    }
});
