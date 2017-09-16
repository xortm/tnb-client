import Ember from 'ember';
import Changeset from 'ember-changeset';
import HealthValidations from '../../../validations/jujia-health-info';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(HealthValidations, {
    constants: Constants,
    detailEdit: false,
    delFlag: true,
    bloodShow: false, //血压显示
    heartShow: false, //心率显示
    analysisShow:false,//尿液分析显示
    OxygenShow:false,//血氧显示(血氧值、脉搏)
    bloodFatShow:false,//血脂显示
    dateService: Ember.inject.service("date-service"),
    store: Ember.inject.service("store"),
    today: Ember.computed(function() {
        let today = this.get('dateService').getCurrentTime();
        //today=parseInt(today)-86400;
        today = this.get("dateService").timestampToTime(today);
        console.log('today is:',today);
        return today;
    }),
    defaultCustomer: Ember.computed('health.examUser', 'customerListFirst', function() {
        return this.get('health.examUser');
    }),
    healthSelect(healthDict){
      var healthDictCode = healthDict.get("typecode");
      if (healthDictCode == "healthExamType1") {
          this.set("bloodShow", true);
      } else {
          this.set("bloodShow", false);
      }
      if (healthDictCode == "healthExamType3") {
          this.set("heartShow", true);
      } else {
          this.set("heartShow", false);
      }
      if (healthDictCode == "healthExamType12") {
          this.set("analysisShow", true);
      } else {
          this.set("analysisShow", false);
      }
      if (healthDictCode == "healthExamType2") {
          this.set("OxygenShow", true);
      } else {
          this.set("OxygenShow", false);
      }
      if (healthDictCode == "healthExamType13") {
          this.set("bloodFatShow", true);
      } else {
          this.set("bloodFatShow", false);
      }
      this.get('health').set('itemRemark',healthDict.get('remark'));
    },
    healthObs: function() {
        var model = this.get("health");
        console.log("model health", model);
        if (!model) {
            return null;
        }
        var healthModel = new Changeset(model, lookupValidator(HealthValidations), HealthValidations);
        this.set("healthModel", healthModel);
    }.observes("health"),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.healthy-data');
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
                this.get("health").rollbackAttributes();
                this.set("healthModel", new Changeset(this.get("health"), lookupValidator(HealthValidations), HealthValidations));
            } else {
                mainpageController.switchMainPage('healthy-data', {});
            }
        },
        //存储
        saveHealth() {
            console.log("++++++++++++delFlag+++++++++++++", this.get("delFlag"));
            if (this.get("delFlag")) {
                //alert("保存进来了");
                var _self = this;
                var healthModel = this.get("healthModel");
                var mainpageController = App.lookup('controller:business.mainpage');
                var editMode = this.get('editMode');
                var id = this.get('id');
                healthModel.validate().then(function() {
                  console.log('healthModel is',healthModel);
                  console.log('healthModel errors',healthModel.get('errors.length'));
                    if (healthModel.get('errors.length') === 0) {
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                        healthModel.save().then(function() {
                            App.lookup('controller:business.mainpage').showPopTip("保存成功");
                            if (id && editMode == 'edit') {
                                console.log("id is", id);
                                console.log("editMode is", editMode);
                                _self.set('detailEdit', false);
                            } else {
                                mainpageController.switchMainPage('healthy-data',{});
                                _self.set('detailEdit', false);
                            }
                        });
                    } else {
                        healthModel.set("validFlag", Math.random());
                    }
                });
            }
        },

        //删除按钮
        delById: function() {
            this.set("delFlag", false);
            var health=this.get('health');
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此健康信息", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                health.set("delStatus", 1);
                health.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    _self.set("delFlag", true);
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('healthy-data');
                });
            });
        },
        changeExamDateTimeAction(date) {
            var stamp = this.get("dateService").timeToTimestamp(date);
            this.set("healthModel.examDateTime", stamp);
        },
        addHealthSelect(healthDict){
          this.get("healthModel").set("itemtype", healthDict);
          this.healthSelect(healthDict);
        },
        selectCustomer(customer){
          console.log('customer is',customer);
          console.log('healthModel',this.get('healthModel'));
          this.get('health').set('examUser',customer);
          this.get('healthModel').set('examUser',customer);
          //this.set('healthModel.examUser',customer);
        }
    }
});
