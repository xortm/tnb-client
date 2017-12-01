import Ember from 'ember';
import Changeset from 'ember-changeset';
import ConsultValidations from '../../../validations/consult';
import VistValidations from '../../../validations/vist';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(ConsultValidations, {
    constants: Constants,
    detailEdit: false,
    delFlag: true,
    dateService: Ember.inject.service("date-service"),
    store: Ember.inject.service("store"),
    dataLoader: Ember.inject.service("data-loader"),
    sexList:Ember.computed(function(){
      let sexList = new Ember.A();
      let man = Ember.Object.create({});
      man.set('name','先生');
      man.set('sex',this.get("dataLoader").findDict('sexTypeMale'));
      sexList.pushObject(man);
      let woman = Ember.Object.create({});
      woman.set('name','女士');
      woman.set('sex',this.get("dataLoader").findDict('sexTypeFemale'));
      sexList.pushObject(woman);
      return sexList;
    }),
    defaultSex:Ember.computed('consultModel',"sexList",function(){
      let consultModel = this.get('consultModel');
      let sexList = this.get('sexList');
      if(consultModel.get('advGender.typecode')){
        return sexList.findBy('sex.typecode',consultModel.get('advGender.typecode'));

      }else{
        return sexList.findBy('sex.typecode','sexTypeFemale');
      }
    }),
    consultObs: function() {
        var model = this.get("consult");
        if (!model) {
            return null;
        }
        var consultModel = new Changeset(model, lookupValidator(ConsultValidations), ConsultValidations);
        this.set("consultModel", consultModel);
    }.observes("consult"),
    //跟进记录
    backvistObs: function() {
        var model = this.get("backvist");
        if (!model) {
            return null;
        }
        var backvistModel = new Changeset(model, lookupValidator(VistValidations), VistValidations);
        this.set("backvistModel", backvistModel);
    }.observes("backvist"),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.consultation-management');
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    abd: function() {},
    defaultStaff: Ember.computed('consult.receiveStaff', 'staffListFirst', function() {
        return this.get('consult.receiveStaff');
    }),
    defaultVisitStaff: Ember.computed('backvist.vistUser', 'staffListFirst', function() {
        return this.get('backvist.vistUser');
    }),
    actions: {
        //咨询人性别
        selectSex(sex){
          this.set('defaultSex',sex);
          this.set('consultModel.advGender',sex.get('sex'));
          console.log('selectSex',sex);
        },
        invalid() {
        },
        //编辑按钮
        detailEditClick: function(consult) {
            this.set('detailEdit', true);
        },
        //取消按钮
        detailCancel: function() {
            var id = this.get('id');
            var editMode = this.get('editMode');
            var mainpageController = App.lookup('controller:business.mainpage');
            this.set('detailEdit', false);
            if (id && editMode == 'edit') {
                this.get("consult").rollbackAttributes();
                this.set("consultModel", new Changeset(this.get("consult"), lookupValidator(ConsultValidations), ConsultValidations));
            } else {
                mainpageController.switchMainPage('consultation-management', {});
            }
        },
        //存储
        saveConsult() {
            if (this.get("delFlag")) {
                var _self = this;
                var consultModel = this.get("consultModel");
                var mainpageController = App.lookup('controller:business.mainpage');
                var editMode = this.get('editMode');
                var id = this.get('id');
                let statusInfo = this.get("dataLoader").findDict(Constants.consultStatus1);
                consultModel.validate().then(function() {
                    if (consultModel.get('errors.length') === 0) {
                      consultModel.set("consultStatus",statusInfo);
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");

                        consultModel.save().then(function() {
                            App.lookup('controller:business.mainpage').showPopTip("保存成功");
                            if (id && editMode == 'edit') {
                                _self.set('detailEdit', false);
                            } else {
                                mainpageController.switchMainPage('consultation-management');
                                _self.set('detailEdit', false);
                            }
                        });
                    } else {
                        consultModel.set("validFlag", Math.random());
                    }
                });
            }
        },
        //删除按钮
        delById: function() {
            this.set("delFlag", false);
            var _self = this;
            var consult=this.get('consult');
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此咨询记录", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                consult.set("delStatus", 1);
                consult.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    _self.set("delFlag", true);
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('consultation-management');
                });
            });
        },
        dpShowAction(e) {
        },
        //接待人
        selectStaff(staff) {
            this.set("staff", staff);
            this.get("consult").set("receiveStaff", staff);
            this.get("consultModel").set("receiveStaff", staff);
        },
        //预约接待人
        selectReceiveStaff(staff) {
            this.get("consult").set("otherReceiveStaff", staff);
            this.get("consultModel").set("otherReceiveStaff", staff);
        },
        //性别字典
        sexSelect: function(sexDict) {
            this.get("consult").set("advGender", sexDict);
        },
        //与老人关系字典
        relationSelect: function(relationDict) {
            this.get("consult").set("consultRelation", relationDict);
        },
        //咨询方式
        channelSelect:function(channelDict){
          this.get("consult").set("consultChannel", channelDict);
        },
        //了解渠道
        sourceSelect:function(sourceDict){
          let list = new Ember.A();
          list.pushObject(sourceDict);
          this.get("consultModel").set("advWay", list);
          this.get("consult").set("advWay", list);
        },
        //老人性别
        customerSexSelect: function(str) {
            // console.log("customerSexDict in", customerSexDict);
            // this.get("consult").set("customerGender", customerSexDict);
            let sexType;
            if(str=='man'){//男
              sexType = this.get("dataLoader").findDict('sexTypeMale');
            }
            if(str=='woman'){//女
              sexType = this.get("dataLoader").findDict('sexTypeFemale');
            }
            this.set('consultModel.customerGender',sexType);
            this.get("consult").set("customerGender", sexType);

        },
        //咨询时间
        changeADVDateAction(date) {
            console.log("date is who", date);
            var stamp = this.get("dateService").timeToTimestamp(date);
            this.set("consultModel.advDate", stamp);
        },
        //预约参观日期
        changeAppointmentAction(date){
          let stamp;
          if(date){
            stamp = this.get("dateService").timeToTimestamp(date);
          }else{
            stamp = null;
          }
          console.log('参观日期：',stamp);
          this.set("consultModel.appointmentDate", stamp);
        },
        //老人生日
        changeBrithAction(date){
          var stamp = this.get("dateService").timeToTimestamp(date);
          this.set("consultModel.customerBrith", stamp);
        },
        //老人自理能力
        abilitySelect: function(abilityDict) {
            this.get("consultModel").set("customerSelfCareAbility", abilityDict);
        },
        //老人咨询人关系
        relationTypeSelect: function(relationDict) {
            this.get("consultModel").set("relationType", relationDict);
        },
        //老人文化程度
        educationSelect: function(educationDict) {
            this.get("consultModel").set("customerEducation", educationDict);
        },
        //老人偏好
        inPreferenceSelect: function(inPreferenceDict) {
            this.get("consult").set("inPreference", inPreferenceDict);
            this.get("consultModel").set("inPreference", inPreferenceDict);
        },
        //入住意向
        liveIntentSelect: function(liveIntentDict) {
            this.get("consultModel").set("liveIntent", liveIntentDict);
        },
        //添加跟进记录
        addBackvist:function(){
          //alert('addBackvist');
          var _self=this;
          var backvist=null;
          if(this.get('consult.id')){
              backvist = this.get('store').createRecord('backvist',{
              customerName:_self.get('consult.advName'),
              customerTel:_self.get('consult.advTel')
            });
            this.set('backvist',backvist);
            console.log('addBackvist:backvist is',this.get('backvist'));
            this.set('showBackvist',true);
          }else {
            App.lookup('controller:business.mainpage').showAlert("请先保存咨询信息！");
          }
        },
        //编辑跟进记录
        editBackvist:function(backvist){
          this.set('showBackvist',true);
          this.set('backvist',backvist);
        },
        //删除跟进记录
        deleteBackvist:function(backvist){
          var _self = this;
          App.lookup('controller:business.mainpage').showConfirm("是否确定删除此跟进记录", function() {
              App.lookup('controller:business.mainpage').openPopTip("正在删除");
              backvist.set("delStatus", 1);
              backvist.save().then(function() {
              //  _self.get('consult.backVistInfos').removeObject(backvist);
                  _self.set('showBackvist',false);
                  App.lookup('controller:business.mainpage').showPopTip("删除成功");
              });
          });
        },
        //保存跟进记录
        saveBackvist:function(){
        var _self = this;
        var backvistModel=this.get('backvistModel');
        var consult = this.get("consult");
        var backvist=this.get('backvist');

        var mainpageController = App.lookup('controller:business.mainpage');
        backvistModel.validate().then(function(){
          if (backvistModel.get('errors.length') === 0){
            backvistModel.set('consultInfo',consult);
            console.log('跟进记录：'+_self.get('consult.backVistInfos.length')+backvist);
            App.lookup('controller:business.mainpage').openPopTip("正在保存");
            backvistModel.save().then(function(){

              _self.get('consult.backVistInfos').pushObject(backvist);
              _self.set('showBackvist',false);
              App.lookup('controller:business.mainpage').showPopTip("保存成功");
            });
          }else {
            backvistModel.set("validFlag", Math.random());
          }
        });
        },
        //弹窗取消按钮
        invitation(){
          this.set('showBackvist',false);
        },
        //跟进类别字典
        accessTypeSelect: function(accessTypeDict) {
            console.log("accessTypeDict in", accessTypeDict);
            this.get("backvistModel").set("accessType", accessTypeDict);
        },
        //负责人
        selectVisitStaff(staff) {
            this.set("staff", staff);
            this.get("backvist").set("vistUser", staff);
            this.get("backvistModel").set("vistUser", staff);
        },
        //跟进时间
        changeDateAction(date) {
            console.log("date is who", date);
            var stamp = this.get("dateService").timeToTimestamp(date);
            this.set("backvistModel.createDateTime", stamp);
        },
        visitLiveIntentSelect(liveIntentDict){
          this.set('backvistModel.liveIntent',liveIntentDict);
        },
    }
});
