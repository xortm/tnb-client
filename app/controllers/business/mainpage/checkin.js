import Ember from 'ember';
import Changeset from 'ember-changeset';
import CustomerbusinesscheckinValidations from '../../../validations/customerbusinesscheckin';
import CustomerbusinesstryValidations from '../../../validations/customerbusinesstry';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(CustomerbusinesscheckinValidations,{
  store: Ember.inject.service('store'),
  feedBus: Ember.inject.service("feed-bus"),
  constants:Constants,
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  bedShow:false,
  defaultStaff:Ember.computed('customerbusinessflowInfo.checkInStaff',function(){
      return this.get('customerbusinessflowInfo.checkInStaff');
  }),
  defaultBed:Ember.computed('customerbusinessflowInfo.experienceBed','customerbusinessflowInfo.checkInBed','customerbusinessflowInfo.orderBed',function(){
    if(this.get('customerbusinessflowInfo.checkInBed.id')){
      return this.get('customerbusinessflowInfo.checkInBed');
    }else if(this.get('customerbusinessflowInfo.experienceBed.id')){
      return this.get('customerbusinessflowInfo.experienceBed');
    }else{
      return this.get('customerbusinessflowInfo.orderBed');
    }
  }),
  referencePrice:Ember.computed('customerbusinessflowInfo','customerbusinessflowModel.@each.checkInBed','customerbusinessflowModel.@each.experienceBed','customerbusinessflowModel.@each.customer.diningStandard','project',function(){
    let bedPrice;
    let diningPrice;
    let projectPrice;
    if(this.get('customerbusinessflowModel.checkInBed.price')){
      bedPrice = parseInt(this.get('customerbusinessflowModel.checkInBed.price'));
    }else if(this.get('customerbusinessflowModel.experienceBed.price')){
      bedPrice = parseInt(this.get('customerbusinessflowModel.experienceBed.price'));
    }else if(this.get('customerbusinessflowModel.orderBed.price')){
      bedPrice = parseInt(this.get('customerbusinessflowModel.orderBed.price'));
    }else {
      bedPrice=0;
    }

    if(this.get('customerbusinessflowModel.diningStandard.typeValue')){
      diningPrice = parseInt(this.get('customerbusinessflowModel.diningStandard.typeValue'));
    }else{
      diningPrice = 0;
    }
    if(this.get('project.price')){
      projectPrice = parseInt(this.get('project.price'));
    }else{
      projectPrice = 0;
    }
    let price = bedPrice+diningPrice+projectPrice;
    if(price){
      return price ;
    }else{
      return 0;
    }


  }),
  priceObs:function(){
    let bedPrice;
    let diningPrice;
    let projectPrice;
    if(this.get('customerbusinessflowModel.checkInBed.price')){
      bedPrice = parseInt(this.get('customerbusinessflowModel.checkInBed.price'));
    }else if(this.get('customerbusinessflowModel.experienceBed.price')){
      bedPrice = parseInt(this.get('customerbusinessflowInfo.experienceBed.price'));
    }else if(this.get('customerbusinessflowModel.orderBed.price')){
      bedPrice = parseInt(this.get('customerbusinessflowInfo.orderBed.price'));
    }else{
      bedPrice=0;
    }
    if(this.get('customerbusinessflowModel.diningStandard.typeValue')){
      diningPrice = parseInt(this.get('customerbusinessflowModel.diningStandard.typeValue'));
    }else{
      diningPrice = 0;
    }
    if(this.get('project')){
      projectPrice = parseInt(this.get('project.price'));
    }else{
      projectPrice = 0;
    }
    let price = bedPrice+diningPrice+projectPrice;
    this.set('referencePrice',price);
  }.observes('customerbusinessflowModel.diningStandard','customerbusinessflowModel.checkInBed','customerbusinessflowModel.experienceBed','project'),
  customerbusinessflowModel:Ember.computed('customerbusinessflowInfo','checkIn',function(){
    let model = this.get("customerbusinessflowInfo");
    if (!model) {
        return null;
    }
    if(this.get('editMode')=='direct'){
      if(this.get('checkIn')){
        return new Changeset(model, lookupValidator(CustomerbusinesscheckinValidations), CustomerbusinesscheckinValidations);
      }else{
        console.log('/*-/*-/*-/-*/-*');
        return new Changeset(model, lookupValidator(CustomerbusinesstryValidations), CustomerbusinesstryValidations);
      }
    }else{
      return new Changeset(model, lookupValidator(CustomerbusinesscheckinValidations), CustomerbusinesscheckinValidations);
    }



  }),
  actions:{
    invalid() {
        //alert("error");
    },
    toProject(project){
      let id = project.get("id");
      let mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('nursingproject-detail',{editMode:'edit',id:id});
    },
    //暂存
    stagingAction(){
      let from = this.get('from');
      let customerbusinessflowInfo = this.get('customerbusinessflowInfo');
      let status = this.get("dataLoader").findDict("consultStatus5");
      let _self = this;
      if(!_self.get('customerbusinessflowInfo.checkInBed').content){
        customerbusinessflowInfo.set('checkInBed',_self.get('customerbusinessflowInfo.experienceBed'));
      }
      let curBed = _self.get('store').peekRecord('bed',customerbusinessflowInfo.get('checkInBed.id'));
      let bedStatus = _self.get("dataLoader").findDict("bedStatuscheckIn");
      if(curBed){
        curBed.set('status',bedStatus);
        curBed.save();
      }
      customerbusinessflowInfo.set('tempFlag',1);
      customerbusinessflowInfo.save().then(function(){
        App.lookup('controller:business.mainpage').openPopTip("已暂存");
        let mainpageController = App.lookup('controller:business.mainpage');
        if(from){
            mainpageController.switchMainPage('try-and-stay');
        }else{
            mainpageController.switchMainPage('business-customer');
        }

        App.lookup('controller:business.mainpage').showPopTip("已暂存");
      },function(data){//网络错误容错
        App.lookup("controller:business.mainpage").showAlert("出现未知错误未能成功保存该条信息，请重试");
      });
    },
    //保存
    detailSaveClick: function() {
      let from = this.get('from');
      let editMode=this.get('editMode');
      let customerbusinessflowModel=this.get('customerbusinessflowModel');
      let customerbusinessflowInfo = this.get('customerbusinessflowInfo');
      let _self=this;
      let status = this.get("dataLoader").findDict("consultStatus5");
      if(!_self.get('customerbusinessflowInfo.checkInBed').content){
        customerbusinessflowInfo.set('checkInBed',_self.get('customerbusinessflowInfo.experienceBed'));
      }
      if(this.get('project.price')){
        customerbusinessflowModel.validate().then(function(){
          let curBed;
          if(customerbusinessflowInfo.get('status.typecode')=='consultStatus3'){
            curBed = _self.get('store').peekRecord('bed',customerbusinessflowInfo.get('customer.bed.id'));
            customerbusinessflowInfo.set('checkInBed',curBed);
            customerbusinessflowModel.set('checkInBed',curBed);
          }else{
            curBed = _self.get('store').peekRecord('bed',customerbusinessflowInfo.get('checkInBed.id'));
          }
          let oldBed = _self.get("oldBed");
            let curCustomer = _self.get('store').peekRecord('customer',customerbusinessflowInfo.get('customer.id'));
            // let customerStatus = _self.get("dataLoader").findDict("customerStatusIn");
            let customerStatus = _self.get("dataLoader").findDict("customerStatusSubmit");//入住暂时已提交
            curCustomer.set('customerStatus',customerStatus);
            console.log("-----------customerStatus:",customerStatus.get('typecode'));
            curCustomer.set('checkInDate',customerbusinessflowModel.get('checkInStartTime'));
            curCustomer.set('diningStandard',customerbusinessflowModel.get('diningStandard'));
            curCustomer.set('referencePrice',_self.get('referencePrice'));
            curCustomer.set('actualPrice',customerbusinessflowModel.get('checkInPrice'));
            curCustomer.set('bed',curBed);
            //在保存customer的时候保存合同编号和开始日期和结束日期
            curCustomer.set('contractNO',customerbusinessflowModel.get('inContractNO'));
            curCustomer.set('contractStartDate',customerbusinessflowModel.get('checkInStartTime'));
            curCustomer.set('contractEndDate',customerbusinessflowModel.get('checkInEndTime'));
            curCustomer.save().then(function(){
              if(curBed.get("id")!=oldBed.get("id")){
                let bedStatus = _self.get("dataLoader").findDict("bedStatusIdle");//设置为空闲
                console.log("oldBed tryHBS",oldBed);
                oldBed.set("status",bedStatus);
              }
              customerbusinessflowInfo.set('status',status);
              customerbusinessflowInfo.set('tempFlag',0);
              customerbusinessflowInfo.set('checkInRemark',_self.get('customerbusinessflowInfo.checkInRemark'));
              customerbusinessflowInfo.set('checkInEndTime',customerbusinessflowModel.get('checkInEndTime'));
              customerbusinessflowInfo.set('checkInStartTime',customerbusinessflowModel.get('checkInStartTime'));
              customerbusinessflowInfo.set('checkInDate',customerbusinessflowModel.get('checkInDate'));
              customerbusinessflowInfo.set('checkInPrice',customerbusinessflowModel.get('checkInPrice'));
              customerbusinessflowInfo.set('checkInReferencePrice',customerbusinessflowModel.get('checkInReferencePrice'));
              customerbusinessflowInfo.set('inPreference',customerbusinessflowModel.get('inPreference'));
              customerbusinessflowInfo.set('inContractNO',customerbusinessflowModel.get('inContractNO'));
              if(Number(customerbusinessflowModel.get("checkInEndTime"))<=Number(customerbusinessflowModel.get("checkInStartTime"))){
                customerbusinessflowModel.addError('checkInEndTime',['入住结束日期必须大于入住开始日期']);
              }
              if(Number(customerbusinessflowModel.get("checkInStartTime"))<Number(customerbusinessflowModel.get("checkInDate"))){
                customerbusinessflowModel.addError('checkInStartTime',['入住开始日期必须不小于入住办理日期']);
              }
              if(customerbusinessflowModel.get('errors.length')===0){
                App.lookup('controller:business.mainpage').openPopTip("正在保存");
                customerbusinessflowInfo.save().then(function(){
                 console.log("curBed bedStatuscheckIn",curBed);
                 let bedStatus = _self.get("dataLoader").findDict("bedStatusCheckIn");//入住
                 console.log("curBed bedStatusCheckIn bedStatus",bedStatus);
                 curBed.set("status",bedStatus);// curBed.save();//  因为服务器做的处理 不需要save去保存
                  App.lookup('controller:business.mainpage').showPopTip("保存成功");
                  if(editMode=='add'){
                    let mainpageController = App.lookup('controller:business.mainpage');
                    if(from){
                      mainpageController.switchMainPage('try-and-stay');
                    }else{
                      mainpageController.switchMainPage('business-customer');
                    }
                  }
            },function(data){//网络错误容错
              App.lookup("controller:business.mainpage").closePopTip();
              App.lookup("controller:business.mainpage").showAlert("出现未知错误未能成功保存该条信息，请重试");
            });
            }else{
              customerbusinessflowModel.set("validFlag",Math.random());
            }
            },function(data){//网络错误容错
              App.lookup("controller:business.mainpage").showAlert("出现未知错误未能成功保存该条信息，请重试");
            });

          });
      }else{
        App.lookup('controller:business.mainpage').showAlert("请先设置护理方案");
      }
    },
    //编辑按钮
    detailEditClick:function(){
      this.set('detailEdit',true);
    },
    diningStandardSelect(diningStandard){
      this.set('customerbusinessflowModel.diningStandard',diningStandard);
      this.set('customerbusinessflowInfo.diningStandard',diningStandard);
    },
    inPreferenceSelect(inPreference){
      this.set('customerbusinessflowInfo.inPreference',inPreference);
      this.set('customerbusinessflowModel.inPreference',inPreference);
    },
    //取消
    detailCancel:function(){
      let from = this.get('from');
      let id=this.get('id');
      let editMode=this.get('editMode');
      let mainpageController = App.lookup('controller:business.mainpage');
      if(id&&editMode=='edit'){
        this.set('detailEdit',false);
        if(from){
            mainpageController.switchMainPage('try-and-stay');
        }else{
            mainpageController.switchMainPage('business-customer');
        }
      }else{
        if(from){
            mainpageController.switchMainPage('try-and-stay');
        }else{
            mainpageController.switchMainPage('business-customer');
        }
      }
      if(editMode=='direct'){
        mainpageController.switchMainPage('try-and-stay');
      }
    },
    //选择床位
    selectBed(Bed) {
        this.set('customerbusinessflowInfo.checkInBed',Bed);
        this.set('customerbusinessflowModel.checkInBed',Bed);
    },
    selectBedtry(Bed) {
      this.set('customerbusinessflowInfo.experienceBed',Bed);
      this.set('customerbusinessflowModel.experienceBed',Bed);
    },
    selectBuild(build){
      this.set('chooseBuild',build);
    },
    //选择办理人
    selectStaff(staff){
      if(this.get('checkIn')){
        this.set('customerbusinessflowInfo.checkInStaff',staff);
        this.set('customerbusinessflowModel.checkInStaff',staff);
      }else if (this.get('tryFlag')) {
        this.set('customerbusinessflowInfo.checkInStaff',staff);
        this.set('customerbusinessflowModel.checkInStaff',staff);
      }else{
        this.set('customerbusinessflowInfo.experienceStaff',staff);
        this.set('customerbusinessflowModel.experienceStaff',staff);
      }

    },
    toNursingproject(){
      let mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('nursingproject');
    },
    //选择入院日期
    changeTryEndAction(date){
      //当前选择时间
      let stamp = this.get("dateService").timeStringToTimestamp(date);
      if(this.get('checkIn')){
        this.set("customerbusinessflowModel.checkInEndTime", stamp);
      }else{
        this.set("customerbusinessflowModel.experienceEndTime", stamp);
      }

    },
    changeTryStartAction(date){
      //当前选择时间
      let stamp = this.get("dateService").timeStringToTimestamp(date);
      if(this.get('checkIn')){
        this.set("customerbusinessflowModel.checkInStartTime", stamp);
      }else{
        this.set("customerbusinessflowModel.experienceStartTime", stamp);
      }

    },
    //选择预定办理日期
    changeTryAction(date){
      let stamp = this.get("dateService").timeStringToTimestamp(date);
      if(this.get('checkIn')){
        this.set("customerbusinessflowModel.checkInDate", stamp);
      }else{
        this.set("customerbusinessflowModel.experienceDate", stamp);
      }

    },
    dpShowAction(){},
    toTryIn(){
      this.set('checkIn',false);
    },
    toCheckIn(){
      this.set('checkIn',true);
    },
    //直接入住保存
    directCheckSave: function() {
      let editMode=this.get('editMode');
      let customerbusinessflowModel=this.get('customerbusinessflowModel');
      let customerbusinessflowInfo = this.get('customerbusinessflowInfo');
      let _self=this;
      let status = this.get("dataLoader").findDict("consultStatus5");
        customerbusinessflowModel.validate().then(function(){
          if(!customerbusinessflowModel.get("orderMoney")){
            customerbusinessflowModel.addError('orderMoney',['保证金不能为空']);
          }else{
            if(Number(customerbusinessflowModel.get("orderMoney"))<=0){
              customerbusinessflowModel.addError('orderMoney',['保证金必须大于0']);
            }
          }

          if(Number(customerbusinessflowModel.get("checkInEndTime"))<=Number(customerbusinessflowModel.get("checkInStartTime"))){
            customerbusinessflowModel.addError('checkInEndTime',['入住结束日期必须大于入住开始日期']);
          }
          if(Number(customerbusinessflowModel.get("checkInStartTime"))<Number(customerbusinessflowModel.get("checkInDate"))){
            customerbusinessflowModel.addError('checkInStartTime',['入住开始日期必须不小于入住办理日期']);
          }
          let curBed;
          if(customerbusinessflowInfo.get('status.typecode')=='consultStatus3'){
            curBed = _self.get('store').peekRecord('bed',customerbusinessflowInfo.get('customer.bed.id'));
            customerbusinessflowInfo.set('checkInBed',curBed);
            customerbusinessflowModel.set('checkInBed',curBed);
          }else{
            curBed = _self.get('store').peekRecord('bed',customerbusinessflowInfo.get('checkInBed.id'));
          }
            let curCustomer = _self.get('feedBus.checkInCustomer');
            // let customerStatus = _self.get("dataLoader").findDict("customerStatusIn");
            let customerStatus = _self.get("dataLoader").findDict("customerStatusSubmit");//入住暂时已提交
            curCustomer.set('customerStatus',customerStatus);
            console.log("-----------customerStatus:",customerStatus.get('typecode'));
            curCustomer.set('checkInDate',customerbusinessflowModel.get('checkInStartTime'));
            curCustomer.set('diningStandard',customerbusinessflowModel.get('diningStandard'));
            curCustomer.set('referencePrice',_self.get('referencePrice'));
            curCustomer.set('actualPrice',customerbusinessflowModel.get('checkInPrice'));
            curCustomer.set('actualDeposit',customerbusinessflowModel.get('orderMoney'));
            //在保存customer的时候保存合同编号和开始日期和结束日期
            curCustomer.set('contractNO',customerbusinessflowModel.get('inContractNO'));
            curCustomer.set('contractStartDate',customerbusinessflowModel.get('checkInStartTime'));
            curCustomer.set('contractEndDate',customerbusinessflowModel.get('checkInEndTime'));
            curCustomer.set('bed',curBed);
            curCustomer.save().then(function(customer){
              customerbusinessflowInfo.set('customer',customer);
              customerbusinessflowInfo.set('status',status);
              customerbusinessflowInfo.set('tempFlag',0);
              customerbusinessflowInfo.set('checkInRemark',_self.get('customerbusinessflowInfo.checkInRemark'));
              customerbusinessflowInfo.set('checkInEndTime',customerbusinessflowModel.get('checkInEndTime'));
              customerbusinessflowInfo.set('checkInStartTime',customerbusinessflowModel.get('checkInStartTime'));
              customerbusinessflowInfo.set('checkInDate',customerbusinessflowModel.get('checkInDate'));
              customerbusinessflowInfo.set('checkInPrice',customerbusinessflowModel.get('checkInPrice'));
              customerbusinessflowInfo.set('checkInReferencePrice',customerbusinessflowModel.get('checkInReferencePrice'));
              customerbusinessflowInfo.set('inPreference',customerbusinessflowModel.get('inPreference'));
              customerbusinessflowInfo.set('inContractNO',customerbusinessflowModel.get('inContractNO'));

              if(customerbusinessflowModel.get('errors.length')===0){
                App.lookup('controller:business.mainpage').openPopTip("正在保存");
                customerbusinessflowInfo.save().then(function(){
                  console.log("curBed bedStatuscheckIn",curBed);
                  let bedStatus = _self.get("dataLoader").findDict("bedStatusCheckIn");//入住
                  console.log("curBed bedStatusCheckIn bedStatus",bedStatus);
                  curBed.set("status",bedStatus);// curBed.save();//  因为服务器做的处理 不需要save去保存
                  App.lookup('controller:business.mainpage').showPopTip("保存成功");
                  let mainpageController = App.lookup('controller:business.mainpage');
                  mainpageController.switchMainPage('try-and-stay');
                },function(data){//网络错误容错
                  App.lookup("controller:business.mainpage").closePopTip();
                  App.lookup("controller:business.mainpage").showAlert("出现未知错误未能成功保存该条信息，请重试");
                });
            }else{
              customerbusinessflowModel.set("validFlag",Math.random());
            }
            },function(data){//网络错误容错
              App.lookup("controller:business.mainpage").showAlert("出现未知错误未能成功保存该条信息，请重试");
            });
          });

    },
    //直接试住保存
    directTrySave(){
      let editMode=this.get('editMode');
      let customerbusinessflowModel=this.get('customerbusinessflowModel');
      let customerbusinessflowInfo = this.get('customerbusinessflowInfo');
      let _self=this;
      let status = this.get("dataLoader").findDict("consultStatus4");
        customerbusinessflowModel.validate().then(function(){
          if(!customerbusinessflowModel.get("orderMoney")){
            customerbusinessflowModel.addError('orderMoney',['保证金不能为空']);
          }else{
            if(Number(customerbusinessflowModel.get("orderMoney"))<=0){
              customerbusinessflowModel.addError('orderMoney',['保证金必须大于0']);
            }
          }
          if(Number(customerbusinessflowModel.get("experienceEndTime"))<=Number(customerbusinessflowModel.get("experienceStartTime"))){
            customerbusinessflowModel.addError('experienceEndTime',['试住结束日期必须大于试住开始日期']);
          }
          let curBed = _self.get('store').peekRecord('bed',customerbusinessflowInfo.get('experienceBed.id'));
            let curCustomer = _self.get('feedBus.checkInCustomer');
            // let customerStatus = _self.get("dataLoader").findDict("customerStatusTry");
            let customerStatus = _self.get("dataLoader").findDict("customerStatusSubmit");//试住暂时已提交
            curCustomer.set('customerStatus',customerStatus);
            console.log("-----------customerStatus:",customerStatus.get('typecode'));
            curCustomer.set('diningStandard',customerbusinessflowModel.get('diningStandard'));
            curCustomer.set('bed',curBed);
            curCustomer.set('referencePrice',_self.get('referencePrice'));
            curCustomer.set('actualPrice',customerbusinessflowModel.get('experiencePrice'));
            curCustomer.set('actualDeposit',customerbusinessflowModel.get('orderMoney'));
            curCustomer.set('checkInDate',customerbusinessflowModel.get('experienceStartTime'));
            //在保存customer的时候保存合同编号和开始日期和结束日期
            curCustomer.set('contractNO',customerbusinessflowModel.get('tryContractNO'));
            curCustomer.set('contractStartDate',customerbusinessflowModel.get('experienceStartTime'));
            curCustomer.set('contractEndDate',customerbusinessflowModel.get('experienceEndTime'));
            curCustomer.save().then(function(customer){
              customerbusinessflowInfo.set('customer',customer);
              customerbusinessflowInfo.set('status',status);
              customerbusinessflowInfo.set('tempFlag',0);
              customerbusinessflowInfo.set('experienceRemark',_self.get('customerbusinessflowInfo.experienceRemark'));
              customerbusinessflowInfo.set('experienceEndTime',customerbusinessflowModel.get('experienceEndTime'));
              customerbusinessflowInfo.set('experienceStartTime',customerbusinessflowModel.get('experienceStartTime'));
              customerbusinessflowInfo.set('experienceDate',customerbusinessflowModel.get('experienceDate'));
              customerbusinessflowInfo.set('experiencePrice',customerbusinessflowModel.get('experiencePrice'));
              customerbusinessflowInfo.set('diningStandard',customerbusinessflowModel.get('diningStandard'));
              customerbusinessflowInfo.set('tryContractNO',customerbusinessflowModel.get('tryContractNO'));
              if(customerbusinessflowModel.get('errors.length')===0){
                App.lookup('controller:business.mainpage').openPopTip("正在保存");
                customerbusinessflowInfo.save().then(function(){
                  console.log("curBed bedStatusTryIn",curBed);
                  let bedStatus = _self.get("dataLoader").findDict("bedStatusTryIn");//试住
                  console.log("curBed bedStatusTryIn bedStatus",bedStatus);
                  curBed.set("status",bedStatus);// curBed.save();//  因为服务器做的处理 不需要save去保存
                  App.lookup('controller:business.mainpage').showPopTip("保存成功");
                  let mainpageController = App.lookup('controller:business.mainpage');
                  mainpageController.switchMainPage('try-and-stay');
            },function(data){//网络错误容错
              App.lookup("controller:business.mainpage").closePopTip();
              App.lookup("controller:business.mainpage").showAlert("出现未知错误未能成功保存该条信息，请重试");
            });
            }else{
              customerbusinessflowModel.set("validFlag",Math.random());
            }
            },function(data){//网络错误容错
              App.lookup("controller:business.mainpage").showAlert("出现未知错误未能成功保存该条信息，请重试");
            });

          });
    },
    back(){
      let mainpageController = App.lookup('controller:business.mainpage');
      this.set('isDirectIn',false);
      mainpageController.switchMainPage('try-and-stay');
    },
  }
});
