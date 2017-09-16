import Ember from 'ember';
import Changeset from 'ember-changeset';
import NoticeDetailValidations from '../../../validations/notice-detail';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(NoticeDetailValidations, {
    constants: Constants,
    detailEdit: false,
    delFlag: true,
    dateService: Ember.inject.service("date-service"),
    dataLoader: Ember.inject.service("data-loader"),
    store: Ember.inject.service("store"),
    today: Ember.computed(function() {
        let today = this.get('dateService').getCurrentTime();
        //today=parseInt(today)-86400;
        today = this.get("dateService").timestampToTime(today);
        console.log('today is:',today);
        return today;
    }),
    // init:function(){
    //   console.log("customerList in controller:",this.get("customerList"));
    // },
    messageObs: function() {
        var model = this.get("message");
        console.log("model message", model);
        if (!model) {
            return null;
        }
        var messageModel = new Changeset(model, lookupValidator(NoticeDetailValidations), NoticeDetailValidations);
        this.set("messageModel", messageModel);
        console.log("messageModel in controller:", messageModel);
    }.observes("message"),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.notice-management');
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    actions: {
        //执行状态
        businessTypeSelect: function(Dict) {
            this.get("messageModel").set("businessType", Dict);
        },

        dpShowAction(e) {},
        invalid() {
            //alert("invalid");
        },
        // changeCreateTimeAction(date) {
        //     console.log("date is who", date);
        //     var stamp = this.get("dateService").timeToTimestamp(date);
        //     // this.set("messageModel.createTimeDate", stamp);
        //     this.set("messageModel.createTime", stamp);
        // },
        selectCustomer(customer){
          console.log("customer init:",customer);
          var staffObj = this.get("dataLoader").findStaff(customer.get("id"));
          console.log("staffObj init:",staffObj);
          var user = staffObj.get("staff");
          console.log("user init:",user);
          // this.get('message').set('toUser',user);
          this.get('messageModel').set('toUser',user);
          this.get('messageModel').set('customer',customer);
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
                this.get("message").rollbackAttributes();
                this.set("messageModel", new Changeset(this.get("message"), lookupValidator(NoticeDetailValidations), NoticeDetailValidations));
            } else {
                mainpageController.switchMainPage('notice-management', {});
            }
        },
        //存储
        saveMessage() {
            console.log("++++++++++++delFlag+++++++++++++", this.get("delFlag"));
            if (this.get("delFlag")) {
                //alert("保存进来了");
                var _self = this;
                var messageModel = this.get("messageModel");
                messageModel.set('type',4);
                console.log("messageModel businessType:",messageModel.get("businessType"));
                console.log("messageModel toUser:",messageModel.get("toUser"));
                // console.log("messageModel createTime:",messageModel.get("createTime"));
                console.log("messageModel content:",messageModel.get("content"));
                console.log("messageModel type:",messageModel.get("type"));
                var mainpageController = App.lookup('controller:business.mainpage');
                var editMode = this.get('editMode');
                var id = this.get('id');
                messageModel.validate().then(function() {
                    if (messageModel.get('errors.length') === 0) {
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                        messageModel.save().then(function() {
                            App.lookup('controller:business.mainpage').showPopTip("保存成功");
                            if (id && editMode == 'edit') {
                                _self.set('detailEdit', false);
                            } else {
                                mainpageController.switchMainPage('notice-management');
                                _self.set('detailEdit', false);
                            }
                        });
                    } else {
                        messageModel.set("validFlag", Math.random());
                    }
                });
            }
        },
        //删除按钮
        delById: function() {
            this.set("delFlag", false);
            var message=this.get('message');
            console.log("message in controller:",message);
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此执行报告", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                message.set("delStatus", 1);
                message.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    _self.set("delFlag", true);
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('notice-management');
                });
            });
        },
    }
});
