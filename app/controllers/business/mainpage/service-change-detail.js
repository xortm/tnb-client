import Ember from 'ember';
import Changeset from 'ember-changeset';
import ChangeValidations from '../../../validations/change';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(ChangeValidations, {
    constants: Constants,
    detailEdit: false,
    delFlag: true,
    dateService: Ember.inject.service("date-service"),
    store: Ember.inject.service("store"),
    dataLoader: Ember.inject.service("data-loader"),
    defaultFloor: Ember.computed('change.floor', function() {
        return this.get('change.floor');
    }),
    isOkEdit:Ember.computed('change.status',function(){
      var status=this.get('change.status');
      console.log('status is',status);
      if(status.get('typecode')=='applyStatus1'){//未生效
        return true;
      }
      if(status.get('typecode')=='applyStatus2'){//已生效
        return false;
      }
    }),
    today: Ember.computed(function() {
        let today = this.get('dateService').getCurrentTime();
        today=parseFloat(today)-86400;
        today = this.get("dateService").timestampToTime(today);
        console.log('today is:',today);
        return today;
    }),
    changeObs: function() {
        var model = this.get("change");
        console.log("model change", model);
        if (!model) {
            return null;
        }
        var changeModel = new Changeset(model, lookupValidator(ChangeValidations), ChangeValidations);
        this.set("changeModel", changeModel);
    }.observes("change"),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.service-change-management');
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    abd: function() {},
    defaultCustomer: Ember.computed('change.customer', 'customerListFirst', function() {
        //if (this.get('change.customer') && this.get('change.customer').content) {
        return this.get('change.customer');
        //}
        //return this.get('customerListFirst');
    }),
    defaultBed: Ember.computed('change.bedNew', 'bedListFirst', function() {
        return this.get('change.bedNew');
    }),
    priceNewObs:function(){
      let bedPriceNew = parseFloat(this.get('changeModel.bedPriceNew'))||0;
      let foodPriceNew = parseFloat(this.get('changeModel.foodPriceNew'))||0;
      let projectPriceNew = parseFloat(this.get('changeModel.projectPriceNew'))||0;
      let price = bedPriceNew + foodPriceNew + projectPriceNew;
      this.set('changeModel.priceNew',price);
    }.observes('changeModel.bedPriceNew','changeModel.foodPriceNew','changeModel.projectPriceNew'),
    actions: {
      dpShowAction(e) {

      },
        invalid() {
            //alert("invalid");
        },
        //编辑按钮
        detailEditClick: function(change) {
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
                this.get("change").rollbackAttributes();
                this.set("changeModel", new Changeset(this.get("change"), lookupValidator(ChangeValidations), ChangeValidations));
            } else {
                mainpageController.switchMainPage('service-change-management', {});
            }
        },
        //存储
        saveChange() {
            if (this.get("delFlag")) {
                var _self = this;
                var changeModel = this.get("changeModel");
                var mainpageController = App.lookup('controller:business.mainpage');
                var editMode = this.get('editMode');
                var id = this.get('id');
                let statusInfo = this.get("dataLoader").findDict(Constants.applyStatus1);
                console.log("statusInfo is", statusInfo);
                changeModel.validate().then(function() {
                    //alert("save   out");
                    if (changeModel.get('errors.length') === 0) {
                        changeModel.set("status", statusInfo);
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                        changeModel.save().then(function() {
                            var customerId = _self.get("change.customer.id");
                            _self.get("store").findRecord('customer',customerId).then(function(customer) {
                                customer.set("applyFlag", 1);
                                customer.save();
                                App.lookup('controller:business.mainpage').showPopTip("保存成功");
                            });
                            // console.log('服务变更：customer',customer);
                            // customer.set("applyFlag", 1);
                            // customer.save().then(function(){});

                            if (id && editMode == 'edit') {
                                console.log("id is", id);
                                console.log("editMode is", editMode);
                                _self.set('detailEdit', false);
                            } else {
                                mainpageController.switchMainPage('service-change-management');
                                _self.set('detailEdit', false);
                            }
                        });
                    } else {
                        changeModel.set("validFlag", Math.random());
                    }
                });
            }
        },
        //变更状态
        // statusSelect(statusDict) {
        //     this.get("change").set("status", statusDict);
        // },
        //变更后餐饮标准
        foodLevelNewSelect(foodLevelNewDict) {
            this.get("change").set("foodLevelNew", foodLevelNewDict);
            // this.set('changeModel.foodPriceOld',foodLevelNewDict.get('typeValue'));
            this.set('changeModel.foodPriceNew',foodLevelNewDict.get('typeValue'));
        },
        //选择楼层
        selectFloor(floor) {
            console.log("controller:floor", floor);
            var _self = this;
            this.set('change.floor',floor);
            var obj = this.get("dataLoader").findDict(Constants.bedStatusIdle);
            console.log("obj is", obj);
            var statusId = obj.get("id");
            console.log("statusId is", statusId);
            this.store.query('bed', {
                filter: {
                    room: {
                        '[floor][id]': floor.get('id')
                    }
                },
                '[status][id]': statusId
            }).then(function(bedList) {
                bedList.forEach(function(bed) {
                    bed.set('bedPinyin', pinyinUtil.getFirstLetter(bed.get("name")));
                });
                _self.set('bedList', bedList);
            });
        },
        //申请人
        selectCustomer(customer) {
          let _self = this;
            this.set("customer", customer);
            this.get('changeModel').set("customer", customer);
            this.set('change.customer', customer);
            var bedInfo = customer.get("bed");
            var diningStandard = customer.get("diningStandard");
            var actualPrice = customer.get("actualPrice");
            this.store.query('nursingproject',{filter:{customer:{id:customer.get('id')}}}).then(function(projectList){
              let project = projectList.get('firstObject');
              _self.get('changeModel').set("bedOld", bedInfo);
              _self.get('changeModel').set("foodLevelOld", diningStandard);
              _self.get('change').set("foodLevelOld", diningStandard);
              _self.get('changeModel').set("priceOld", actualPrice);
              _self.set('change.projectPriceOld',project.get('price'));
              _self.set('changeModel.projectPriceOld',project.get('price'));
              _self.set('changeModel.projectPriceNew',project.get('price'));
            });
        },
        //变更后床位号
        selectBed(bed) {
            this.get('changeModel').set("bedNew", bed);
            this.set('change.bedNew', bed);
            // this.set('changeModel.bedPriceOld',bed.get('price'));
            this.set('changeModel.bedPriceNew',bed.get('price'));
        },

        //删除按钮
        delById: function() {
            this.set("delFlag", false);
            var change=this.get('change');
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此变更信息", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                change.set("delStatus", 1);
                change.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    _self.set("delFlag", true);
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('service-change-management');
                });
            });
        },
        changeEffectiveAction:function(date){
          var stamp = this.get("dateService").timeToTimestamp(date);
          this.set("changeModel.effectiveTime", stamp);
        }
    }
});
