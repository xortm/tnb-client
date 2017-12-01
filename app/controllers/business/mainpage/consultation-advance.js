import Ember from 'ember';
import ScheduleValidations from '../../../validations/schedule';
import lookupValidator from 'ember-changeset-validations';
import Changeset from 'ember-changeset';
export default Ember.Controller.extend(ScheduleValidations,{
  constants: Constants,
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  dateService: Ember.inject.service("date-service"),
  store: Ember.inject.service("store"),
  dataLoader: Ember.inject.service("data-loader"),
  customerbusinessflowModel:Ember.computed('customerbusinessflowInfo','target',function(){
    let model = this.get("customerbusinessflowInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(ScheduleValidations), ScheduleValidations);
  }),
  //同步床位数据
  bedDataAdjust(callback){
    let _self = this;
    let busi = App.lookup("route:business");
    //通过刷新数据来同步
    this.get('dataLoader').rebuildBuiding(function(){
      callback();
    });
  },
  uploadUrl: Ember.computed('property', function() {
      return this.get("pathConfiger").get("uploadUrl");
  }),
  actions:{
    cancelClick(){
      this.get("mainController").switchMainPage('business-customer');
    },
    invalid(){},
    //上传头像
    uploadSucc: function(response) {
        var model = this.get('model');
        var res = JSON.parse(response);
        console.log("++++res+++++", res);
        this.get("customerbusinessflowModel").set("headImg", res.relativePath);
        console.log("res.relativePath:", res.relativePath);
    },
    changeStatus(){
      var consult=this.store.peekRecord('consultinfo',this.get('consultId'));
      let status = this.get("dataLoader").findDict('consultStatus3');
      consult.set("consultStatus",status);
      consult.save().then(function(){
      });
    },
    abilitySelect(){},
    educationSelect: function(educationDict) {
        this.set("customerbusinessflowModel.customerEducation", educationDict);
    },
    oldManTypeSelect(oldManType){
      this.set("customerbusinessflowModel.customerOldManType", educationDict);
    },
    medicalInsuranceSelect(customerMedicalInsuranceCategory){
      this.set("customerbusinessflowModel.customerMedicalInsuranceCategory", customerMedicalInsuranceCategory);
    },
    //保存预定信息
    saveScheduled(){
      let _self = this;
      let customerbusinessflowModel=this.get('customerbusinessflowModel');
      //查询到预定状态
      let status = this.get("dataLoader").findDict("consultStatus3");
      //将业务表的状态设为预定
      customerbusinessflowModel.set('status',status);
      customerbusinessflowModel.validate().then(function(){
        if(Number(customerbusinessflowModel.get("orderInTime"))<Number(customerbusinessflowModel.get("orderDate"))){
          customerbusinessflowModel.addError('orderInTime',['入院日期必须不小于预定办理日期']);
        }
        if(Number(customerbusinessflowModel.get("orderMoney"))<=0){
          customerbusinessflowModel.addError('orderMoney',['保证金必须大于0']);
        }
        if(customerbusinessflowModel.get('errors.length')===0){
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          customerbusinessflowModel.save().then(function(){
            var consult=_self.store.peekRecord('consultinfo',_self.get('consultId'));
            let status = _self.get("dataLoader").findDict('consultStatus3');
            consult.set("consultStatus",status);
            consult.save().then(function(){
              App.lookup('controller:business.mainpage').showPopTip("保存成功");
              _self.bedDataAdjust(function(){
                _self.get("mainController").switchMainPage('business-customer');
              });
            });
          },function(err){
            let error = err.errors[0];
            if(error.code==="3"){
              customerbusinessflowModel.validate().then(function(){
                customerbusinessflowModel.addError('customerCardCode',['身份证已被占用']);
                customerbusinessflowModel.set("validFlag",Math.random());
                App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
              });
            }
            if(error.code==="9"){
              customerbusinessflowModel.validate().then(function(){
                customerbusinessflowModel.addError('checkInBed',['该床位已被占用']);
                customerbusinessflowModel.set("validFlag",Math.random());
                App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
              });
            }
            if(error.code==='7'){
              customerbusinessflowModel.validate().then(function(){
                customerbusinessflowModel.addError('inContractNO',['合同编号重复']);
                customerbusinessflowModel.set("validFlag",Math.random());
                App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
              });
            }
          });
        }else{
          customerbusinessflowModel.set("validFlag",Math.random());
        }
      });
    },
    //选择经办人
    selectStaff(staff){
        //选择预定办理人
        this.set('customerbusinessflowModel.orderStaff',staff);
    },
    selectBed(Bed) {
        //选择预定床位
        this.set('customerbusinessflowModel.orderBed',Bed);
    },
    //选择楼宇
    selectBuild(build){
      this.set('chooseBuild',build);
    },
    //预定入院日期
    changeOrderInTimeAction(date){
      let stamp = this.get("dateService").timeToTimestamp(date);
      this.set("customerbusinessflowModel.orderInTime", stamp);
    },
    //预定办理日期
    changeOrderDateAction(date){
      let stamp = this.get("dateService").timeToTimestamp(date);
      this.set("customerbusinessflowModel.orderDate", stamp);
    },
    //选择老人生日
    changeBirthdayAction(date) {
        let stamp = this.get("dateService").timeToTimestamp(date);
        this.set("customerbusinessflowModel.customerBrith", stamp);
        var momentDate = this.get('dateService').getCurrentTime();
        var momentString = this.get("dateService").formatDate(momentDate, "yyyy");
        let birthStr = this.get('dateService').formatDate(stamp,"yyyy");
        var computedAge=parseInt(momentString)-parseInt(birthStr);
        if(computedAge>=0){
          this.get('customerbusinessflowModel').set('customerAge',computedAge);
        }
    },
    //根据老人身份证计算生日和性别
    computedCardCode() {
        let cardCode = this.get("customerbusinessflowModel.customerCardCode");
        //计算出生年月日
        let dateStr = cardCode.substring(6, 10) + "-" + cardCode.substring(10, 12) + "-" + cardCode.substring(12, 14);
        let birthday = this.get("dateService").timeStringToTimestamp(dateStr);
        let birthdayTime = this.get("dateService").timestampToTime(birthday);
        this.get("customerbusinessflowModel").set("birthTime", birthdayTime);
        //计算年龄
        var momentDate=this.get('dateService').getCurrentTime();
        var momentString=this.get("dateService").formatDate(momentDate, "yyyy");
        var computedStr=cardCode.substring(6, 10);
        var computedAge=parseInt(momentString)-parseInt(computedStr);
        if(computedAge){
          this.get('customerbusinessflowModel').set('customerAge',computedAge);
        }
        if(cardCode&&cardCode.length==18){
          if (parseInt(cardCode.substr(16, 1)) % 2 == 1) {
              let manObj = this.get("dataLoader").findDict(Constants.sexTypeMale);
              console.log("manObj is", manObj);
              this.get("customerbusinessflowModel").set("customerGender", manObj);
              this.get("customerbusinessflowInfo").set("customerGender", manObj);
          } else {
              let womanObj = this.get("dataLoader").findDict(Constants.sexTypeFemale);
              this.get("customerbusinessflowModel").set("customerGender", womanObj);
              this.get("customerbusinessflowInfo").set("customerGender", womanObj);
          }
        }
    },
    //根据联系人身份证计算性别
    computedFirstCardCode(){
      let guardianFirstCardCode = this.get("customerbusinessflowModel.guardianFirstCardCode");
      //计算性别
      if(guardianFirstCardCode&&guardianFirstCardCode.length==18){
        if (parseInt(guardianFirstCardCode.substr(16, 1)) % 2 == 1) {
            let manObj = this.get("dataLoader").findDict(Constants.sexTypeMale);
            this.get("customerbusinessflowModel").set("guardianFirstGener", manObj);
            this.get("customerbusinessflowInfo").set("guardianFirstGener", manObj);
        } else {
            let womanObj = this.get("dataLoader").findDict(Constants.sexTypeFemale);
            this.get("customerbusinessflowModel").set("guardianFirstGener", womanObj);
            this.get("customerbusinessflowInfo").set("guardianFirstGener", womanObj);
        }
      }
    },
    sexSelect(str){
      // this.get("customerbusinessflowModel").set("customerGender", sex);
      let sexType;
      if(str=='man'){//男
        sexType = this.get("dataLoader").findDict('sexTypeMale');
      }
      if(str=='woman'){//女
        sexType = this.get("dataLoader").findDict('sexTypeFemale');
      }
      this.set('customerbusinessflowModel.customerGender',sexType);
      this.get("customerbusinessflowInfo").set("customerGender", sexType);
    },
    sexSelectFirst(str){
      // this.get("customerbusinessflowModel").set("guardianFirstGener", sex);
      let sexType;
      if(str=='man'){//男
        sexType = this.get("dataLoader").findDict('sexTypeMale');
      }
      if(str=='woman'){//女
        sexType = this.get("dataLoader").findDict('sexTypeFemale');
      }
      this.set('customerbusinessflowModel.guardianFirstGener',sexType);
      this.get("customerbusinessflowInfo").set("guardianFirstGener", sexType);
    },
    selectTown(town){
      this.set('customerbusinessflowModel.town',town);
    },
    relationSelect(relationType){
      this.set('customerbusinessflowModel.firstRelation',relationType);
    },
  }
});
