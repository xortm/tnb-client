import Ember from 'ember';
import Changeset from 'ember-changeset';
import CheckinValidations from '../../../validations/checkin';
import ScheduleValidations from '../../../validations/schedule';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(CheckinValidations,ScheduleValidations,{
  feedBus: Ember.inject.service("feed-bus"),
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  mainController: Ember.inject.controller('business.mainpage'),
  constants: Constants,
  chargeMonth:true,
  chargeDay:false,
  detailEdit:true,
  bedList:Ember.computed('customerbusinessflowInfo',function(){
    let allBedList = this.get('dataLoader.allBedList');
    let allRoomList = this.get('dataLoader.allRoomList');
    let allBuildingList = this.get('dataLoader.allBuildingList');
    if(allBedList.length===0){
      return null;
    }
    let bedList = allBedList.filter(function(bed){
      return bed.get('status.typecode') == 'bedStatusIdle';
    });

    if(this.get('customerbusinessflowInfo.orderBed')){
      bedList.pushObject(this.get('customerbusinessflowInfo.orderBed'));

    }else if(this.get('customerbusinessflowInfo.checkInBed')){
      bedList.pushObject(this.get('customerbusinessflowInfo.checkInBed'));
    }
    return bedList;
  }),
  today:Ember.computed(function(){
    let today = this.get('dateService').getCurrentTime();
    today = this.get("dateService").timestampToTime(today);
    return today;
  }),
  isWeixin:Ember.computed('customerbusinessflowInfo',function(){
    let url = this.get('customerbusinessflowInfo.customer.realUrl');
    if(!url){
      return false;
    }else{
      return true;
    }
  }),
  customerbusinessflowModel:Ember.computed('customerbusinessflowInfo','target','hasProject',function(){
    let model = this.get("customerbusinessflowInfo");
    if (!model) {
        return null;
    }
    let target = this.get('target');
    if(target=="toScheduled"){
      return new Changeset(model, lookupValidator(ScheduleValidations), ScheduleValidations);
    }else{
      return new Changeset(model, lookupValidator(CheckinValidations), CheckinValidations);
    }

  }),
  uploadUrl: Ember.computed('property', function() {
      return this.get("pathConfiger").get("uploadUrl");
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
  checkInReferencePrice:Ember.computed('customerbusinessflowModel',function(){
    let price ,bedPrice ,levelPrice ,diningStandardPrice;

    if(this.get('chargeDay')){
      if(this.get('customerbusinessflowModel.nursinglevel.price')){
        levelPrice = parseInt(this.get('customerbusinessflowModel.nursinglevel.price'));
      }else{
        levelPrice = 0;
      }
      if(this.get('customerbusinessflowModel.checkInBed.price')){
        bedPrice = parseInt(this.get('customerbusinessflowModel.checkInBed.price'));
      }else{
        bedPrice = 0;
      }
      if(this.get('customerbusinessflowModel.diningStandard.typeValue')){
        diningStandardPrice = parseInt(this.get('customerbusinessflowModel.diningStandard.typeValue'));
      }else{
        diningStandardPrice = 0;
      }
    }
    if(this.get('chargeMonth')){
      if(this.get('customerbusinessflowModel.nursinglevel.totalPrice')){
        levelPrice = parseInt(this.get('customerbusinessflowModel.nursinglevel.totalPrice'));
      }else{
        levelPrice = 0;
      }
      if(this.get('customerbusinessflowModel.checkInBed.totalPrice')){
        bedPrice = parseInt(this.get('customerbusinessflowModel.checkInBed.totalPrice'));
      }else{
        bedPrice = 0;
      }
      if(this.get('customerbusinessflowModel.diningStandard.totalPrice')){
        diningStandardPrice = parseInt(this.get('customerbusinessflowModel.diningStandard.totalPrice'));
      }else{
        diningStandardPrice = 0;
      }
    }
    price = levelPrice + bedPrice + diningStandardPrice;
    if(price>0){
      return price;
    }else{
      return 0;
    }
  }),
  checkInReferencePriceObs:function(){
    let price ,bedPrice ,levelPrice ,diningStandardPrice;

    if(this.get('chargeDay')){
      if(this.get('customerbusinessflowModel.nursinglevel.price')){
        levelPrice = parseInt(this.get('customerbusinessflowModel.nursinglevel.price'));
      }else{
        levelPrice = 0;
      }
      if(this.get('customerbusinessflowModel.checkInBed.price')){
        bedPrice = parseInt(this.get('customerbusinessflowModel.checkInBed.price'));
      }else{
        bedPrice = 0;
      }
      if(this.get('customerbusinessflowModel.diningStandard.typeValue')){
        diningStandardPrice = parseInt(this.get('customerbusinessflowModel.diningStandard.typeValue'));
      }else{
        diningStandardPrice = 0;
      }
    }
    if(this.get('chargeMonth')){
      if(this.get('customerbusinessflowModel.nursinglevel.totalPrice')){
        levelPrice = parseInt(this.get('customerbusinessflowModel.nursinglevel.totalPrice'));
      }else{
        levelPrice = 0;
      }
      if(this.get('customerbusinessflowModel.checkInBed.totalPrice')){
        bedPrice = parseInt(this.get('customerbusinessflowModel.checkInBed.totalPrice'));
      }else{
        bedPrice = 0;
      }
      if(this.get('customerbusinessflowModel.diningStandard.totalPrice')){
        diningStandardPrice = parseInt(this.get('customerbusinessflowModel.diningStandard.totalPrice'));
      }else{
        diningStandardPrice = 0;
      }
    }
    price = levelPrice + bedPrice + diningStandardPrice;
    this.set('checkInReferencePrice',price);
  }.observes('customerbusinessflowModel.nursinglevel','customerbusinessflowModel.checkInBed','customerbusinessflowModel.diningStandard',"chargeMonth",'chargeDay'),
  checkInPrice:Ember.computed('customerbusinessflowModel',function(){
    let price ,bedPrice ,levelPrice ,diningStandardPrice;
    if(this.get('customerbusinessflowModel.levelPrice')>0){
      levelPrice = parseInt(this.get('customerbusinessflowModel.levelPrice'));
    }else{
      levelPrice = 0;
    }
    if(this.get('customerbusinessflowModel.bedPrice')>0){
      bedPrice = parseInt(this.get('customerbusinessflowModel.bedPrice'));
    }else{
      bedPrice = 0;
    }
    if(this.get('customerbusinessflowModel.diningStandardPrice')>0){
      diningStandardPrice = parseInt(this.get('customerbusinessflowModel.diningStandardPrice'));
    }else{
      diningStandardPrice = 0;
    }
    price = levelPrice + bedPrice + diningStandardPrice;
    if(price>0){
      return price;
    }else{
      return 0;
    }

  }),
  checkInPriceObs:function(){
    let price ,bedPrice ,levelPrice ,diningStandardPrice;
    if(this.get('customerbusinessflowModel.levelPrice')>0){
      levelPrice = parseInt(this.get('customerbusinessflowModel.levelPrice'));
    }else{
      levelPrice = 0;
    }
    if(this.get('customerbusinessflowModel.bedPrice')>0){
      bedPrice = parseInt(this.get('customerbusinessflowModel.bedPrice'));
    }else{
      bedPrice = 0;
    }
    if(this.get('customerbusinessflowModel.diningStandardPrice')>0){
      diningStandardPrice = parseInt(this.get('customerbusinessflowModel.diningStandardPrice'));
    }else{
      diningStandardPrice = 0;
    }
    price = levelPrice + bedPrice + diningStandardPrice;
    this.set('checkInPrice',price);
  }.observes('customerbusinessflowModel.diningStandardPrice','customerbusinessflowModel.bedPrice','customerbusinessflowModel.levelPrice'),
  actions:{
    invalid(){},
    selectTown:function(town){
      this.set('customerbusinessflowModel.town',town);
    },
    nav(nav){
      let title = document.getElementsByClassName('breadcrumb')[0];
      let title2 = title.getElementsByTagName('li')[2];
      if(title2){
        title2.innerText=nav;
      }
    },
    //取消
    cancelClick(){
      let from = this.get('from');
      let target = this.get('target');
      if(from=='scheduled'){
        if(target=='toCheckIn'){
          this.get("mainController").switchMainPage('try-and-stay');
        }else{
          this.get("mainController").switchMainPage('business-customer');
        }

      }else{
        this.get("mainController").switchMainPage('try-and-stay');
      }

    },
    //保存按钮
    detailSaveClick(){
      let _self = this;
      let customerbusinessflowModel=this.get('customerbusinessflowModel');
      let status;
      if(customerbusinessflowModel.get('customerStatus.typecode')=='customerStatusTry'){
        status = this.get("dataLoader").findDict("consultStatus4");
        customerbusinessflowModel.set('experienceStartTime',customerbusinessflowModel.get('checkInStartTime'));
        customerbusinessflowModel.set('experienceEndTime',customerbusinessflowModel.get('checkInEndTime'));
      }
      if(customerbusinessflowModel.get('customerStatus.typecode')=='customerStatusIn'){
        status = this.get("dataLoader").findDict("consultStatus5");
      }
      customerbusinessflowModel.set('status',status);
      customerbusinessflowModel.set('checkInPrice',this.get('checkInPrice'));
      customerbusinessflowModel.set('totalPrice',this.get('totalPrice'));
      customerbusinessflowModel.validate().then(function(){
        if(Number(customerbusinessflowModel.get("checkInEndTime"))<=Number(customerbusinessflowModel.get("checkInStartTime"))){
          customerbusinessflowModel.addError('checkInEndTime',['入住结束日期必须大于入住开始日期']);
        }
        if(Number(customerbusinessflowModel.get("checkInStartTime"))<Number(customerbusinessflowModel.get("checkInDate"))){
          customerbusinessflowModel.addError('checkInStartTime',['入住开始日期必须不小于入住办理日期']);
        }
        if(customerbusinessflowModel.get('errors.length')===0){
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          let list  = new Ember.A();
          let advWayList = customerbusinessflowModel.get('advWay');
          advWayList.forEach(function(item){
            list.pushObject(item);
          });
          customerbusinessflowModel.set('advWay',list);
          console.log(customerbusinessflowModel.get('inPreference'));
          let inPreferenceList = new Ember.A();
          customerbusinessflowModel.get('inPreference').forEach(function(item){
            inPreferenceList.pushObject(item);
          });
          customerbusinessflowModel.set('inPreference',inPreferenceList);
          customerbusinessflowModel.save().then(function(flow){
            //保存成功后，同步本地的床位状态
            let allBedList = _self.get('dataLoader.allBedList');
            let bed = allBedList.findBy('id',flow.get('checkInBed.id'));
            let status = flow.get('status');
            let bedStatus ;
            if(status.get('typecode')=='consultStatus4'){
              bedStatus = _self.get('dataLoader').findDict('bedStatusTryIn');
            }
            if(status.get('typecode')=='consultStatus5'){
              bedStatus = _self.get('dataLoader').findDict('bedStatusCheckIn');
            }
            bed.set('status',bedStatus);
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            _self.bedDataAdjust(function(){
              _self.get("mainController").switchMainPage('try-and-stay');
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
    //保存预定信息
    saveScheduled(){
      let _self = this;
      let customerbusinessflowModel=this.get('customerbusinessflowModel');
      //查询到预定状态
      let status = this.get("dataLoader").findDict("consultStatus3");
      //将业务表的状态设为预定
      customerbusinessflowModel.set('status',status);
      let customerStatus = this.get('dataLoader').findDict('customerStatus0');
      //将业务表的老人状态设为预订
      customerbusinessflowModel.set('customerStatus',customerStatus);
      customerbusinessflowModel.validate().then(function(){
        if(Number(customerbusinessflowModel.get("orderInTime"))<Number(customerbusinessflowModel.get("orderDate"))){
          customerbusinessflowModel.addError('orderInTime',['入院日期必须不小于预定办理日期']);
        }
        if(Number(customerbusinessflowModel.get("orderMoney"))<=0){
          customerbusinessflowModel.addError('orderMoney',['保证金必须大于0']);
        }
        if(customerbusinessflowModel.get('errors.length')===0){
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          customerbusinessflowModel.set('chargeType',null);
          customerbusinessflowModel.set('bedPrice',null);
          customerbusinessflowModel.save().then(function(flow){
            //保存成功后，同步本地的床位状态
            let allBedList = _self.get('dataLoader.allBedList');
            let bed = allBedList.findBy('id',flow.get('orderBed.id'));
            let bedStatus = _self.get('dataLoader').findDict('bedStatusAppointment');
            bed.set('status',bedStatus);
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            _self.bedDataAdjust(function(){
              _self.get("mainController").switchMainPage('business-customer');
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
                customerbusinessflowModel.addError('orderBed',['该床位已被占用']);
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
    //上传头像
    uploadSucc: function(response) {
        var model = this.get('model');
        var res = JSON.parse(response);
        this.get("customerbusinessflowModel").set("headImg", res.relativePath);
    },
    //选择状态
    selectStatus(status){
      this.set('customerbusinessflowModel.customerStatus',status);
      this.set('customerbusinessflowInfo.customerStatus',status);
      console.log('status name',status.get('typecode'),status.get('typename'));
      if(status.get('typecode')=='customerStatusTry'){
        this.set('tryModel',true);
      }else{
        let chargeType = this.get('dataLoader').findDict('chargeTypeY');
        this.set('customerbusinessflowModel.chargeType',chargeType);
        this.get('customerbusinessflowInfo.chargeType',chargeType);
        this.set('tryModel',false);
        this.set('chargeMonth',true);
        this.set('chargeDay',false);
      }
    },
    educationSelect: function(educationDict) {
        this.set("customerbusinessflowModel.customerEducation", educationDict);
    },
    oldManTypeSelect(oldManType){
      this.set("customerbusinessflowModel.customerOldManType", educationDict);
    },
    sexSelect(str){
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
    medicalInsuranceSelect(customerMedicalInsuranceCategory){
      this.set("customerbusinessflowModel.customerMedicalInsuranceCategory", customerMedicalInsuranceCategory);
    },
    //选择经办人
    selectStaff(staff){
      let target = this.get('target');
      if(target=="toScheduled"){
        //选择预定办理人
        this.set('customerbusinessflowModel.orderStaff',staff);
      }else{
        this.set('customerbusinessflowModel.checkInStaff',staff);
      }

    },
    //选择老人的自理能力
    abilitySelect(){},
    //与老人关系
    relationSelect(relationType){
      this.set('customerbusinessflowModel.firstRelation',relationType);
    },
    //选择餐饮等级
    diningStandardSelect(diningStandard){
      this.set('customerbusinessflowModel.diningStandard',diningStandard);
      this.set('customerbusinessflowInfo.diningStandard',diningStandard);
      if(this.get('chargeDay')){
        this.set('customerbusinessflowModel.diningStandardPrice',diningStandard.get('typeValue'));
      }
      if(this.get('chargeMonth')){
        this.set('customerbusinessflowModel.diningStandardPrice',diningStandard.get('totalPrice'));
      }
    },
    //选择入住偏好
    inPreferenceSelect(inPreference){
      this.set('customerbusinessflowInfo.inPreference',inPreference);
      this.set('customerbusinessflowModel.inPreference',inPreference);
    },
    //选择护理等级
    selectLevel(level){
      this.set('customerbusinessflowModel.nursinglevel',level);
      if(this.get('chargeDay')){
        this.set('customerbusinessflowModel.levelPrice',level.get('price'));
      }
      if(this.get('chargeMonth')){
        this.set('customerbusinessflowModel.levelPrice',level.get('totalPrice'));
      }

    },
    //床位弹层

    //选择床位
    selectBed(Bed) {
      let target = this.get('target');
      if(target=="toScheduled"){
        //选择预定床位
        this.set('customerbusinessflowModel.orderBed',Bed);
      }else{
        this.set('customerbusinessflowModel.checkInBed',Bed);
      }
      if(this.get('chargeDay')){
        this.set('customerbusinessflowModel.bedPrice',Bed.get('price'));
      }
      if(this.get('chargeMonth')){
        let totalPrice = Bed.get('totalPrice')||0;
        this.set('customerbusinessflowModel.bedPrice',totalPrice);
      }

    },
    //选择楼宇
    selectBuild(build){
      this.set('chooseBuild',build);
    },
    //选择入住开始日期
    changeTryStartAction(date){
      //当前选择时间
      let stamp = this.get("dateService").timeToTimestamp(date);
      this.set("customerbusinessflowModel.checkInStartTime", stamp);
    },
    //选择入住结束日期
    changeTryEndAction(date){
      //当前选择时间
      let stamp = this.get("dateService").timeToTimestamp(date);
      this.set("customerbusinessflowModel.checkInEndTime", stamp);
    },
    //选择入住办理日期
    changeTryAction(date){
      let stamp = this.get("dateService").timeToTimestamp(date);
      this.set("customerbusinessflowModel.checkInDate", stamp);
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
    //选择入住类型
    statusSelect(status){
      this.set('customerbusinessflowModel.status',status);
    },
    //选择营销渠道
    advWaySelect(advWay){
      let list = new Ember.A();
      list.pushObject(advWay);
      this.set('customerbusinessflowModel.advWay',list);
      this.set('customerbusinessflowInfo.advWay',list);
    },
    //选择老人生日
    changeBirthdayAction(date) {
        let stamp = this.get("dateService").timeToTimestamp(date);
        this.set("customerbusinessflowModel.customerBrith", stamp);
        // 计算年龄
        var momentDate = this.get('dateService').getCurrentTime();
        var momentString = this.get("dateService").formatDate(momentDate, "yyyy");
        let birthStr = this.get('dateService').formatDate(stamp,"yyyy");
        var computedAge=parseInt(momentString)-parseInt(birthStr);
        if(computedAge){
          this.get('customerbusinessflowModel').set('customerAge',computedAge);
          console.log(computedAge);
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
        // 计算年龄
        var momentDate=this.get('dateService').getCurrentTime();
        var momentString=this.get("dateService").formatDate(momentDate, "yyyy");
        var computedStr=cardCode.substring(6, 10);
        var computedAge=parseInt(momentString)-parseInt(computedStr);
        if(computedAge){
          this.get('customerbusinessflowModel').set('customerAge',computedAge);
        }

        //计算性别
        if(cardCode.length==18){
          if (parseInt(cardCode.substr(16, 1)) % 2 == 1) {
              let manObj = this.get("dataLoader").findDict(Constants.sexTypeMale);
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
      if(guardianFirstCardCode.length==18){
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
    sexSelectFirst(str){
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
    //缴费类型选择
    chargeTypeSelect(chargeType){
      this.set('customerbusinessflowInfo.chargeType',chargeType);
      this.set('customerbusinessflowModel.chargeType',chargeType);
      if(chargeType.get('typecode')=="chargeTypeY"){
        this.set('chargeMonth',true);
        this.set('chargeDay',false);
      }
      if(chargeType.get('typecode')=="chargeTypeD"){
        this.set('chargeMonth',false);
        this.set('chargeDay',true);
      }
    },
  }
});
