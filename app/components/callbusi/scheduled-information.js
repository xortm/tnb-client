import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
import Changeset from 'ember-changeset';
import CustomerbusinessflowValidations from '../../validations/customerbusinessflow';
import lookupValidator from 'ember-changeset-validations';

export default BaseItem.extend(CustomerbusinessflowValidations,{
  store: Ember.inject.service('store'),
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  constants: Constants,
  bedShow:false,

  today:Ember.computed(function(){
    let today = this.get('dateService').getCurrentTime();
    today = this.get("dateService").timestampToTime(today);
    return today;
  }),
  orderDate:Ember.computed('customerbusinessflowModel.@each.orderDate',function(){
    let time = this.get('customerbusinessflowModel.orderDate');
    if(time){
      time = this.get("dateService").timestampToTime(time);
      return time;
    }else{
      return null;
    }

  }),
  defaultBed:Ember.computed('customerbusinessflowInfo.orderBed',function(){
      return this.get('customerbusinessflowInfo.orderBed');
  }),
  defaultStaff:Ember.computed('customerbusinessflowInfo.orderStaff',function(){
      return this.get('customerbusinessflowInfo.orderStaff');
  }),
  customerbusinessflowModel:Ember.computed('customerbusinessflowInfo',function(){
    let model = this.get("customerbusinessflowInfo");
    if (!model) {
        return null;
    }
    if(!model.get('birthdayTime')){
      model.set('birthdayTime',null);
    }
    return new Changeset(model, lookupValidator(CustomerbusinessflowValidations), CustomerbusinessflowValidations);
  }),

  actions:{
    invalid() {},
    //保存
    detailSaveClick: function() {

      let editMode=this.get('editMode');
      let customerbusinessflowModel=this.get('customerbusinessflowModel');
      let customerbusinessflowInfo = this.get('customerbusinessflowInfo');
      let customer = this.get('customer');
      let _self=this;
      let goBack = this.get('goBack');
      let status = this.get("dataLoader").findDict("consultStatus3");
      // let customerStatus = _self.get("dataLoader").findDict("customerStatus0");
      let customerStatus = _self.get("dataLoader").findDict("customerStatusSubmit");//入住暂时已提交
        customerbusinessflowModel.validate().then(function(){
            if(Number(customerbusinessflowModel.get("orderInTime"))<=Number(customerbusinessflowModel.get("orderDate"))){
              customerbusinessflowModel.addError('orderInTime',['入院日期必须大于预定办理日期']);
            }
            if(Number(customerbusinessflowModel.get("orderMoney"))<=0){
              customerbusinessflowModel.addError('orderMoney',['保证金必须大于0']);
            }
            if(customerbusinessflowModel.get('errors.length')===0){
              let curBed = _self.get('store').peekRecord('bed',customerbusinessflowInfo.get('orderBed.id'));
              customer.set('bed',curBed);
              customer.set('name',customerbusinessflowModel.get('cusName'));
              customer.set('sex',customerbusinessflowModel.get('cusSex'));
              customer.set('selfCareAbility',customerbusinessflowModel.get('cusCare'));
              customer.set('cardCode',customerbusinessflowModel.get('cusCardCode'));
              customer.set('customerNative',customerbusinessflowModel.get('cusNative'));
              customer.set('educationLevel',customerbusinessflowModel.get('cusEdu'));
              customer.set('actualDeposit',customerbusinessflowModel.get('orderMoney'));
              customer.set('birthday',customerbusinessflowModel.get('birthday'));
              customer.set('age',customerbusinessflowModel.get('age'));
              customer.set('checkInDate',customerbusinessflowModel.get('orderInTime'));
              customer.set('customerStatus',customerStatus);
              customer.save().then(function(customer){
                customerbusinessflowInfo.set('customer',customer);
                customerbusinessflowInfo.set('status',status);
                customerbusinessflowInfo.set('advName',_self.get('customerbusinessflowModel.advName'));
                customerbusinessflowInfo.set('advTel',_self.get('customerbusinessflowModel.advTel'));
                customerbusinessflowInfo.set('orderRemark',_self.get('customerbusinessflowInfo.orderRemark'));
                customerbusinessflowInfo.set('orderInTime',customerbusinessflowModel.get('orderInTime'));
                customerbusinessflowInfo.set('orderDate',customerbusinessflowModel.get('orderDate'));
                customerbusinessflowInfo.set('orderMoney',customerbusinessflowModel.get('orderMoney'));
              App.lookup('controller:business.mainpage').openPopTip("正在保存");
              customerbusinessflowInfo.save().then(function(){
                let bedStatus = _self.get("dataLoader").findDict("bedStatusAppointment");//预定 预约
                curBed.set("status",bedStatus);// curBed.save();//  因为服务器做的处理 不需要save去保存
                App.lookup('controller:business.mainpage').showPopTip("保存成功");
                if(editMode=='add'){
                  let mainpageController = App.lookup('controller:business.mainpage');
                  if(goBack=='scheduled'){
                    mainpageController.switchMainPage('business-customer');
                  }else{
                    _self.sendAction('changeStatus');
                    //mainpageController.switchMainPage('consultation-management',{saveConsult:true});
                    mainpageController.switchMainPage('business-customer');
                  }
                }else{
                    _self.set('detailEdit',false);
                }
            },function(data){//网络错误容错
              App.lookup("controller:business.mainpage").closePopTip();
              App.lookup("controller:business.mainpage").showAlert("出现未知错误未能成功保存该条信息，请重试");
            });
          });
        }else{
          customerbusinessflowModel.set("validFlag",Math.random());
        }
        },function(data){//网络错误容错
          App.lookup("controller:business.mainpage").showAlert("出现未知错误未能成功保存该条信息，请重试");
        });
    },
    //编辑按钮
    detailEditClick:function(){
      this.set('detailEdit',true);
    },
    //取消
    detailCancel:function(){
      let id=this.get('id');
      let editMode=this.get('editMode');
      let goBack = this.get('goBack');
      if(id&&editMode=='edit'){
        this.set('detailEdit',false);
        this.get('customerbusinessflowInfo').rollbackAttributes();
      }else{
        let mainpageController = App.lookup('controller:business.mainpage');
        if(goBack=='scheduled'){
          mainpageController.switchMainPage('business-customer');
        }else{
          mainpageController.switchMainPage('consultation-management');
        }
      }
    },
    //选择床位
    selectBed(Bed) {
        this.set('customerbusinessflowInfo.orderBed',Bed);
        this.set('customerbusinessflowModel.orderBed',Bed);
    },
    selectBuild(build){
      this.set('chooseBuild',build);
    },
    //选择办理人
    selectStaff(staff){
      this.set('customerbusinessflowInfo.orderStaff',staff);
      this.set('customerbusinessflowModel.orderStaff',staff);
    },
    //选择性别
    sexSelect(sex){
      this.set('customer.sex',sex);
      this.set('customerbusinessflowModel.cusSex',sex);
    },
    //选择籍贯
    nativeSelect(native){
      this.set('customer.customerNative',native);
      this.set('customerbusinessflowModel.cusNative',native);
    },
    //选择自理能力
    abilitySelect(abilityDict){
      this.set('customer.selfCareAbility',abilityDict);
      this.set('customerbusinessflowModel.cusCare',abilityDict);
    },
    //选择教育级别
    educationSelect(educationDict){
      this.set('customer.educationLevel',educationDict);
      this.set('customerbusinessflowModel.cusEdu',educationDict);
    },
    //选择入院日期
    changeOrderInTimeAction(date){
      let stamp = this.get("dateService").timeStringToTimestamp(date);
      this.set("customerbusinessflowModel.orderInTime", stamp);
    },
    //选择预定办理日期
    changeOrderDateAction(date){
      let stamp = this.get("dateService").timeStringToTimestamp(date);
      console.log("stamp",stamp);
      this.set("customerbusinessflowModel.orderDate", stamp);
    },
    changeBirthdayAction(date) {
      console.log('customerinfo is date',date);
        //var stamp = this.get("dateService").getLastSecondStampOfDay(date);
        var stamp = this.get("dateService").timeToTimestamp(date);
        this.set("customerbusinessflowModel.birthday", stamp);
    },
    computedCardCode: function() {
        var cardCode = this.get("customerbusinessflowModel.cusCardCode");
        //计算出生年月日
        var dateStr = cardCode.substring(6, 10) + "-" + cardCode.substring(10, 12) + "-" + cardCode.substring(12, 14);
        var birthday = this.get("dateService").timeStringToTimestamp(dateStr);
        var birthdayTime = this.get("dateService").timestampToTime(birthday);
        this.get("customerbusinessflowModel").set("birthdayTime", birthdayTime);
        //计算年龄
        var momentDate=this.get('dateService').getCurrentTime();
        var momentString=this.get("dateService").formatDate(momentDate, "yyyy");
        var computedStr=cardCode.substring(6, 10);
        var computedAge=parseInt(momentString)-parseInt(computedStr);
        this.get('customerbusinessflowModel').set('age',computedAge);
        //计算性别
        if (parseInt(cardCode.substr(16, 1)) % 2 == 1) {
            var manObj = this.get("dataLoader").findDict(Constants.sexTypeMale);
            console.log("manObj is", manObj);
            this.get("customerbusinessflowModel").set("sexChange", manObj);
            this.get("customerbusinessflowModel").set("cusSex", manObj);
        } else {
            var womanObj = this.get("dataLoader").findDict(Constants.sexTypeFemale);
            this.get("customerbusinessflowModel").set("sexChange", womanObj);
            this.get("customerbusinessflowModel").set("cusSex", womanObj);
        }
    },
    dpShowAction(){},
  }
});
